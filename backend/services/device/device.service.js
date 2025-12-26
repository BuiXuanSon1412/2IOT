import mongoose from "mongoose";
import Device from "../../models/Device.js";
import { publishControlCommand } from "../rule-engine/mqtt/mqtt.service.js";
import { cacheScheduleRule, removeScheduleRule, buildRedisRule } from "../rule-engine/redis/redis.service.js";

export const getDeviceById = async (deviceId) => {
    const device = await Device.findById({ deviceId });
    if (!device) return null;
    return device;
};

export const getAllDevices = async () => {
    const devices = await Device.find({});
    return devices;
}

export const getDeviceByName = async (name) => {
    const device = await Device.findOne({ name: name });
    if (!device) return null;
    return device;
}

export const addDevices = async (devices) => {
    if (devices.length === 0) return [];

    const conditions = devices.map(d => ({
        name: d.name,
        deviceType: d.deviceType,
        pin: d.pin
    }));

    const existingDevices = await Device.find(
        { $or: conditions },
        { name: 1, deviceType: 1, pin: 1 }
    ).lean();

    const existingSet = new Set(
        existingDevices.map(d =>
            `${d.name}:${d.deviceType}:${d.pin}`
        )
    );

    const toInsert = devices.filter(d =>
        !existingSet.has(`${d.name}:${d.deviceType}:${d.pin}`)
    );

    if (toInsert.length === 0) return [];

    return await Device.insertMany(toInsert);
};

export const removeDevicesById = async (ids) => {
    return await Device.deleteMany({ _id: { $in: ids } });
}

export const updateDeviceStatusById = async (_id, newStatus) => {
    if (!["online", "offline"].includes(newStatus)) {
        throw new Error("Invalid status");
    }

    const device = await Device.findById(_id);
    if (!device) return null;

    device.status = newStatus;
    await device.save();

    const action = [{
        name: "power",
        value: (newStatus === "online" ? 1 : 0)
    }];

    publishControlCommand(device.homeId, device.name, action); 

    return device;
}

export const updateDevicePinByName = async (name, newPin) => {
    const device = await Device.findOneAndUpdate(
        { name: name },
        { $set: { pin: newPin } },
        { new: true }
    );

    if (!device) return null;

    return device;
};

export const updateCharacteristicById = async (_id, userId, characteristics) => {
    let theChars = [];
    if (!Array.isArray(characteristics)) theChars.push(characteristics);
    else theChars.push(...characteristics);

    if (theChars.length === 0) {
        throw new Error("Action length is 0");
    }

    const device = await Device.findById(_id);
    if (!device) return null;

    const permitted = device.permittedUsers?.some(p =>
        p.userId.toString() === userId.toString() &&
        ["configurable", "control"].includes(p.permissionLevel)
    );

    if (!permitted) {
        throw new Error("Permission denied: user cannot update device characteristics");
    }

    const current = device.characteristic ?? [];

    const map = new Map(
        current.map(c => [c.name, c])
    );

    for (const incoming of theChars) {
        if (!incoming?.name) continue;

        if (map.has(incoming.name)) {
            const existing = map.get(incoming.name);

            if (incoming.value !== undefined) {
                existing.value = String(incoming.value);
            }

            if (incoming.unit !== undefined) {
                existing.unit = incoming.unit;
            }
        } else {
            map.set(incoming.name, {
                name: incoming.name,
                unit: incoming.unit ?? null,
                value: String(incoming.value ?? "")
            });
        }
    }

    device.characteristic = Array.from(map.values());

    await device.save();
    return device;
};

export const updateUserPermissionOnDevice = async (userId, name, permissionLevel) => {
    if (!["configurable", "control"].includes(permissionLevel)) {
        throw new Error("Invalid permission level");
    }

    const device = Device.findOne({ name: name });
    if (!device) {
        return null;
    }

    const userObjectId = mongoose.Types.ObjectId(userId);

    const existingPermission = device.permittedUsers.find(
        (p) => p.userId.equals(userObjectId)
    );
    
    if (existingPermission) {
        existingPermission.permissionLevel = permissionLevel;
    }
    else {
        device.permittedUsers.push({
            userId: userObjectId,
            permissionLevel
        });
    }

    await device.save();
    return device; 
};

