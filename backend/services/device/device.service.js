import Device from "../../models/device/Device.js";

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

export const removeDevicesByName = async (names) => {
    return await Device.deleteMany({ name: { $in: names } });
}

export const updateDeviceStatusByName = async (name, newStatus) => {
    if (!["online", "offline"].includes(newStatus)) {
        throw new Error("Invalid status");
    }

    const newLastSeenAt = (newStatus == "online" ? new Date() : undefined);

    const device = await Device.findOneAndUpdate(
        { name: name },
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
