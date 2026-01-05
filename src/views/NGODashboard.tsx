import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation as NavIcon,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { FOOD_IMAGES } from "../utils/foodImages";
import StatsCard from "../components/StatsCard";
import GoogleMapView from "../components/GoogleMapView";
import GamificationSection from "../components/GamificationSection";

import { FoodDonation, UserProfile } from "../types";
import { URGENCY_COLORS } from "../constants";
import {
  getDonations,
  acceptDonation,
} from "../services/firestoreService";

interface NGODashboardProps {
  user: UserProfile;
}

const NGODashboard = ({ user }: NGODashboardProps) => {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [availableFood, setAvailableFood] = useState<FoodDonation[]>([]);
  const [acceptedFood, setAcceptedFood] = useState<FoodDonation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  /* ---------- LOAD DONATIONS ---------- */
  useEffect(() => {
    getDonations()
      .then((data) => {
        setAvailableFood(data.filter((d) => d.status === "available"));
        setAcceptedFood(
          data.filter(
            (d) =>
              d.status === "accepted" &&
              d.claimedBy === user.name
          )
        );
      })
      .catch(console.error);
  }, [user.name]);

  /* =================================================
     🔥 DERIVED NGO GAMIFICATION VALUES
     ================================================= */

  // Pickups = accepted donations count
  const pickups = acceptedFood.length;

  // Food saved = sum of quantities
  const foodSaved = acceptedFood.reduce(
    (sum, d) => sum + d.quantity,
    0
  );

  // Points = accepted donations × 5
  const points = pickups * 5;

  // Badges = every 15 points
  const badgeCount = Math.floor(points / 15);

  /* ---------- MAP MARKERS ---------- */
  const mapMarkers = availableFood.map((food) => ({
    id: food.id,
    lat: food.location.lat,
    lng: food.location.lng,
    title: food.type,
    description: `${food.quantity}kg • ${food.providerName}`,
  }));

  /* ---------- ACCEPT HANDLER ---------- */
  const handleAccept = async (item: FoodDonation) => {
    await acceptDonation(item.id, user.name);

    setAvailableFood((prev) =>
      prev.filter((f) => f.id !== item.id)
    );

    setAcceptedFood((prev) => [
      ...prev,
      { ...item, status: "accepted", claimedBy: user.name },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            NGO Dashboard
          </h1>
          <p className="text-slate-400">
            Accept food and manage pickups
          </p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
          {["list", "map"].map((mode) => (
            <button
              key={mode}
              onClick={() =>
                setViewMode(mode as "list" | "map")
              }
              className={`px-6 py-2 rounded-lg font-bold ${
                viewMode === mode
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400"
              }`}
            >
              {mode === "list" ? "List View" : "Map View"}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Pickups"
          value={pickups}
          icon={CheckCircle2}
          color="bg-indigo-500"
        />
        <StatsCard
          title="Food Saved (kg)"
          value={foodSaved}
          icon={MapPin}
          color="bg-emerald-500"
        />
        <StatsCard
          title="Impact Points"
          value={points}
          icon={AlertCircle}
          color="bg-amber-500"
        />
      </div>

      {/* LIST / MAP */}
      {viewMode === "list" ? (
        <div className="grid grid-cols-2 gap-6">
          {availableFood.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <div
                className="h-40 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${
                    FOOD_IMAGES[item.type] ||
                    "/food-images/default.jpg"
                  })`,
                }}
              >
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${URGENCY_COLORS[item.urgency]}`}
                >
                  {item.urgency} URGENCY
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">
                      {item.type}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {item.providerName}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">
                    {item.quantity}kg
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Clock size={16} />
                  Expires in {item.expiryHours}h
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={16} />
                  {item.location.address}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(item)}
                    className="flex-1 py-2 rounded-xl font-bold bg-emerald-600 text-white"
                  >
                    Accept Food
                  </button>

                  <button
                    onClick={() => {
                      setSelectedLocation({
                        lat: item.location.lat,
                        lng: item.location.lng,
                      });
                      setViewMode("map");
                    }}
                    className="p-3 border border-slate-800 rounded-xl hover:bg-slate-900"
                  >
                    <NavIcon
                      size={18}
                      className="text-slate-400"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[600px] rounded-2xl overflow-hidden">
          <GoogleMapView
            markers={mapMarkers}
            selectedLocation={selectedLocation}
          />
        </div>
      )}

      {/* GAMIFICATION */}
      <GamificationSection points={points} />

      {/* SUPPORT */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h5 className="flex items-center gap-2 font-bold text-slate-200">
          <Phone size={18} className="text-emerald-400" />
          Support
        </h5>
        <button className="mt-4 w-full py-2 border border-slate-700 rounded-lg">
          Call Logistics Team
        </button>
      </div>
    </div>
  );
};

export default NGODashboard;
