import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { LoadingSpinner, InlineLoadingSpinner } from "../common/LoadingSpinner";
import MessageBox from "../common/MessageBox";

export default function HospitalLocator() {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const findHospitals = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setHospitals([]);
    setLocationStatus("requested");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus("found");
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`${API_BASE_URL}/api/hospitals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
          if (!response.ok) throw new Error(await response.text());
          const data = await response.json();
          const namedHospitals =
            data.hospitals?.filter(
              (h) => h && h.name && h.name !== "Hospital/Clinic (Name Unknown)"
            ) || [];
          if (namedHospitals.length > 0) setHospitals(namedHospitals);
          else setError("No nearby named hospitals found.");
        } catch (err) {
          setError(`Could not fetch hospital data: ${err.message}`);
          setLocationStatus("error");
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        setError(`Could not get location: ${geoError.message}`);
        setLocationStatus("denied");
        setIsLoading(false);
      }
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Find Nearby Hospitals & Clinics
      </h2>
      <button
        onClick={findHospitals}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mb-6 disabled:opacity-50 min-h-[48px]"
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Find Near Me (OSM)"}
      </button>
      {locationStatus === "requested" && (
        <p className="text-yellow-600 text-center mb-4 animate-pulse">
          Requesting location access...
        </p>
      )}
      {error && <MessageBox message={error} type="error" />}
      {isLoading && locationStatus === "found" && (
        <div className="flex justify-center items-center h-40">
          <InlineLoadingSpinner />{" "}
          <span className="ml-2 text-gray-500">
            Querying OpenStreetMap data...
          </span>
        </div>
      )}
      {!isLoading && hospitals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-700">
            Nearby Hospitals & Clinics:
          </h3>
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {hospitals.map((hospital) => (
              <li
                key={hospital.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
              >
                <h4 className="font-semibold text-lg text-red-800">
                  {hospital.name}
                </h4>
                <p className="text-gray-600 text-sm">{hospital.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm inline-block mt-1 underline"
                >
                  View on Google Maps
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-2">
            Map data &copy; OpenStreetMap contributors.
          </p>
        </div>
      )}
    </div>
  );
}
