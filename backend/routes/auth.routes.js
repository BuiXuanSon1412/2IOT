import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth/auth.js';

const router = express.Router();

router.post('/login', login); 
router.post('/signup', signup);

router.post('/logout', authenticate, logout); 

export default router;