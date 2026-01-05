export const getAddressFromLatLng = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    return "Location detected";
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Location detected";
  }
};
