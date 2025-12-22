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

export const updateSnapshotValuesById = async (sensorId, payload) => {
    if (typeof payload !== "object") {
        throw new Error("Payload is not object");
    }

    const updates = [];

    for (const [key, value] of Object.entries(payload)) {
        updates.push({
            updateOne: {
                filter: {
                    _id: sensorId,
                    "measures.measure": key
                },
                update: {
                    $set: {
                        "measures.$.snapshotValue": value
                    }
                }
            }
        });
    }

    if (updates.length === 0) return null;

    const result = await Sensor.bulkWrite(updates);
    return result;
};

// TODO: Optimal solution for logging time-series data