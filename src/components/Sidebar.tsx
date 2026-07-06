import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  Map,
  BarChart3,
  TrendingUp,
  FileText,
  AlertTriangle,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { initialUserProfile } from '../data';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, onLogout }) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const currentProfile = userProfile || initialUserProfile;
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Decision Assistant', path: '/assistant', icon: Brain },
    { name: 'Interactive Map', path: '/map', icon: Map },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Predictions', path: '/predictions', icon: TrendingUp },
    { name: 'Insights', path: '/insights', icon: Database },
    { name: 'Community Reports', path: '/community', icon: AlertTriangle }
  ];

  const adminItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 bg-slate-900/50 border-r border-slate-800/60 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-brand-blue rounded-lg flex items-center justify-center shrink-0">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm leading-none text-white tracking-tight">
                  CityMind <span className="text-brand-cyan">AI</span>
                </span>
                <span className="text-[8px] text-slate-400 font-mono tracking-wider uppercase mt-1">
                  MUNICIPAL CORE
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-brand-cyan transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-6">
          <div>
            <span className={`text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 block mb-3 transition-opacity ${collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
              Decisions & Core
            </span>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-slate-800/60 text-white border border-slate-700/50 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
                      }`
                    }
                  >
                    <item.icon size={16} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {!collapsed && <span className="text-xs font-medium tracking-wide">{item.name}</span>}
                    {collapsed && (
                      <div className="absolute left-16 bg-slate-950 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-slate-850">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={`text-[10px] font-mono tracking-widest text-slate-500 uppercase px-2 block mb-3 transition-opacity ${collapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
              Administration
            </span>
            <ul className="space-y-1">
              {adminItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-slate-800/60 text-white border border-slate-700/50 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'
                      }`
                    }
                  >
                    <item.icon size={16} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {!collapsed && <span className="text-xs font-medium tracking-wide">{item.name}</span>}
                    {collapsed && (
                      <div className="absolute left-16 bg-slate-950 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-slate-850">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* User Session bottom panel */}
      <div className="p-4 border-t border-slate-800/60">
        {!collapsed && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg mb-4">
            <p className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold mb-1">System Status</p>
            <p className="text-xs text-slate-300">AI Core Optimal (99.8%)</p>
          </div>
        )}
        
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <img
                src={currentProfile.avatarUrl}
                alt={currentProfile.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate leading-tight">
                  {currentProfile.name}
                </h4>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">
                  {currentProfile.role}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 rounded-lg transition-all"
            >
              <LogOut size={12} />
              <span>Log out Session</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={currentProfile.avatarUrl}
              alt={currentProfile.name}
              className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:ring-2 hover:ring-brand-cyan transition-all"
              onClick={() => navigate('/profile')}
            />
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Log out Session"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
