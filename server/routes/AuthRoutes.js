import { Router } from 'express';
import { login, signup, getUserInfo, updateProfile } from '../controllers/AuthController.js'; // Import getUserInfo
import { verifyToken } from '../middlewares/AuthMiddleware.js'; // Import verifyToken middleware
const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
 // Add user-info endpoint with verifyToken middleware
 authRoutes.post("/update-profile", verifyToken, updateProfile )

export default authRoutes;