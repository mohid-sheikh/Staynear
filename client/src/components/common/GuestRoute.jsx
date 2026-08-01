import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Loader from "./Loader.jsx";

const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader message="Restoring session..." />;
  }

  if (isAuthenticated && user) {
    const target = user.role === "owner" ? "/owner/dashboard" : "/student/dashboard";
    return <Navigate to={target} replace />;
  }

  return children;
};

export default GuestRoute;
