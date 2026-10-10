import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Konfigurasi icon marker default agar tidak rusak di React/Vite
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen logika untuk menangkap event klik pada peta
function MapEventsHandler({ position, setPosition, onAddressFound }) {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      map.flyTo([lat, lng], 16); // Zoom in saat diklik

      // Menerjemahkan koordinat menjadi alamat teks (Reverse Geocoding OSM)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          onAddressFound(data.display_name, lat, lng);
        }
      } catch (error) {
        console.error("Gagal mendapatkan alamat lokasi:", error);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onLocationSelect }) {
  // Default koordinat: Bogor Botanical Gardens (bisa disesuaikan)
  const [position, setPosition] = useState([-6.5976, 106.7995]);

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border border-[#d3c3be]/40 shadow-xs z-0">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler 
          position={position} 
          setPosition={setPosition} 
          onAddressFound={onLocationSelect} 
        />
      </MapContainer>
      
      {/* Label Bantuan Peta */}
      <div className="absolute top-3 left-3 z-[400] bg-[#ffffff]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d3c3be]/30 shadow-xs flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#855230] animate-pulse"></span>
        <span className="text-xs text-[#090100] font-semibold">
          Geser & Klik peta untuk pilih lokasi
        </span>
      </div>
    </div>
  );
}