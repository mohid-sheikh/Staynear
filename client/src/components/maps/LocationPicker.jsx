import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { HiLocationMarker, HiAdjustments } from "react-icons/hi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to recenter map when coordinates change externally
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] != null && center[1] != null && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Component to handle map clicks for placing marker
const MapClickHandler = ({ onSelectLocation }) => {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const DEFAULT_CENTER = [22.7196, 75.8577]; // Default Indore center

const LocationPicker = ({ location = {}, onChange }) => {
  const [showManualInputs, setShowManualInputs] = useState(false);

  const address = location?.address || "";
  const lat = location?.latitude != null ? Number(location.latitude) : null;
  const lng = location?.longitude != null ? Number(location.longitude) : null;

  const hasMarker = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
  const currentCenter = hasMarker ? [lat, lng] : DEFAULT_CENTER;

  const handleAddressChange = (e) => {
    onChange({
      ...location,
      address: e.target.value,
    });
  };

  const handleSelectCoords = (newLat, newLng) => {
    onChange({
      ...location,
      latitude: Number(newLat.toFixed(6)),
      longitude: Number(newLng.toFixed(6)),
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSelectCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }
  };

  return (
    <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200">
      
      {/* Primary Section: Property Address */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Property Address / Landmark *
          </label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <HiLocationMarker className="text-sm" />
            <span>Use My Location</span>
          </button>
        </div>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="e.g. House No. 42, Near Gate 2, DU North Campus, New Delhi"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-none"
        />
        <p className="text-[11px] text-slate-500 pt-0.5">
          Click on the map below or drag the marker to pin the exact property location.
        </p>
      </div>

      {/* Interactive Leaflet Map for Location Selection */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0">
        <MapContainer
          center={currentCenter}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onSelectLocation={handleSelectCoords} />
          {hasMarker && (
            <>
              <RecenterMap center={[lat, lng]} />
              <Marker
                position={[lat, lng]}
                draggable={true}
                eventHandlers={{
                  dragend(e) {
                    const marker = e.target;
                    const pos = marker.getLatLng();
                    handleSelectCoords(pos.lat, pos.lng);
                  },
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Selected Coordinates Status Pill & Manual Adjustment Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <HiLocationMarker className="text-orange-500 text-base shrink-0" />
          {hasMarker ? (
            <span className="font-semibold text-slate-800">
              Pin Set: <code className="bg-white px-2 py-0.5 rounded border text-blue-600 font-mono text-[11px]">{lat}, {lng}</code>
            </span>
          ) : (
            <span className="text-slate-500">No map pin selected yet (Click on map to pin)</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowManualInputs(!showManualInputs)}
          className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <HiAdjustments className="text-sm" />
          <span>{showManualInputs ? "Hide Precise Coordinates" : "Manual Lat/Lng Input"}</span>
        </button>
      </div>

      {/* Secondary / Collapsible Manual Lat/Lng Inputs */}
      {showManualInputs && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Latitude (-90 to 90)
            </label>
            <input
              type="number"
              step="any"
              min="-90"
              max="90"
              value={lat !== null ? lat : ""}
              onChange={(e) =>
                onChange({
                  ...location,
                  latitude: e.target.value !== "" ? Number(e.target.value) : null,
                })
              }
              placeholder="e.g. 28.6921"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Longitude (-180 to 180)
            </label>
            <input
              type="number"
              step="any"
              min="-180"
              max="180"
              value={lng !== null ? lng : ""}
              onChange={(e) =>
                onChange({
                  ...location,
                  longitude: e.target.value !== "" ? Number(e.target.value) : null,
                })
              }
              placeholder="e.g. 77.2144"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default LocationPicker;
