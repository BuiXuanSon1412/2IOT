import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { addListOfDevices, changePermissionOfUserOnDevice, deleteDevices, fetchAllDevices, toggleDeviceStatus } from '../controllers/device.controller.js';

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
 *   "devicePin": "D13",
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

export default router;