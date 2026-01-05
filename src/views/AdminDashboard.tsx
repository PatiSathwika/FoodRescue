import { useState, useEffect } from "react";

import {
  Users,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Activity,
  Download,
  Heart
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import StatsCard from "../components/StatsCard";
import { getDonations } from "../services/firestoreService";
import { FoodDonation } from "../types";

const AdminDashboard = () => {
  const [donations, setDonations] = useState<FoodDonation[]>([]);

  useEffect(() => {
    getDonations()
      .then(setDonations)
      .catch(console.error);
  }, []);

  // ===== METRICS =====
  const totalKg = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);
  const totalMeals = totalKg * 2;
  const highUrgency = donations.filter(d => d.urgency === "HIGH").length;

  // ===== CHART DATA (derived monthly – simple demo logic) =====
  const chartData = [
    { name: "Jan", kg: totalKg * 0.15 },
    { name: "Feb", kg: totalKg * 0.2 },
    { name: "Mar", kg: totalKg * 0.25 },
    { name: "Apr", kg: totalKg * 0.3 },
    { name: "May", kg: totalKg * 0.35 },
    { name: "Jun", kg: totalKg * 0.4 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">
            Platform Analytics
          </h1>
          <p className="text-slate-400">
            Live system impact monitoring
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-6 py-3 rounded-xl hover:bg-slate-900">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Food Saved"
          value={`${totalKg} kg`}
          icon={TrendingUp}
          color="bg-emerald-600"
        />
        <StatsCard
          title="Meals Distributed"
          value={totalMeals}
          icon={Heart}
          color="bg-rose-500"
        />
        <StatsCard
          title="Total Donations"
          value={donations.length}
          icon={Users}
          color="bg-indigo-500"
        />
        <StatsCard
          title="High Urgency Alerts"
          value={highUrgency}
          icon={AlertCircle}
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-200 mb-4">
            Food Saved Trend (kg)
          </h3>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="kgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                <YAxis tick={{ fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "8px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="kg"
                  stroke="#10b981"
                  fill="url(#kgGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Live Activity */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4">
              <Activity className="text-emerald-400" size={18} />
              Live Activity
            </h3>

            <div className="space-y-3">
              {donations.slice(0, 5).map(d => (
                <div key={d.id} className="border-l-2 border-slate-700 pl-3">
                  <p className="text-slate-300 text-sm">
                    {d.type} • {d.quantity}kg
                  </p>
                  <p className="text-xs text-slate-500">
                    {d.providerName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4">
              System Health
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>API Availability</span>
                  <span>99.9%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded">
                  <div className="h-full w-[99.9%] bg-emerald-500 rounded" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Server Load</span>
                  <span>42%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded">
                  <div className="h-full w-[42%] bg-amber-500 rounded" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
