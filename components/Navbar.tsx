import React from 'react';
import { UserPreferences } from '../types';
import { Cpu, Settings } from 'lucide-react';

interface NavbarProps {
  user: UserPreferences;
  onOpenProfile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onOpenProfile }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                TechDigest.ai
              </h1>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-700">Hello, {user.name}</p>
              <p className="text-xs text-slate-500">{user.topics.length} Subscriptions</p>
            </div>
            
            <button 
              onClick={onOpenProfile}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full transition-all active:scale-95 group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:shadow-indigo-200 transition-all">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">Profile</span>
              <Settings className="w-4 h-4 ml-1 opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;