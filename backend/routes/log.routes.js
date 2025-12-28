import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import {
  fetchLogsByDateRange,
  fetchLogsBySource,
  fetchAggregatedDeviceLogs,
  fetchAggregatedSensorLogs,
  fetchHourlyDeviceActivity,
  fetchDeviceUsageByRoom,
  addLog
} from '../controllers/log.controller.js';

const router = express.Router();

/**
 * @route GET /api/logs
 * @desc Get logs by date range
 * @query startDate, endDate, sourceType (optional)
 * 
 * @example GET /api/logs?startDate=2025-12-10&endDate=2025-12-20&sourceType=Device
 * 
 * @example Response 200
 * [
 *   {
 *     "_id": "...",
 *     "sourceId": "...",
 *     "sourceType": "Device",
 *     "timestamp": "2025-12-18T15:59:22.017Z",
 *     "state": { "brightness": 595.4 },
 *     "trigger": "polling"
 *   }
 * ]
 */
router.get('/', authenticate, fetchLogsByDateRange);

/**
 * @route GET /api/logs/source/:sourceId
 * @desc Get logs by source ID
 * @param sourceId - Device or Sensor ID
 * @query limit (optional, default: 100)
 * 
 * @example GET /api/logs/source/694faab04ad1cd2c700507d4?limit=50
 */
router.get('/source/:sourceId', authenticate, fetchLogsBySource);

/**
 * @route GET /api/logs/analytics/devices
 * @desc Get aggregated device usage statistics
 * @query startDate, endDate
 * 
 * @example GET /api/logs/analytics/devices?startDate=2025-12-10&endDate=2025-12-20
 * 
 * @example Response 200
 * [
 *   {
 *     "deviceId": "...",
 *     "deviceName": "Living Room Light",
 *     "deviceType": "Light",
 *     "date": "2025-12-18",
 *     "avgState": 156.3,
 *     "minState": 0,
 *     "maxState": 255,
 *     "count": 288,
 *     "activeHours": 24
 *   }
 * ]
 */
router.get('/analytics/devices', authenticate, fetchAggregatedDeviceLogs);

/**
 * @route GET /api/logs/analytics/sensors
 * @desc Get aggregated sensor readings
 * @query startDate, endDate
 * 
 * @example Response 200
 * [
 *   {
 *     "sensorId": "...",
 *     "sensorName": "DHT22_Sensor",
 *     "date": "2025-12-18",
 *     "avgTemperature": 28.4,
 *     "avgHumidity": 67.4,
 *     "minTemperature": 18.2,
 *     "maxTemperature": 32.1,
 *     "count": 288
 *   }
 * ]
 */
router.get('/analytics/sensors', authenticate, fetchAggregatedSensorLogs);

/**
 * @route GET /api/logs/analytics/hourly
 * @desc Get hourly device activity patterns
 * @query startDate, endDate
 * 
 * @example Response 200
 * [
 *   {
 *     "hour": 18,
 *     "totalActivity": 145,
 *     "devices": [
 *       { "type": "Light", "count": 85, "avgState": 180.5 },
 *       { "type": "Fan", "count": 60, "avgState": 120.3 }
 *     ]
 *   }
 * ]
 */
router.get('/analytics/hourly', authenticate, fetchHourlyDeviceActivity);

/**
 * @route GET /api/logs/analytics/rooms
 * @desc Get device usage by room
 * @query startDate, endDate
 * 
 * @example Response 200
 * [
 *   {
 *     "room": "Living Room",
 *     "floor": "Floor 1",
 *     "activeCount": 1250,
 *     "totalLogs": 2880,
 *     "deviceCount": 3,
 *     "activityRate": 43.4
 *   }
 * ]
 */
router.get('/analytics/rooms', authenticate, fetchDeviceUsageByRoom);

/**
 * @route POST /api/logs
 * @desc Create a new log entry (admin only)
 * @access Admin
 * 
 * @example Request Body
 * {
 *   "sourceId": "694faab04ad1cd2c700507d4",
 *   "sourceType": "Device",
 *   "timestamp": "2025-12-18T15:59:22.017Z",
 *   "state": { "brightness": 255 },
 *   "trigger": "manual"
 * }
 */
router.post('/', authenticate, authorize('admin'), addLog);

export default router;

// ADD TO backend/app.js:
// import logRoutes from "./routes/log.routes.js";
// app.use("/api/logs", logRoutes);
