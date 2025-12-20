import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { 
    fetchAllUser, 
    addNewUser, 
    changePermissionOfUserOnDevice, 
    changeUserRole,
    removeUser
} from '../controllers/user.controller.js'; 

const router = express.Router();

router.get('/', authenticate, fetchAllUser);
router.post('/', authenticate, authorize('admin'), addNewUser); // only admins can add new user 
router.delete('/', authenticate, authorize('admin'), removeUser);
router.patch('/role', authenticate, authorize('admin'), changeUserRole);
router.patch('/role', authenticate, authorize('admin'), changePermissionOfUserOnDevice);

export default router;