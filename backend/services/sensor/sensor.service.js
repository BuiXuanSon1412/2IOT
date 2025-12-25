import Sensor from "../../models/Sensor.js";

export const getAllSensors = async () => {
    const sensors = await Sensor.find({});
    return sensors;
}

export const addSensors = async (sensors) => {
    if (sensors.length === 0) return [];
    
    const conditions = sensors.map(d => ({
        name: d.name,
        pin: d.pin
    }));

    const existingSensors = await Sensor.find(
        { $or: conditions },
        { name: 1, pin: 1 }
    ).lean();

    const existingSet = new Set(
        existingSensors.map(d =>
            `${d.name}:${d.pin}`
        )
    );

    const toInsert = sensors.filter(d =>
        !existingSet.has(`${d.name}:${d.pin}`)
    );

    if (toInsert.length === 0) return [];

    return await Sensor.insertMany(toInsert);
}