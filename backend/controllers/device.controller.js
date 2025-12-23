import {
    getAllDevices,
    addDevices,
    updateDeviceStatusById,
    updateUserPermissionOnDevice,
    removeDevicesById
} from "../services/device/device.service.js";

export async function fetchAllDevices (req, res) {
    try {
        const devices = await getAllDevices();
        res.status(200).json(devices);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function addListOfDevices (req, res) {
    let devicesList = req.body.devices;
    if (typeof devicesList === 'undefined') {
        return res.status(400).json({ message: "Devices list is required, req.body.devices is undefined" });
    }
    if (!Array.isArray(devicesList)) devicesList = [devicesList];

    try {
        const addedDevices = await addDevices(devicesList);
        res.status(201).json(addedDevices);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteDevices (req, res) {
    let ids = req.body.ids;
    if (typeof ids === 'undefined') {
        return res.status(400).json({ message: "Device names are required" });
    }
    if (!Array.isArray(ids)) ids = [ids];

    try {
        const result = await removeDevicesById(ids);
        res.status(200).json({ deletedCount: result.deletedCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    } 
}

export async function toggleDeviceStatus (req, res) {
    const { _id, newStatus } = req.body;
    if (typeof _id === 'undefined' || typeof newStatus === 'undefined') {
        return res.status(400).json({ message: "Device id and new status are required" });
    }

    try {
        const updatedDevice = await updateDeviceStatusById(_id, newStatus);
        res.status(200).json(updatedDevice);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function changePermissionOfUserOnDevice (req, res) {
    try {
        const { userId, devicePin, permissionLevel } = req.body;
        const updatedDevice = updateUserPermissionOnDevice(userId, devicePin, permissionLevel);
        if (!updatedDevice) return res.status(500).json({ message: "Device not found" });

        res.status(200).json(updatedDevice);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}