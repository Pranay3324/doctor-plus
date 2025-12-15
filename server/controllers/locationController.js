const axios = require("axios");

// We use Overpass API (OpenStreetMap) as a free alternative to Google Places
const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

const getHospitals = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const radius = 5000; // 5km radius

  // Overpass QL query
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${latitude},${longitude});
      way["amenity"="hospital"](around:${radius},${latitude},${longitude});
      relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
      node["amenity"="clinic"](around:${radius},${latitude},${longitude});
      way["amenity"="clinic"](around:${radius},${latitude},${longitude});
    );
    out center;
  `;

  try {
    console.log(`[Location] Querying OSM for: ${latitude}, ${longitude}`);
    const response = await axios.post(OVERPASS_API_URL, query, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const hospitals = response.data.elements
      .map((element) => {
        let lat, lon;
        if (element.type === "node") {
          lat = element.lat;
          lon = element.lon;
        } else if (element.center) {
          lat = element.center.lat;
          lon = element.center.lon;
        } else {
          return null;
        }

        const tags = element.tags || {};
        const name = tags.name || "Hospital/Clinic (Name Unknown)";
        const address =
          [tags["addr:street"], tags["addr:city"]].filter(Boolean).join(", ") ||
          "Address details unavailable";

        return { id: element.id, name, lat, lon, address };
      })
      .filter(Boolean);

    res.json({ hospitals });
  } catch (error) {
    console.error("[Location] Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch hospitals from map service" });
  }
};

module.exports = { getHospitals };
