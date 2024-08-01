import { Router } from 'express';
import {
    getUserInfo,
    login,
    signup,
    updateProfile,
    addProfileImage,
    logout,
    removeProfileImage,
  } from "../controllers/AuthController.js";
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';

const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userinfo", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRoutes.post("/logout", logout);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

export default authRoutes;
