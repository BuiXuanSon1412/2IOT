import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { addListOfSensors, fetchAllSensors } from '../controllers/sensor.controller.js';

const router = express.Router();

router.get('/', authenticate, fetchAllSensors);
router.post('/', authenticate, authorize('admin'), addListOfSensors); 

export default router;