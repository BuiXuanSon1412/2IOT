import mqtt from "mqtt";
import { handleSensorMessage } from "../services/rule-engine/mqtt/mqtt.service.js";

let mqttClient = null;

export function initMqttClient(brokerUrl) {
    if (!brokerUrl) {
        throw new Error("MQTT_BROKER_URL is not defined");
    }

    if (mqttClient) {
        return mqttClient;
    }

    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    mqttClient = mqtt.connect(brokerUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
        console.log("MQTT connected");

        mqttClient.subscribe([process.env.MQTT_TOPIC_STATUS], (err) => {
            if (err) {
                console.error("MQTT subscribe failed", err);
            } else {
                console.log(`Subscribed to ${process.env.MQTT_TOPIC_STATUS}`);
            }
        });
    });

    mqttClient.on("message", async (topic, message) => {
        try {
            if (topic === process.env.MQTT_TOPIC_STATUS) {
                await handleSensorMessage(message.toString());
            }
        } catch (err) {
            console.error("MQTT message handling failed", err);
        }
    });

    mqttClient.on("error", (err) => {
        console.error("MQTT error", err);
    });

    return mqttClient;
}

export function getMqttClient() {
    if (!mqttClient) {
        throw new Error("MQTT client not initialized");
    }
    return mqttClient;
}
