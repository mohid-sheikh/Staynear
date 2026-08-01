import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getOwnerDashboardAnalytics } from "../controllers/dashboardController.js";

const router = express.Router();

// Owner Dashboard Analytics Route
router.get("/owner", authMiddleware, getOwnerDashboardAnalytics);

export default router;
