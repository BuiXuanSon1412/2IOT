import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { addListOfDevices, changePermissionOfUserOnDevice, deleteDeviceAutoBehavior, deleteDevices, deleteDeviceSchedules, fetchAllDevices, toggleDeviceStatus, updateDeviceAutoBehavior, updateDeviceCharacteristicById, updateDeviceSchedules } from '../controllers/device.controller.js';
import { deviceData } from '../data/deviceData.js';

const router = express.Router();

/**
 * @route GET /api/devices
 * 
 * @example Response 200
 * [
 *   {
 *     "_id": "6651a4f2c0e8b0a1c8d12345",
 *     "name": "Living Room Light",
 *     "deviceType": "light",
 *     "pin": "D13",
 *     "status": "online",
 *     "area": { "room": "Living Room", "floor": "1" },
 *     "permittedUsers": [],
 *     "createdAt": "2025-03-10T08:12:21.432Z",
 *     ...
 *   }
 * ]
 *
 * @example Response 401
 * { "message": "Missing token" } || undefined
 */
router.get('/', authenticate, fetchAllDevices);

/**
 * @route POST /api/devices
 * 
 * @header  Authorization: Bearer <ADMIN_ACCESS_TOKEN>
 * @header  Content-Type: application/json
 *
 * @example Request (Single)
 * {
 *   "devices": {
 *     "name": "Bedroom Fan",
 *     "deviceType": "fan",
 *     "pin": "D5",
 *     "area": { "room": "Bedroom", "floor": "2" }
 *   }
 * }
 *
 * @example Request (Multiple)
 * {
 *   "devices": [
 *     {
 *       "name": "Kitchen Light",
 *       "deviceType": "light",
 *       "pin": "D6",
 *       "area": { "room": "Kitchen", "floor": "1" }
 *     },
 *     {
 *       "name": "Garage Door",
 *       "deviceType": "relay",
 *       "pin": "D7",
 *       "area": { "room": "Garage", "floor": "1" }
 *     }
 *   ]
 * }
 *
 * @example Response 201
 * [
 *   {
 *     "_id": "6651a59fc0e8b0a1c8d67890",
 *     "name": "Bedroom Fan",
 *     "deviceType": "fan",
 *     "pin": "D5",
 *     "status": "offline"
 *   }
 * ]
 *
 * @example Response 403
 * { "message": "Forbidden" }
 */
router.post('/', authenticate, authorize('admin'), addListOfDevices); 

/**
 * @route DELETE /api/devices
 * 
 * @example Request
 * {
 *   "ids": ["_1e34ki....", "_uII9023Lndgej..."] // device ids
 * }
 *
 * @example Response 200
 * {
 *   "deletedCount": 2
 * }
 *
 * @example Response 400
 * { "message": "Device ids are required" }
 */
router.delete('/', authenticate, authorize('admin'), deleteDevices);

/**
 * @route PATCH /api/devices/status
 * 
 * @example Request
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345...",
 *   "newStatus": "offline"
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345...",
 *   "name": "Living Room Light",
 *   "status": "offline",
 *   ...
 * }
 *
 * @example Response 400
 * { "message": "Device id and new status are required" }
 */
router.patch('/status', authenticate, toggleDeviceStatus);  

/**
 * @route PATCH /api/devices/permission
 * 
 * @example Request
 * {
 *   "userId": "664fe21ac0e8b0a1c8d11111",
 *   "name": "LED1",
 *   "permissionLevel": "control"
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345",
 *   "permittedUsers": [
 *     {
 *       "userId": "664fe21ac0e8b0a1c8d11111",
 *       "permissionLevel": "control"
 *     }
 *   ]
 * }
 *
 * @example Response 500
 * { "message": "Device not found" }
 */
router.patch('/permission', authenticate, authorize('admin'), changePermissionOfUserOnDevice);

