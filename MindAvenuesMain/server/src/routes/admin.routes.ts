// src/routes/admin.routes.ts
import { Router } from "express";
import { getAllAdminInsights, getAllUsersController, toggleUserRoleController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types";

const router = Router();

router.get("/insights", authenticate, authorize([UserRole.ADMIN]), getAllAdminInsights);

// New route to get all users
router.get("/users",  authenticate, authorize([UserRole.ADMIN]), getAllUsersController);

// New route to toggle user role
router.post("/users/:userId/toggle-role", authenticate, authorize([UserRole.ADMIN]), toggleUserRoleController);


export default router;