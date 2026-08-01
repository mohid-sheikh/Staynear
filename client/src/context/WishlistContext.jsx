import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext.jsx";
import {
  getWishlist as fetchBackendWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  getRecentlyViewed as fetchBackendRecent,
  addToRecentlyViewed as apiAddToRecent,
} from "../services/userService.js";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("staynear_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem("staynear_recent");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Sync Wishlist & Recently Viewed with Backend on Login
  useEffect(() => {
    if (isAuthenticated) {
      const loadUserBackendData = async () => {
        setLoadingWishlist(true);
        try {
          const wishlistRes = await fetchBackendWishlist();
          if (wishlistRes.success && wishlistRes.wishlist) {
            setWishlist(wishlistRes.wishlist);
          }
        } catch (err) {
          console.error("Wishlist sync error:", err);
        }

        try {
          const recentRes = await fetchBackendRecent();
          if (recentRes.success && recentRes.recentlyViewed) {
            const listingsOnly = recentRes.recentlyViewed
              .filter((item) => item.listing)
              .map((item) => item.listing);
            setRecentlyViewed(listingsOnly);
          }
        } catch (err) {
          console.error("Recent items sync error:", err);
        }
        setLoadingWishlist(false);
      };

      loadUserBackendData();
    }
  }, [isAuthenticated]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("staynear_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("staynear_recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Toggle Wishlist with Optimistic UI Update & Backend Sync
  const toggleWishlist = async (listing) => {
    const listingId = listing._id;
    const exists = wishlist.some((item) => item._id === listingId);

    // Optimistic UI Update
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item._id !== listingId));
      toast.success("Removed from saved listings");
    } else {
      setWishlist((prev) => [listing, ...prev]);
      toast.success("Saved to your wishlist!");
    }

    // Sync with Backend if logged in
    if (isAuthenticated) {
      try {
        if (exists) {
          await apiRemoveFromWishlist(listingId);
        } else {
          await apiAddToWishlist(listingId);
        }
      } catch (err) {
        console.error("Wishlist API sync error:", err);
        // Rollback on error
        if (exists) {
          setWishlist((prev) => [listing, ...prev]);
        } else {
          setWishlist((prev) => prev.filter((item) => item._id !== listingId));
        }
        toast.error("Failed to update wishlist on server");
      }
    }
  };

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  // Track Recently Viewed with Backend Sync
  const addRecentlyViewed = async (listing) => {
    const listingId = listing._id;

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item._id !== listingId);
      return [listing, ...filtered].slice(0, 20);
    });

    if (isAuthenticated && listingId) {
      try {
        await apiAddToRecent(listingId);
      } catch (err) {
        console.error("Recently viewed API error:", err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        recentlyViewed,
        loadingWishlist,
        toggleWishlist,
        isWishlisted,
        addRecentlyViewed,
        setWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
