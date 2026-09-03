import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { HiLocationMarker, HiExternalLink } from "react-icons/hi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const LocationMap = ({ location, title = "Accommodation", area = "", city = "" }) => {
  const lat = location?.latitude != null ? Number(location.latitude) : null;
  const lng = location?.longitude != null ? Number(location.longitude) : null;
  const hasCoordinates = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
  const displayAddress = location?.address || (area && city ? `${area}, ${city}` : "");

  if (!hasCoordinates) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-2xl">
          <HiLocationMarker />
        </div>
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Location Not Available
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {displayAddress
            ? `Address: ${displayAddress}. Map coordinates have not been set for this property.`
            : "The property owner has not provided location coordinates for this listing."}
        </p>
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="space-y-4">
      {/* Prominent Address Display */}
      {displayAddress && (
        <div className="flex items-start gap-2.5 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl">
          <HiLocationMarker className="text-orange-500 text-xl shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
              Property Address
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              {displayAddress}
            </p>
          </div>
        </div>
      )}

      {/* Leaflet Interactive Map Container */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[lat, lng]}>
            <Popup>
              <div className="text-xs space-y-1">
                <strong className="block text-slate-900">{title}</strong>
                <span className="text-slate-600">{displayAddress || `${area}, ${city}`}</span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Get Directions Button */}
      <div className="flex items-center justify-between pt-1">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <HiLocationMarker className="text-base text-orange-400" />
          <span>Get Directions</span>
          <HiExternalLink className="text-sm opacity-80" />
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
