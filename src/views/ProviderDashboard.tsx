import { useState, useEffect, type FormEvent } from "react";
import { getAddressFromLatLng } from "../utils/getAddressFromLatLng";
import { FOOD_IMAGES } from "../utils/foodImages";

import {
  Plus,
  Package,
  MapPin,
  CheckCircle,
  Info,
  Utensils,
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import GamificationSection from "../components/GamificationSection";

import { FoodDonation, StorageCondition, UserProfile } from "../types";
import { FOOD_TYPES } from "../constants";
import { predictExpiry } from "../services/expiryEngine";
import {
  addDonation,
  getDonationsByProvider,
} from "../services/firestoreService";

/* ---------- Urgency Badge Styles ---------- */
const URGENCY_BADGE_STYLE: Record<string, string> = {
  HIGH: "bg-rose-500/80 text-white",
  MEDIUM: "bg-amber-500/80 text-white",
  LOW: "bg-emerald-500/80 text-white",
};

interface ProviderDashboardProps {
  user: UserProfile;
}

const ProviderDashboard = ({ user }: ProviderDashboardProps) => {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donations, setDonations] = useState<FoodDonation[]>([]);

  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    type: FOOD_TYPES[0],
    quantity: 5,
    storage: StorageCondition.ROOM_TEMP,
    prepDate: new Date().toISOString().slice(0, 16),
    address: "",
  });

  /* ---------- LOAD PROVIDER DONATIONS ---------- */
  useEffect(() => {
    getDonationsByProvider(user.id)
      .then(setDonations)
      .catch(console.error);
  }, [user.id]);

  /* =================================================
     🔥 DERIVED VALUES (MAIN CHANGE)
     ================================================= */

  // Total donations (products count)
  const totalDonations = donations.length;

  // Meals saved = sum of quantities
  const mealsSaved = donations.reduce(
    (sum, d) => sum + d.quantity,
    0
  );

  // Points = products × 2
  const points = totalDonations * 2;

  // Badges = every 10 points
  const badgeCount = Math.floor(points / 10);

  /* ---------- GET CURRENT LOCATION ---------- */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const address = await getAddressFromLatLng(lat, lng);

      setLocation({ lat, lng, address });
      setFormData((prev) => ({ ...prev, address }));
    });
  };

  /* ---------- HANDLE DONATE ---------- */
  const handleDonate = async (e: FormEvent) => {
    e.preventDefault();

    if (!location) {
      alert("Please use current location");
      return;
    }

    const prediction = predictExpiry(
      formData.type,
      formData.storage,
      formData.prepDate
    );

    const newDonation: FoodDonation = {
      id: crypto.randomUUID(),
      providerId: user.id,
      providerName: user.name,
      type: formData.type,
      quantity: formData.quantity,
      storage: formData.storage,
      prepDate: formData.prepDate,
      expiryHours: prediction.remainingHours,
      urgency: prediction.urgency,
      explanation: prediction.explanations,
      status: "available",
      timestamp: Date.now(),
      location,
    };

    await addDonation(newDonation);
    setDonations((prev) => [newDonation, ...prev]);
    setShowDonationForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Provider Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back, {user.name}
          </p>
        </div>

        <button
          onClick={() => setShowDonationForm(true)}
          className="flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-xl font-semibold text-white"
        >
          <Plus size={20} />
          Donate Food
        </button>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Donations"
          value={totalDonations}
          icon={Package}
          color="bg-indigo-500"
        />
        <StatsCard
          title="Meals Saved"
          value={mealsSaved}
          icon={Utensils}
          color="bg-emerald-500"
        />
        <StatsCard
          title="Impact Points"
          value={points}
          icon={CheckCircle}
          color="bg-amber-500"
        />
      </div>

      {/* FOOD CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.map((d) => (
          <div
            key={d.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
          >
            <img
              src={FOOD_IMAGES[d.type]}
              alt={d.type}
              className="h-40 w-full object-cover"
            />

            <div className="p-5 space-y-2">
              <span
                className={`text-xs px-3 py-1 rounded-full ${URGENCY_BADGE_STYLE[d.urgency]}`}
              >
                {d.urgency} URGENCY
              </span>

              <h3 className="text-lg font-bold text-white">
                {d.type}
              </h3>

              <div className="flex justify-between text-slate-300">
                <span>{d.quantity} kg</span>
                <span>{d.expiryHours}h left</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={14} /> {d.location.address}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GAMIFICATION */}
      <GamificationSection points={points} />

      {/* BADGE INFO (OPTIONAL DISPLAY) */}
      <p className="text-slate-400 text-sm">
        🏅 Badges unlocked: {badgeCount}
      </p>

      {/* TIP */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h5 className="font-bold text-emerald-400 flex gap-2 mb-2">
          <Info size={18} /> Rescue Tip
        </h5>
        <p className="text-sm text-slate-400">
          Accurate pickup location helps NGOs arrive faster.
        </p>
      </div>

      {/* DONATE MODAL */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <form
            onSubmit={handleDonate}
            className="bg-[#0f172a] p-6 rounded-2xl w-full max-w-md space-y-4"
          >
            <select
              className="w-full bg-slate-800 p-4 rounded-xl text-white"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              {FOOD_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <input
              type="number"
              className="w-full bg-slate-800 p-4 rounded-xl text-white"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: +e.target.value,
                })
              }
            />

            <input
              type="datetime-local"
              className="w-full bg-slate-800 p-4 rounded-xl text-white"
              value={formData.prepDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prepDate: e.target.value,
                })
              }
            />

            <input
              className="w-full bg-slate-800 p-4 rounded-xl text-white"
              readOnly
              value={formData.address}
            />

            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-slate-700 py-3 rounded-xl text-white"
            >
              📍 Use My Current Location
            </button>

            <button className="w-full bg-emerald-600 py-4 rounded-xl font-bold text-white">
              Confirm & Upload
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
