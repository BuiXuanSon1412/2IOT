const express = require('express');
const path = require('path')
const cors = require('cors');
const mqtt = require('mqtt');
require("dotenv").config();
 
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});

// MQTT Client Setup
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://test.mosquitto.org:1883`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

const TOPIC_SENSOR = 'iot/project/sensor';
const TOPIC_CONTROL = 'iot/project/control';

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

// Endpoint to control devices
app.post('/control', (req, res) => {
  const data = req.body;
  const message = JSON.stringify(data);
  client.publish(TOPIC_CONTROL, message, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error('Publish error:', error);
      res.status(500).send('Failed to publish message');
    } else {
      console.log(`Message: '${message}'`);
      res.status(200).send(`Message: '${message}'`);
    }
  });
});