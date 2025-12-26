import mongoose from "mongoose";
import Device from "../../models/Device.js";

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

    const newLastSeenAt = (newStatus == "online" ? new Date() : undefined);

    const device = await Device.findOneAndUpdate(
        { _id: _id },
        { $set: { status: newStatus, lastSeenAt: newLastSeenAt } },
        { new: true }
    );

    if (!device) return null;

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


export const updateUserPermissionOnDevice = async (userId, devicePin, permissionLevel) => {
    if (!["configurable", "control"].includes(permissionLevel)) {
        throw new Error("Invalid permission level");
    }

    const device = Device.findOne({ pin: devicePin });
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

function normalizeAutoBehavior(rule) {
    return JSON.stringify({
        measure: rule.measure,
        range: rule.range ?? null,
        action: [...rule.action]
            .map(a => ({ name: a.name, value: a.value }))
            .sort((a, b) => a.name.localeCompare(b.name))
    });
}

export const addAutoBehavior = async (devicePin, measure, range, action) => {
    if (!devicePin) {
        throw new Error("devicePin is required");
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

    const rule = {
        measure,
        range,
        action: theActions
    };

    const device = await Device.findOne({ pin: devicePin });

    if (!device) {
        throw new Error("Device not found");
    }

    const existingSet = new Set(device.settings.autoBehavior.map(normalizeAutoBehavior));
    const newRuleKey = normalizeAutoBehavior(rule);

    if (existingSet.has(newRuleKey)) {
        throw new Error("Duplicate auto behavior rule");
    }

    device.settings.autoBehavior.push(rule);
    await device.save();

    return device;
};

export const removeAutoBehavior = async (devicePin, measure, range, action) => {
    if (!devicePin) {
        throw new Error("devicePin and autoBehaviorId are required");
    }

    const updatedDevice = await Device.findOneAndUpdate(
        { pin: devicePin },
        {
            $pull: {
                "settings.autoBehavior": { 
                    measure: measure,
                    range: range,
                    action: action
                }
            }
        },
        {
            new: true
        }
    );

    if (!updatedDevice) {
        throw new Error("Device not found or cannot remove the automation rule");
    }

    return updatedDevice;
};

function normalizeSchedule(rule) {
    return JSON.stringify({
        cronExpression: rule.cronExpression,
        action: [...rule.action]
            .map(a => ({ name: a.name, value: a.value }))
            .sort((a, b) => a.name.localeCompare(b.name))
    });
}

export const addSchedules = async (devicePin, cronExpression, action) => {
    if (!devicePin) {
        throw new Error("devicePin is required");
    }

    if (!cronExpression || !action) {
        throw new Error("Invalid schedule payload");
    }

    let theActions = [];
    if (!Array.isArray(action)) theActions.push(action);
    else theActions.push(...action);

    if (theActions.length === 0) {
        throw new Error("Action length is 0");
    }

    const device = await Device.findOne({ pin: devicePin });
    if (!device) throw new Error("Device not found");

    const existingSet = new Set(device.settings.schedules.map(normalizeSchedule));

    const schedule = {
        cronExpression,
        action: theActions
    };

    const newRuleKey = normalizeSchedule(schedule);
    if (existingSet.has(newRuleKey)) {
        throw new Error("Duplicate scheduled rule");
    }

    device.settings.schedules.push(schedule);
    await device.save();

    return device;
};

export const removeSchedules = async (devicePin, cronExpression, action) => {
    if (!devicePin) {
        throw new Error("devicePin and autoBehaviorId are required");
    }

    const updatedDevice = await Device.findOneAndUpdate(
        { pin: devicePin },
        {
            $pull: {
                "settings.schedules": { 
                    cronExpression: cronExpression,
                    action: action
                }
            }
        },
        {
            new: true
        }
    );

    if (!updatedDevice) {
        throw new Error("Device not found or cannot remove the automation rule");
    }

    return updatedDevice;
};