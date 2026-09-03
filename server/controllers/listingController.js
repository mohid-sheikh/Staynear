import fs from "fs";
import Listing from "../models/listingModels.js";
import uploadImage from "../utils/uploadImage.js";

const parseLocationData = (locationInput) => {
    if (!locationInput) return undefined;
    let locObj = locationInput;
    if (typeof locationInput === "string") {
        try {
            locObj = JSON.parse(locationInput);
        } catch (e) {
            return undefined;
        }
    }
    if (typeof locObj !== "object" || locObj === null) return undefined;

    const address = locObj.address ? String(locObj.address).trim() : undefined;
    const latitude = locObj.latitude !== undefined && locObj.latitude !== null && locObj.latitude !== ""
        ? Number(locObj.latitude)
        : undefined;
    const longitude = locObj.longitude !== undefined && locObj.longitude !== null && locObj.longitude !== ""
        ? Number(locObj.longitude)
        : undefined;

    if (latitude !== undefined && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
        throw new Error("Latitude must be a valid number between -90 and 90.");
    }
    if (longitude !== undefined && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
        throw new Error("Longitude must be a valid number between -180 and 180.");
    }

    if (!address && latitude === undefined && longitude === undefined) {
        return undefined;
    }

    return {
        ...(address ? { address } : {}),
        ...(latitude !== undefined ? { latitude } : {}),
        ...(longitude !== undefined ? { longitude } : {}),
    };
};

export const createListing = async (req, res) => {
    try {
        const {
            title,
            description,
            rent,
            city,
            area,
            collegeNearby,
            roomType,
            amenities,
            location,
        } = req.body;

        if (
            !title ||
            !description ||
            !rent ||
            !city ||
            !area ||
            !collegeNearby ||
            !roomType
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        let parsedLocation;
        try {
            parsedLocation = parseLocationData(location);
        } catch (locError) {
            return res.status(400).json({
                success: false,
                message: locError.message,
            });
        }

        const imageUrls = [];

        if (req.files && req.files.length > 0) {
            try {
                for (const file of req.files) {
                    const imageUrl = await uploadImage(file.path);
                    if (imageUrl) {
                        imageUrls.push(imageUrl);
                    }
                }
            } catch (uploadError) {
                // Cleanup any remaining temp files
                for (const file of req.files) {
                    if (file.path && fs.existsSync(file.path)) {
                        try {
                            fs.unlinkSync(file.path);
                        } catch (e) {
                            // ignore cleanup error
                        }
                    }
                }
                return res.status(400).json({
                    success: false,
                    message: `Image upload failed: ${uploadError.message}. Please check your files and try again.`,
                });
            }
        }

        // Normalize amenities array
        let parsedAmenities = [];
        if (Array.isArray(amenities)) {
            parsedAmenities = amenities;
        } else if (typeof amenities === "string" && amenities.trim()) {
            parsedAmenities = [amenities];
        }

        const listing = await Listing.create({
            title: title.trim(),
            description: description.trim(),
            rent: Number(rent),
            city: city.trim(),
            area: area.trim(),
            collegeNearby: collegeNearby.trim(),
            roomType,
            amenities: parsedAmenities,
            images: imageUrls,
            location: parsedLocation,
            owner: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            listing,
        });

    } catch (error) {
        console.error("createListing Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Server Error creating listing",
        });
    }
};

export const getAllListings = async (req, res) => {
    try {
        const {
            city,
            collegeNearby,
            roomType,
            minRent,
            maxRent,
            page = 1,
            limit = 10,
            sort = "newest",
            search,
        } = req.query;

        const filter = {
            available: true,
        };

        if (city) {
            filter.city = {
                $regex: city,
                $options: "i",
            };
        }
        if (roomType) {
            filter.roomType = roomType;
        }
        if (collegeNearby) {
            filter.collegeNearby = {
                $regex: collegeNearby,
                $options: "i",
            };
        }
        if (minRent || maxRent) {
            filter.rent = {};
            if (minRent) filter.rent.$gte = Number(minRent);
            if (maxRent) filter.rent.$lte = Number(maxRent);
        }
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        let sortOption = {};
        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        } else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "rentLow") {
            sortOption = { rent: 1 };
        } else if (sort === "rentHigh") {
            sortOption = { rent: -1 };
        }

        const totalListings = await Listing.countDocuments(filter);

        const listings = await Listing.find(filter)
            .populate("owner", "name email phone college")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            currentPage: Number(page),
            totalPages: Math.ceil(totalListings / Number(limit)) || 1,
            totalListings,
            count: listings.length,
            listings,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getMyListings = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const listings = await Listing.find({
            owner: ownerId,
        }).populate("owner", "name email phone college");

        return res.status(200).json({
            success: true,
            count: listings.length,
            listings,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getSingleListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate("owner", "name email phone college");

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        res.status(200).json({
            success: true,
            listing,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this listing",
            });
        }

        const updateData = { ...req.body };

        if (updateData.rent) {
            updateData.rent = Number(updateData.rent);
        }

        if (req.body.location !== undefined) {
            try {
                updateData.location = parseLocationData(req.body.location);
            } catch (locError) {
                return res.status(400).json({
                    success: false,
                    message: locError.message,
                });
            }
        }

        if (req.body.amenities !== undefined) {
            let parsedAmenities = [];
            if (Array.isArray(req.body.amenities)) {
                parsedAmenities = req.body.amenities;
            } else if (typeof req.body.amenities === "string" && req.body.amenities.trim() !== "") {
                try {
                    const parsed = JSON.parse(req.body.amenities);
                    parsedAmenities = Array.isArray(parsed) ? parsed : [req.body.amenities];
                } catch (e) {
                    parsedAmenities = [req.body.amenities];
                }
            }
            updateData.amenities = parsedAmenities;
        }

        // Image Handling (preserve existing + add newly uploaded)
        let updatedImages = listing.images || [];

        if (req.body.existingImages !== undefined) {
            let parsedExisting = [];
            if (Array.isArray(req.body.existingImages)) {
                parsedExisting = req.body.existingImages;
            } else if (typeof req.body.existingImages === "string" && req.body.existingImages.trim() !== "") {
                try {
                    const parsed = JSON.parse(req.body.existingImages);
                    parsedExisting = Array.isArray(parsed) ? parsed : [req.body.existingImages];
                } catch (e) {
                    parsedExisting = [req.body.existingImages];
                }
            }
            updatedImages = parsedExisting.filter(img => typeof img === "string" && img.trim().length > 0);
        }

        if (req.files && req.files.length > 0) {
            try {
                for (const file of req.files) {
                    const imageUrl = await uploadImage(file.path);
                    if (imageUrl) {
                        updatedImages.push(imageUrl);
                    }
                }
            } catch (uploadError) {
                for (const file of req.files) {
                    if (file.path && fs.existsSync(file.path)) {
                        try { fs.unlinkSync(file.path); } catch (e) {}
                    }
                }
                return res.status(400).json({
                    success: false,
                    message: `Image upload failed: ${uploadError.message}`,
                });
            }
        }

        updateData.images = updatedImages;

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing: updatedListing,
        });

    } catch (error) {
        console.error("updateListing Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this listing",
            });
        }

        await listing.deleteOne();

        res.status(200).json({
            success: true,
            message: "Listing deleted successfully",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const updateListingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["available", "booked", "occupied"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'available', 'booked', or 'occupied'",
            });
        }

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this listing status",
            });
        }

        listing.status = status;
        listing.available = status === "available";
        await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing status updated successfully",
            listing,
        });

    } catch (error) {
        console.error("updateListingStatus error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};