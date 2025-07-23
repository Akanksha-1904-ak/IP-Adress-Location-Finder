import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to update map center dynamically
const RecenterMap = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 13); // update the center and zoom level
  }, [lat, lon, map]);
  return null;
};

const Map = ({ lat, lon }) => {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>
          IP Location: [{lat.toFixed(3)}, {lon.toFixed(3)}]
        </Popup>
      </Marker>
      <RecenterMap lat={lat} lon={lon} />
    </MapContainer>
  );
};

export default Map;
