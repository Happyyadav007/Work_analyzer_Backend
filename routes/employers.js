import express from "express";
import * as employerUserController from "../controllers/employerUserController.js";
import { checkAuth } from "../middleware/auth.js"; // Adjust path
import upload from "../middleware/upload.js";
import {
  refreshToken,
  logoutUser,
} from "../controllers/employerUserController.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profile_image"),
  employerUserController.registerEmployerUser
);

router.post("/login", employerUserController.loginEmployerUser);

router.post("/refresh-token", refreshToken);

// Logout user
router.post("/logout", logoutUser);

// Protect this route with `checkAuth` middleware
router.get("/users", checkAuth, employerUserController.getAllEmployerUsers);
router.get("/users/:id", checkAuth, employerUserController.getEmployerUserById);

export default router;
