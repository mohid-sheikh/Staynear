import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createVisitRequest,
  getStudentVisitRequests,
  getOwnerVisitRequests,
  updateVisitStatus,
} from "../controllers/visitController.js";

const router = express.Router();

router.post("/", authMiddleware, createVisitRequest);
router.get("/my-requests", authMiddleware, getStudentVisitRequests);
router.get("/owner-requests", authMiddleware, getOwnerVisitRequests);
router.patch("/:id/status", authMiddleware, updateVisitStatus);

export default router;
