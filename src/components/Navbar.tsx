import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, RefreshCw, Radio, Search } from 'lucide-react';
import { initialUserProfile } from '../data';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const currentProfile = userProfile || initialUserProfile;
  
  // Format current page name from path
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Core Platform';
    
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="h-16 border-b border-slate-800/60 bg-slate-900/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Search / Breadcrumb */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to="/" className="hover:text-brand-cyan transition-colors">CITYMIND</Link>
          <span>/</span>
          <span className="text-white font-semibold tracking-wide uppercase">{getPageTitle()}</span>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 w-64 relative">
          <Search size={12} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search city datasets..."
            className="bg-transparent text-xs text-white border-none outline-none w-full placeholder:text-slate-600 font-sans"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-600 border border-slate-800 px-1 rounded bg-slate-950">⌘K</kbd>
        </div>
      </div>

      {/* Right Core Status and Alerts */}
      <div className="flex items-center gap-4">
        {/* Connection Pulse Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
          <Radio size={12} className="animate-pulse" />
          <span>SIMULATION: ONLINE</span>
        </div>

        {/* Sync Indicator */}
        <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/30 text-slate-400 hover:text-white transition-all">
          <RefreshCw size={13} />
        </button>

        {/* Alerts Bell */}
        <div className="relative group">
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/30 text-slate-400 hover:text-white transition-all">
            <Bell size={13} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-purple" />
          </button>
          
          {/* Faint dropdown for alerts */}
          <div className="absolute right-0 mt-2 w-72 glass rounded-2xl border border-slate-800 p-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 shadow-2xl">
            <h4 className="font-display font-bold text-xs text-white mb-3 tracking-wide">ACTIVE CORE ALERTS</h4>
            <div className="space-y-2">
              {(currentProfile.activeAlerts || []).map((alert, idx) => (
                <div key={idx} className="flex gap-2 items-start text-[11px] p-2 rounded-lg bg-rose-500/5 border border-rose-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <p className="text-slate-300 font-medium leading-normal">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
