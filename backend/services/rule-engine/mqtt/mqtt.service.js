import { getMqttClient } from "../../../config/mqtt.js";
import { writeSensorPoint } from "../influxDb/influxDb.service.js";
import { evaluateRules } from "../rule/rule.service.js";

export function publishControlCommand(homeId, devicePin, action) {
    const client = getMqttClient();
    const topic = process.env.MQTT_CONTROL_TOPIC;

    const payload = {
        source: "rule-engine",
        timestamp: Date.now(),
        devicePin,
        action
    };

    client.publish(topic, JSON.stringify(payload), { qos: 1 });
}

export async function handleSensorMessage(message) {
    const m = JSON.parse(message.toString());

    for (const obj of m) {
        const homeId = obj.homeId;
        const sensorPin = obj.sensorPin;
        const measure = obj.measure;
        const value = obj.value;
        const timestamp = Date.now();
        writeSensorPoint({ homeId, sensorPin, measure, value, timestamp });
        await evaluateRules({ homeId, measure, value });
    }
}