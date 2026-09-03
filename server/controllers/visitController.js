import mongoose from "mongoose";
import VisitRequest from "../models/VisitRequest.js";
import Listing from "../models/listingModels.js";

export const createVisitRequest = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can request property visits.",
      });
    }

    const { listingId, visitDate, visitTime, visitType, studentPhone, message } = req.body;

    if (!listingId || !visitDate || !visitTime || !studentPhone) {
      return res.status(400).json({
        success: false,
        message: "Please provide listingId, visitDate, visitTime, and studentPhone.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format.",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    if (listing.available === false || listing.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This property is not currently available for visits.",
      });
    }

    if (listing.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request a visit for your own listing.",
      });
    }

    // Validate visit date (must not be in the past)
    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Visit date cannot be in the past.",
      });
    }

    // Validate visit type
    const validTypes = ["In-Person", "Virtual Tour"];
    const typeOfVisit = visitType || "In-Person";
    if (!validTypes.includes(typeOfVisit)) {
      return res.status(400).json({
        success: false,
        message: "Visit type must be 'In-Person' or 'Virtual Tour'.",
      });
    }

    // Check duplicate pending request
    const existingPending = await VisitRequest.findOne({
      listing: listingId,
      student: req.user.id,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending visit request for this property.",
      });
    }

    const visitRequest = await VisitRequest.create({
      listing: listingId,
      student: req.user.id,
      owner: listing.owner,
      visitDate: selectedDate,
      visitTime: visitTime.trim(),
      visitType: typeOfVisit,
      studentPhone: studentPhone.trim(),
      message: message ? message.trim() : "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Visit request submitted successfully.",
      visitRequest,
    });
  } catch (error) {
    console.error("createVisitRequest Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error creating visit request.",
    });
  }
};

export const getStudentVisitRequests = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to student accounts.",
      });
    }

    const visits = await VisitRequest.find({ student: req.user.id })
      .populate("listing", "title rent city area roomType images location status")
      .populate("owner", "name email phone college")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    console.error("getStudentVisitRequests Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error fetching visit requests.",
    });
  }
};

export const getOwnerVisitRequests = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Access restricted to property owner accounts.",
      });
    }

    const visits = await VisitRequest.find({ owner: req.user.id })
      .populate("student", "name email phone college")
      .populate("listing", "title rent city area roomType images location status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    console.error("getOwnerVisitRequests Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error fetching visit requests.",
    });
  }
};

export const updateVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit request ID format.",
      });
    }

    const validStatuses = ["pending", "approved", "rejected", "completed", "cancelled"];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const visit = await VisitRequest.findById(id);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit request not found.",
      });
    }

    const userId = req.user.id;
    const isStudent = visit.student.toString() === userId;
    const isOwner = visit.owner.toString() === userId;

    if (!isStudent && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this visit request.",
      });
    }

    const currentStatus = visit.status;

    // Validate Status Transitions strictly:
    // Student: pending -> cancelled only
    if (isStudent && !isOwner) {
      if (currentStatus === "pending" && newStatus === "cancelled") {
        // allowed
      } else {
        return res.status(400).json({
          success: false,
          message: `Students can only cancel pending visit requests. Cannot change from '${currentStatus}' to '${newStatus}'.`,
        });
      }
    }

    // Owner: pending -> approved/rejected, approved -> completed
    if (isOwner) {
      if (currentStatus === "pending" && (newStatus === "approved" || newStatus === "rejected")) {
        // allowed
      } else if (currentStatus === "approved" && newStatus === "completed") {
        // allowed
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from '${currentStatus}' to '${newStatus}' for property owner.`,
        });
      }
    }

    visit.status = newStatus;
    await visit.save();

    res.status(200).json({
      success: true,
      message: `Visit request status updated to '${newStatus}'.`,
      visit,
    });
  } catch (error) {
    console.error("updateVisitStatus Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error updating visit request status.",
    });
  }
};
