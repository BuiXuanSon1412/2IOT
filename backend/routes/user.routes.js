import express from 'express';
import { authenticate, authorize } from '../middleware/auth/auth.js';
import { 
    fetchAllUser, 
    addNewUser, 
    changeUserRole,
    removeUser,
    createNewAdmin
} from '../controllers/user.controller.js'; 

const router = express.Router();

/**
 * @route GET /api/users
 * 
 * @example Request Headers
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * @example Response
 * [
 *   {
 *     "_id": "65f123...",
 *     "email": "admin@mail.com",
 *     "name": "Admin",
 *     "role": "admin",
 *     "createdAt": "2025-03-01T10:00:00.000Z"
 *   },
 *   {
 *     "_id": "65f456...",
 *     "email": "user@mail.com",
 *     "name": "User",
 *     "role": "user",
 *     "createdAt": "2025-03-02T12:00:00.000Z"
 *   }
 * ]
 */
router.get('/', authenticate, fetchAllUser);


/**
 * @route POST /api/users
 * 
 * @example Request Headers
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * @example Request Body
 * {
 *   "name": "New User",
 *   "email": "newuser@mail.com",
 *   "password": "password123"
 * }
 *
 * @example Response
 * {
 *   "message": "Added user",
 *   "newUser": {
 *     "_id": "65f789...",
 *     "email": "newuser@mail.com",
 *     "name": "New User",
 *     "role": "user"
 *   }
 * }
 */
router.post('/', authenticate, authorize('admin'), addNewUser); // only admins can add new user 

/**
 * @route DELETE /api/users
 * 
 * @example Request Body
 * {
 *   "userId": "65f456..."
 * }
 *
 * @example Response
 * {
 *   "message": "User deleted.",
 *   "deleteResult": {
 *     "acknowledged": "true",
 *     "deletedCount": 1
 *   }
 * }
 */
router.delete('/', authenticate, authorize('admin'), removeUser);

/**
 * @route PATCH /api/users/role
 * 
 * @example Request Body
 * {
 *   "userId": "65f456...",
 *   "newRole": "admin"
 * }
 *
 * @example Response
 * {
 *   "message": "User's role updated",
 *   "updatedUser": {
 *     "_id": "65f456...",
 *     "name": "user Name",
 *     "email": "@@@",
 *     "password": "123456",
 *     "role": "admin"
 *   }
 * }
 */
router.patch('/role', authenticate, authorize('admin'), changeUserRole);

// for admin testing
router.post('/admin/create', createNewAdmin);

export default router;