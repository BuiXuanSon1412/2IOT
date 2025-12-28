import { getMqttClient } from "../../../config/mqtt.js";
import { getSocket } from "../../../config/socket.js";
import { writeSensorPoint } from "../influxDb/influxDb.service.js";
import { evaluateRules } from "../rule/rule.service.js";

export function publishControlCommand(homeId, name, action) {
    const client = getMqttClient();
    const topic = process.env.MQTT_TOPIC_CONTROL;

    const payload = {
        name, // LED1 / FAN1
        action
    };

    client.publish(topic, JSON.stringify(payload), { qos: 1 });

    console.log("Publish:", payload);
}

export async function handleSensorMessage(message) {
    const io = getSocket();
    const m = JSON.parse(message.toString());

    for (const obj of m) {
        const homeId = obj.homeId; 
        const name = obj.name;
        const measure = obj.measure; // temperature 
        const value = obj.value;
        const timestamp = Date.now();
        // writeSensorPoint({ homeId, name, measure, value, timestamp });
        await evaluateRules({ homeId, measure, value });

        io.emit("sensor:update", {
            homeId, name, measure, value, timestamp
        });
    }
}