import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth/auth.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * 
 * @example Request Body
 * {
 *     "email": "admin@mail.com",
 *     "password": "password123"
 * }
 * 
 * @example Response
 * {
 *   "user": {
 *     "_id": "65f123...",
 *     "email": "admin@mail.com",
 *     "name": "Admin",
 *     "role": "admin"
 *   },
 *   "tokens": {
 *     "access": {
 *       "token": "eyJhbGciOiJIUzI1NiIs...",
 *       "expires": "2025-03-25T10:00:00.000Z"
 *     },
 *     "refresh": {
 *       "token": "eyJhbGciOiJIUzI1NiIs...",
 *       "expires": "2025-04-01T10:00:00.000Z"
 *     }
 *   }
 * }
 */
router.post('/login', login); 

/**
 * @route POST /api/auth/signup
 * 
 * @example Request Body
 * {
 *   "name": "John Doe"
 *   "email": "user@mail.com",
 *   "password": "password123",
 * }
 *
 * @example Response
 * {
 *   "user": {
 *     "_id": "65f456...",
 *     "email": "user@mail.com",
 *     "name": "John Doe",
 *     "role": "user"
 *   },
 *   "tokens": {
 *     "access": { "token": "...", "expires": "..." },
 *     "refresh": { "token": "...", "expires": "..." }
 *   }
 * }
 */
router.post('/signup', signup);

/**
 * @route POST /api/auth/logout
 * 
 * @headers
 * Authorization: Bearer <ACCESS_TOKEN>
 * 
 * @example Request Headers
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *
 * @example Request Body
 * {
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
 * }
 *
 * @example Response
 * HTTP/1.1 200 OK
 */
router.post('/logout', authenticate, logout); 

export default router;