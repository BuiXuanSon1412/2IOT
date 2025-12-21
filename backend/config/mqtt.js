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

export const TOPIC_STATUS = 'iot/project/status';
export const TOPIC_CONTROL = 'iot/project/control';

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe([TOPIC_STATUS], () => {
    console.log(`Subscribed to topic '${TOPIC_STATUS}'`);
  });
});

client.on('message', (topic, message) => {
  if (topic === TOPIC_STATUS) {
    console.log(`Received message on '${TOPIC_STATUS}': ${message.toString()}`);
    // TODO
  }
});

export default client;