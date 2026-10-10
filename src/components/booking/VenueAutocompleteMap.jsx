import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const HOME_COORDS = { lat: -6.28862, lng: 106.71789 }; // Koordinat Studio Timelens

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16);
  }, [position, map]);
  return null;
}

export default function VenueAutocompleteMap({ onSelectLocation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const typingTimer = useRef(null);
  const markerRef = useRef(null);

  const searchLocationAPI = async (searchText) => {
    if (searchText.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Tambahkan "Indonesia" secara diam-diam di belakang query dan minta hasil lebih banyak (limit=15)
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchText + " Indonesia")}&limit=15&lat=-6.200000&lon=106.816666`,
      );
      const data = await res.json();

      // 2. Filter Ketat: Buang semua hasil yang bukan dari Indonesia (ID)
      const indonesiaOnly = data.features
        .filter(
          (feature) =>
            feature.properties.country === "Indonesia" ||
            feature.properties.countrycode === "ID",
        )
        .slice(0, 5); // Setelah difilter, baru kita ambil 5 teratas

      const formattedSuggestions = indonesiaOnly.map((feature) => {
        const prop = feature.properties;
        // Tidak perlu lagi menampilkan nama negara karena sudah pasti Indonesia
        const addressParts = [
          prop.name,
          prop.street,
          prop.city,
          prop.state,
        ].filter(Boolean);
        return {
          place_id: prop.osm_id || Math.random(),
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
          name: prop.name || addressParts[0],
          display_name: addressParts.join(", "),
        };
      });

      setSuggestions(formattedSuggestions);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    setIsLoading(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      searchLocationAPI(text);
    }, 800);
  };

  const processNewPosition = async (lat, lon) => {
    setPosition([lat, lon]);
    const distance = getDistance(HOME_COORDS.lat, HOME_COORDS.lng, lat, lon);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );
      const data = await res.json();

      let newAddress = data.display_name || "Lokasi Kustom";
      if (newAddress.endsWith(", Indonesia")) {
        newAddress = newAddress.slice(0, -11);
      }

      setQuery(newAddress);
      // 🔥 PERBAIKAN: Sekarang kita mengirimkan lat dan lon juga ke halaman utama!
      onSelectLocation(newAddress, distance, lat, lon);
    } catch (error) {
      setQuery("Lokasi Titik Kustom");
      onSelectLocation("Lokasi Titik Kustom", distance, lat, lon);
    }
  };

  const handleSelect = (place) => {
    setSuggestions([]);
    processNewPosition(parseFloat(place.lat), parseFloat(place.lon));
  };

  const handleMarkerDragEnd = (e) => {
    const pos = e.target.getLatLng();
    processNewPosition(pos.lat, pos.lng);
  };

  // 🔥 FITUR BARU: Ambil Lokasi Saya (GPS) yang Sudah Diperbaiki
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi GPS.");
      return;
    }

    setIsLoading(true);

    // Gunakan opsi yang lebih bersahabat untuk semua device/laptop
    const gpsOptions = {
      enableHighAccuracy: false, // Dimatikan agar tidak error di Laptop/PC dan lebih cepat
      timeout: 15000, // Beri waktu 15 detik sebelum menyerah
      maximumAge: 10000, // Boleh pakai data lokasi 10 detik yang lalu
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLoading(false);
        processNewPosition(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLoading(false);

        // Hanya munculkan alert JIKA user secara sadar menolak (Memencet "Block" di popup browser)
        if (err.code === err.PERMISSION_DENIED) {
          alert(
            "Akses lokasi ditolak. Silakan izinkan akses GPS di pengaturan browser (ikon gembok di sebelah URL).",
          );
        } else {
          // Jika error karena hal teknis (timeout/sinyal), diamkan saja agar tidak mengganggu UX
          console.warn("Info GPS:", err.message);
        }
      },
      gpsOptions,
    );
  };

  return (
    <div className="flex flex-col gap-3 relative">
      {/* Input Pencarian */}
      <div className="relative z-[9999]">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Cari alamat / nama tempat..."
          className="w-full bg-[#ffffff] text-[#090100] px-4 py-2.5 rounded-lg text-sm border border-[#d3c3be]/60 focus:outline-none focus:border-[#855230] shadow-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 mt-1.5 w-full bg-[#ffffff] rounded-lg shadow-xl border border-[#d3c3be]/40 overflow-hidden max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-[#f6f3ee] cursor-pointer text-xs text-[#090100] border-b border-[#f0ede9] last:border-0 transition-colors"
              >
                <div className="font-semibold truncate">{item.name}</div>
                <div className="text-[10px] text-[#504440] truncate mt-0.5">
                  {item.display_name}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Peta */}
      <div className="w-full h-64 rounded-xl overflow-hidden border border-[#d3c3be]/60 relative z-0 shadow-sm">
        <MapContainer
          center={position || [-6.2, 106.816666]}
          zoom={position ? 16 : 10}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {position && (
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{ dragend: handleMarkerDragEnd }}
              ref={markerRef}
            />
          )}
          <MapUpdater position={position} />
        </MapContainer>
      </div>

      {/* Teks Instruksi & Tombol Lokasi Saya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-[#504440]">
          Klik di peta atau geser pin untuk memilih lokasi.
        </span>

        <button
          type="button"
          onClick={handleGetMyLocation}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ffffff] border border-[#d3c3be]/60 hover:bg-[#f6f3ee] text-[#090100] text-sm font-semibold rounded-full shadow-sm transition-colors w-fit"
        >
          {isLoading ? (
            <span className="material-symbols-outlined text-[18px] animate-spin">
              sync
            </span>
          ) : (
            <span className="material-symbols-outlined text-[18px] text-pink-600">
              my_location
            </span>
          )}
          Ambil Lokasi Saya
        </button>
      </div>
    </div>
  );
}
