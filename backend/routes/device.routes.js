import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { addListOfDevices, deleteDevices, fetchAllDevices, toggleDeviceStatus } from '../controllers/device.controller.js';

const router = express.Router();

router.get('/', authenticate, fetchAllDevices);
router.post('/', authenticate, authorize('admin'), addListOfDevices); 
router.delete('/', authenticate, authorize('admin'), deleteDevices);
router.patch('/status', authenticate, toggleDeviceStatus);

export default router;