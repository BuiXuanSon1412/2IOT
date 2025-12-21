import {
    getAllSensors,
    addSensors,
} from "../services/sensor/sensor.service.js";

export async function fetchAllSensors (req, res) {
    try {
        const sensors = await getAllSensors();
        res.status(200).json(sensors);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function addListOfSensors (req, res) {
    let sensorsList = req.body.sensors;
    if (typeof sensorsList === 'undefined') {
        return res.status(400).json({ message: "Sensors list is required, req.body.sensors undefined" });
    }
    if (!Array.isArray(sensorsList)) sensorsList = [sensorsList];

    try {
        const addedSensors = await addSensors(sensorsList);
        res.status(201).json(addedSensors);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}