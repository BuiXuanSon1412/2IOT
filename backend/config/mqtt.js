import mqtt from "mqtt";
// MQTT Client Setup
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://test.mosquitto.org:1883`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

export const TOPIC_SENSOR = 'iot/project/sensor';
export const TOPIC_CONTROL = 'iot/project/control';

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe([TOPIC_SENSOR], () => {
    console.log(`Subscribed to topic '${TOPIC_SENSOR}'`);
  });
});

client.on('message', (topic, message) => {
  if (topic === TOPIC_SENSOR) {
    console.log(`Received message on '${TOPIC_SENSOR}': ${message.toString()}`);
    // TODO
  }
});

export default client;