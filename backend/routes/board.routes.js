import express from "express";
import { getMqttClient } from "../config/mqtt.js";

const router = express.Router();

router.post('/control', (req, res) => {
  const client = getMqttClient();
  const data = req.body;
  const message = JSON.stringify(data);
  client.publish(process.env.MQTT_TOPIC_CONTROL, message, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error('Publish error:', error);
      res.status(500).send('Failed to publish message');
    } else {
      console.log(`Message: '${message}'`);
      res.status(200).send(`Message: '${message}'`);
    }
  });
});

export default router;