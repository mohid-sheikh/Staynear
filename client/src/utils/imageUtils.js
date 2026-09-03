// Centralized Image URL Resolver for StayNear

export const getBackendServerUrl = () => {
  const envUrl = import.meta.env?.VITE_SERVER_URL || import.meta.env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, "");
  }
  return "http://localhost:5000";
};

export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  const cleanPath = imagePath.trim();
  if (!cleanPath) return null;

  // Already complete HTTP/HTTPS URL (e.g. Cloudinary, S3, or external host)
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  // Relative path (e.g. /uploads/image.jpg or uploads/image.jpg)
  const serverUrl = getBackendServerUrl();
  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${serverUrl}${formattedPath}`;
};
