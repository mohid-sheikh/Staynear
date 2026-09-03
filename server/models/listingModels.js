import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    collegeNearby: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Hostel", "PG"],
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["available", "booked", "occupied"],
      default: "available",
    },

    location: {
      address: {
        type: String,
        trim: true,
      },
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Sync available boolean with status string before saving
listingSchema.pre("save", function () {
  if (this.isModified("status")) {
    this.available = this.status === "available";
  }
});

export default mongoose.model("Listing", listingSchema);