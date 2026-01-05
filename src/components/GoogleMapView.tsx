import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

interface GoogleMapViewProps {
  markers: MarkerData[];
  selectedLocation?: { lat: number; lng: number } | null;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

/* ✅ SAFE DEFAULT (India center – change if needed) */
const DEFAULT_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

const GoogleMapView = ({
  markers,
  selectedLocation,
}: GoogleMapViewProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading map...
      </div>
    );
  }

  const center =
    selectedLocation ??
    (markers.length > 0
      ? { lat: markers[0].lat, lng: markers[0].lng }
      : DEFAULT_CENTER);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    >
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={{ lat: m.lat, lng: m.lng }}
          title={m.title}
        />
      ))}

      {selectedLocation && (
        <Marker
          position={selectedLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapView;
