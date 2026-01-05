
import React from 'react';
import { LogOut, User, Bell, LayoutDashboard } from 'lucide-react';
import { UserRole } from '../types';

interface NavigationProps {
  role: UserRole;
  userName: string;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ role, userName, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              FoodRescue
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">{userName}</p>
                <p className="text-xs text-slate-400 capitalize">{role.toLowerCase()}</p>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all text-sm font-medium text-slate-600"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