/**
 * @route PATCH /api/devices/auto-behavior/create
 * @access Admin
 *
 * @headers
 * Authorization: Bearer <ACCESS_TOKEN>
 *
 * @example Request Body
 * {
 *   "name": "LED1",
 *   "measure": "temperature",
 *   "range": { "ge": 25 },
 *   "action": [
 *     { "name": "power", "value": "on" }
 *   ]
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345",
 *   "settings": {
 *     "autoBehavior": [
 *       {
 *         "measure": "temperature",
 *         "range": { "ge": 25 },
 *         "action": [
 *           { "name": "power", "value": "on" }
 *         ]
 *       }
 *     ]
 *   }
 * }
 *
 * @example Response 500
 * { "message": "Duplicate auto behavior rule" }
 */
router.patch('/auto-behavior/create', authenticate, authorize('admin', updateDeviceAutoBehavior));

/** 
 * @route PATCH /api/devices/auto-behavior/remove
 * @access Admin
 *
 * @headers
 * Authorization: Bearer <ACCESS_TOKEN>
 *
 * @example Request Body
 * {
 *   "name": "LED1",
 *   "measure": "temperature",
 *   "range": { "ge": 25 },
 *   "action": [
 *     { "name": "power", "value": "on" }
 *   ]
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345",
 *   "settings": {
 *     "autoBehavior": []
 *   }
 * }
 *
 * @example Response 500
 * { "message": "Device not found or cannot remove the automation rule" }
*/
router.patch('/auto-behavior/remove', authenticate, authorize('admin', deleteDeviceAutoBehavior));

/**
 * @route PATCH /api/devices/schedules/create
 * @access Admin
 *
 * @headers
 * Authorization: Bearer <ACCESS_TOKEN>
 *
 * @example Request Body
 * {
 *   "name": "LED1",
 *   "cronExpression": "0 18 * * *",
 *   "action": [
 *     { "name": "power", "value": "on" }
 *   ]
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345",
 *   "settings": {
 *     "schedules": [
 *       {
 *         "cronExpression": "0 18 * * *",
 *         "action": [
 *           { "name": "power", "value": "on" }
 *         ]
 *       }
 *     ]
 *   }
 * }
 *
 * @example Response 500
 * { "message": "Duplicate scheduled rule" }
 */
router.patch('/schedules/create', authenticate, updateDeviceSchedules);
/**
 * @route PATCH /api/devices/schedules/remove
 * @access Admin
 *
 * @headers
 * Authorization: Bearer <ACCESS_TOKEN>
 *
 * @example Request Body
 * {
 *   "name": "LED1",
 *   "cronExpression": "0 18 * * *",
 *   "action": [
 *     { "name": "power", "value": 1 }
 *   ]
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345",
 *   "settings": {
 *     "schedules": []
 *   }
 * }
 *
 * @example Response 500
 * { "message": "Device not found or cannot remove the automation rule" }
 */
router.patch('/schedules/remove', authenticate, authorize('admin', deleteDeviceSchedules));

/**
 * @route PATCH /api/devices/characteristic/
 * @access user
 *
 * @headers
 * Authorization: Bearer <ACCESS_TOKEN>
 *
 * @example Request Body characteristic is an object
 * {
 *   "_id": "example_device_id",
 *   "characteristics": {
 *      "name": "fanSpeed",
 *      "unit": "rpm",
 *      "value": 200
 *   }
 * }
 * 
 * @example Request Body characteristic is an array of objects
 * {
 *   "_id": "example_device_id",
 *   "characteristics": [
 *      {
 *          "name": "fanSpeed",
 *          "unit": "rpm",
 *          "value": 200
 *      },
 *      {
 *          "name": "characteristic2",
 *          "unit": "%",
 *          "value": 50
 *      },
 *      ...
 *   ]
 * }
 *
 * @example Response 200
 * {
 *   "_id": "6651a4f2c0e8b0a1c8d12345",
 *   "settings": {
 *     "schedules": []
 *   }
 * }
 *
 * @example Response 500
 * { "message": "Device not found" }
 */
router.patch('/characteristic/', authenticate, updateDeviceCharacteristicById);

router.get('/analytic', authenticate, (req, res) => {
  const data = deviceData;

  res.json(data);
});

export default router;