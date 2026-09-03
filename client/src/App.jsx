import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import MainLayout from "./layouts/MainLayout.jsx";

// Protected & Guest Route Guards
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import GuestRoute from "./components/common/GuestRoute.jsx";

// Public Pages
import Home from "./pages/Home.jsx";
import ExploreListings from "./pages/public/ExploreListings.jsx";
import ListingDetails from "./pages/public/ListingDetails.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import About from "./pages/public/About.jsx";
import Contact from "./pages/public/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// Shared Pages
import Profile from "./pages/shared/Profile.jsx";

// Owner Pages
import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import MyListings from "./pages/owner/MyListings.jsx";
import CreateListing from "./pages/owner/CreateListing.jsx";
import EditListing from "./pages/owner/EditListing.jsx";
import OwnerVisits from "./pages/owner/OwnerVisits.jsx";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import SavedListings from "./pages/student/SavedListings.jsx";
import RecentlyViewed from "./pages/student/RecentlyViewed.jsx";
import StudentVisits from "./pages/student/StudentVisits.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1e293b",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          
          {/* Public Unrestricted Routes */}
          <Route index element={<Home />} />
          <Route path="listings" element={<ExploreListings />} />
          <Route path="listings/:id" element={<ListingDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          {/* Guest Only Routes (Blocked for authenticated users) */}
          <Route
            path="login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Shared Protected Route */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Owner Protected Routes */}
          <Route
            path="owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/listings"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/create-listing"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/edit-listing/:id"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/visits"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerVisits />
              </ProtectedRoute>
            }
          />

          {/* Student Protected Routes */}
          <Route
            path="student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/saved"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SavedListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/recently-viewed"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <RecentlyViewed />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/visits"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentVisits />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