export const addAutoBehavior = async (name, measure, range, action) => {
    if (!name) {
        throw new Error("Device name is required");
    }

    if (!measure || !range || !action) {
        throw new Error("Invalid autoBehavior rule payload");
    }

    let theActions = [];
    if (!Array.isArray(action)) theActions.push(action);
    else theActions.push(...action);

    if (theActions.length === 0) {
        throw new Error("Action length is 0");
    }
    
    const device = await Device.findOne({ name: name });
    if (!device) {
        throw new Error("Device not found");
    }

    const rule = {
        name,
        measure,
        range,
        action: theActions
    };
    const redisRule = buildRedisRule(rule);

    const exists = device.settings.autoBehavior.some(r =>
        buildRedisRule({ ...r.toObject(), name }) === redisRule
    );

    if (exists) throw new Error("Duplicate auto behavior rule");

    device.settings.autoBehavior.push({ measure, range, action });
    await device.save();

    await addRuleToRedis({
        homeId: device.homeId.toString(),
        measure,
        rule: redisRule
    });

    return device;
};

export const removeAutoBehavior = async (name, measure, range, action) => {
    const device = await Device.findOne({ name: name });
    if (!device) throw new Error("Device not found");

    const redisRule = buildRedisRule({
        name,
        measure,
        range,
        action
    });

    device.settings.autoBehavior = device.settings.autoBehavior.filter(r =>
        buildRedisRule({ ...r.toObject(), name }) !== redisRule
    );

    await device.save();

    await removeRuleFromRedis({
        homeId: device.homeId.toString(),
        measure,
        rule: redisRule
    });

    return device;
};

function normalizeSchedule(rule) {
    return JSON.stringify({
        cronExpression: rule.cronExpression,
        action: [...rule.action]
            .map(a => ({ name: a.name, value: a.value }))
            .sort((a, b) => a.name.localeCompare(b.name))
    });
}

export const addSchedules = async (name, cronExpression, action) => {
    if (!name) throw new Error("Device name is required");
    if (!cronExpression || !action) throw new Error("Invalid schedule payload");

    const actions = Array.isArray(action) ? action : [action];
    if (actions.length === 0) throw new Error("Action length is 0");

    const device = await Device.findOne({ name: name });
    if (!device) throw new Error("Device not found");

    const schedule = {
        cronExpression: cronExpression.trim(),
        action: actions
    };

    const newRuleKey = normalizeSchedule(schedule);
    const existingSet = new Set(
        device.settings.schedules.map(normalizeSchedule)
    );

    if (existingSet.has(newRuleKey)) {
        throw new Error("Duplicate scheduled rule");
    }

    device.settings.schedules.push(schedule);
    await device.save();

    await cacheScheduleRule({
        homeId: device.homeId.toString(),
        name: device.name,
        cronExpression: schedule.cronExpression,
        action: schedule.action
    });

    return device;
};

export const removeSchedules = async (name, cronExpression, action) => {
    if (!name) throw new Error("Device name is required");

    const actions = Array.isArray(action) ? action : [action];
    const target = normalizeSchedule({
        cronExpression: cronExpression.trim(),
        action: actions
    });

    const device = await Device.findOne({ name: name });
    if (!device) throw new Error("Device not found");

    const idx = device.settings.schedules.findIndex(
        s => normalizeSchedule(s) === target
    );

    if (idx === -1) {
        throw new Error("Schedule not found");
    }

    const [removed] = device.settings.schedules.splice(idx, 1);
    await device.save();

    await removeScheduleRule({
        homeId: device.homeId.toString(),
        name: device.name,
        cronExpression: removed.cronExpression,
        action: removed.action
    });

    return device;
};