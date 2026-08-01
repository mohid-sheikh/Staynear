import Listing from "../models/listingModels.js";
import uploadImage from "../utils/uploadImage.js";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

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

        const imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageUrl = await uploadImage(file.path);
                imageUrls.push(imageUrl);
            }
        }

        if (imageUrls.length === 0) {
            imageUrls.push(DEFAULT_IMAGE);
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

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
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
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
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