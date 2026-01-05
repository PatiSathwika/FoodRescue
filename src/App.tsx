import { useState } from "react";
import { UserRole, UserProfile } from "./types";

import ProviderDashboard from "./views/ProviderDashboard";
import NGODashboard from "./views/NGODashboard";
import AdminDashboard from "./views/AdminDashboard";
import Navigation from "./components/Navigation";

import { ChefHat, HeartHandshake, ShieldAlert, ArrowRight } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authStep, setAuthStep] = useState<"role_selection" | "login">("role_selection");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthStep("login");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const mockUser: UserProfile = {
      id: "u1",
      name:
        selectedRole === UserRole.PROVIDER
          ? "Food Provider"
          : selectedRole === UserRole.NGO
          ? "Rescue NGO"
          : "Admin",
      role: selectedRole!,
      points: 450,
      mealsSaved: 120,
      donationsCount: 12,
      badges: ["Star Donor"],
      isApproved: true
    };

    setCurrentUser(mockUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setAuthStep("role_selection");
  };

  /* =============================
     🔥 LOGIN / ROLE SELECT PAGE
     ============================= */
  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-8 text-center">

          {/* Title */}
         {/* LOGO */}
<img
  src="/food-images/logo.jpeg"
  alt="FoodRescue"
  className="
    w-64 h-64
    mx-auto mb-10
    rounded-full
    object-contain
    bg-[#f5f2e8]
    p-4
    border-4 border-emerald-500
    shadow-lg
  "
/>






          {authStep === "role_selection" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RoleCard
                title="Provider"
                icon={ChefHat}
                onClick={() => handleRoleSelect(UserRole.PROVIDER)}
              />
              <RoleCard
                title="NGO"
                icon={HeartHandshake}
                onClick={() => handleRoleSelect(UserRole.NGO)}
              />
              <RoleCard
                title="Admin"
                icon={ShieldAlert}
                onClick={() => handleRoleSelect(UserRole.ADMIN)}
              />
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
                placeholder="Email"
              />
              <input
                className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
                placeholder="Password"
                type="password"
              />
              <button className="w-full bg-emerald-600 text-white p-3 rounded flex justify-center gap-2 hover:bg-emerald-700 transition">
                Enter <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* =============================
     DASHBOARDS (Already Dark)
     ============================= */
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation role={currentUser.role} userName={currentUser.name} onLogout={handleLogout} />

      {currentUser.role === UserRole.PROVIDER && <ProviderDashboard user={currentUser} />}
      {currentUser.role === UserRole.NGO && <NGODashboard user={currentUser} />}
      {currentUser.role === UserRole.ADMIN && <AdminDashboard />}
    </div>
  );
}

/* =============================
   ROLE CARD (Dark Version)
   ============================= */
function RoleCard({
  title,
  icon: Icon,
  onClick
}: {
  title: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-gray-900 text-white rounded-xl shadow
                 hover:bg-gray-800 hover:scale-105 transition"
    >
      <Icon size={32} className="mx-auto mb-2 text-emerald-500" />
      <p className="font-bold">{title}</p>
    </button>
  );
}
