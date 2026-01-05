import React from "react";
import { Trophy, Star, Award } from "lucide-react";
import { LEVELS } from "../constants";

interface GamificationSectionProps {
  points: number;
}

const GamificationSection: React.FC<GamificationSectionProps> = ({ points }) => {
  const currentLevel =
    LEVELS.find((l) => points >= l.min && points <= l.max) || LEVELS[0];

  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];

  const progress = nextLevel
    ? ((points - currentLevel.min) /
        (nextLevel.min - currentLevel.min)) *
      100
    : 100;

  const badgeCount = Math.floor(points / 10);

  return (
    <div className="space-y-6">
      {/* LEVEL CARD */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-slate-400 text-xs uppercase">
              Your Impact Level
            </p>
            <h4 className={`text-xl font-bold ${currentLevel.color}`}>
              {currentLevel.name}
            </h4>
          </div>
          <Trophy className="text-amber-400" size={24} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>{points} Points</span>
            {nextLevel && <span>Next: {nextLevel.min}</span>}
          </div>

          <div className="h-3 bg-white/10 rounded-full">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* BADGES */}
      <div className="bg-white p-6 rounded-2xl">
        <div className="flex justify-between mb-3">
          <h5 className="font-bold flex items-center gap-2">
            <Award size={18} className="text-emerald-600" />
            Earned Badges
          </h5>
          <span className="text-xs text-slate-400">
            {badgeCount} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl flex items-center justify-center border-2 ${
                i < badgeCount
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : "bg-slate-50 border-slate-100 text-slate-300 opacity-50"
              }`}
            >
              <Star
                size={20}
                fill={i < badgeCount ? "currentColor" : "none"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationSection;
