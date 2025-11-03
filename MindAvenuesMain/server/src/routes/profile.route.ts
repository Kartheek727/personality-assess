// src/routes/profile.route.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getProfileController } from "../controllers/profile.controller";
import { changePasswordController } from "../controllers/passwordController";

const router = Router();

// Consolidated profile data route
router.get("/", authenticate, getProfileController);

// Existing change password route (kept separate as requested)
router.post("/change-password", authenticate, changePasswordController);

export default router;