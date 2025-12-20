import {
    getAllDevices,
    addDevices,
    removeDevicesByName,
    updateDeviceStatusByName
} from "../services/device/device.service.js";

export async function fetchAll (req, res) {
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
        return res.status(400).json({ message: "Devices list is required" });
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
    let names = req.body.names;
    if (typeof names === 'undefined') {
        return res.status(400).json({ message: "Device names are required" });
    }
    if (!Array.isArray(names)) names = [names];

    try {
        const result = await removeDevicesByName(names);
        res.status(200).json({ deletedCount: result.deletedCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function toggleDeviceStatus (req, res) {
    const { name, newStatus } = req.body;
    if (typeof name === 'undefined' || typeof newStatus === 'undefined') {
        return res.status(400).json({ message: "Device name and new status are required" });
    }

    try {
        const updatedDevice = await updateDeviceStatusByName(name, newStatus);
        res.status(200).json(updatedDevice);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}