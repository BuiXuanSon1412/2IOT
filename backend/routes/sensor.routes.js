import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { addListOfSensors, fetchAllSensors } from '../controllers/sensor.controller.js';
import { sensorData } from '../data/sensorData.js';

const router = express.Router();

/**
 * @route GET /api/sensors
 * 
 * @example Request
 * GET /api/sensors
 *
 * @example Response 200
 * [
 *   {
 *     "_id": "6652b0fbc0e8b0a1c8d22222",
 *     "name": "Living Room Sensor",
 *     "pin": "A0",
 *     "area": { "room": "Living Room", "floor": "1" },
 *     "status": "online",
 *     "measures": [
 *       { "measure": "temperature", "snapshotValue": 26.5, "unit": "°C" },
 *       { "measure": "humidity", "snapshotValue": 58, "unit": "%" }
 *     ],
 *     "createdAt": "2025-03-11T07:42:12.000Z"
 *   }
 * ]
 *
 * @example Response 401
 * { "message": "Missing token" }
 */
router.get('/', authenticate, fetchAllSensors);

/**
 * @route POST /api/sensors
 * 
 * @example Request (Single Sensor)
 * {
 *   "sensors": {
 *     "name": "Bedroom Sensor",
 *     "pin": "A1",
 *     "area": { "room": "Bedroom", "floor": "2" },
 *     "measures": [
 *       { "measure": "temperature", "unit": "°C" }
 *     ]
 *   }
 * }
 *
 * @example Request (Multiple Sensors)
 * {
 *   "sensors": [
 *     {
 *       "name": "Kitchen Sensor",
 *       "pin": "A2",
 *       "area": { "room": "Kitchen", "floor": "1" },
 *       "measures": [
 *         { "measure": "temperature", "unit": "°C" },
 *         { "measure": "humidity", "unit": "%" }
 *       ]
 *     },
 *     {
 *       "name": "Garage Sensor",
 *       "pin": "A3",
 *       "area": { "room": "Garage", "floor": "1" },
 *       "measures": [
 *         { "measure": "light", "unit": "lux" }
 *       ]
 *     }
 *   ]
 * }
 *
 * @example Response 201
 * [
 *   {
 *     "_id": "6652b24dc0e8b0a1c8d33333",
 *     "name": "Bedroom Sensor",
 *     "pin": "A1",
 *     "area": { "room": "Bedroom", "floor": "2" },
 *     "measures": [
 *       { "measure": "temperature", "snapshotValue": null, "unit": "°C" }
 *     ]
 *   }
 * ]
 *
 * @example Response 403
 * { "message": "Forbidden" }
 *
 * @example Response 400
 * { "message": "Sensors list is required, req.body.sensors undefined" }
 */
router.post('/', authenticate, authorize('admin'), addListOfSensors); 

router.get('/analytic', authenticate, (req, res) => {
    const data = sensorData;

    res.json(data);
});

export default router;