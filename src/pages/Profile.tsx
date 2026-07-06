import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Key,
  BellRing,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Copy,
  Lock,
  Compass,
  Edit2,
  Check,
  Building,
  Briefcase
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { UserProfile } from '../types';
import { initialUserProfile } from '../data';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { userProfile, updateProfile } = useAuth();
  
  const currentProfile = userProfile || initialUserProfile;
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentProfile.name);
  const [editRole, setEditRole] = useState(currentProfile.role);
  const [editDepartment, setEditDepartment] = useState(currentProfile.department);
  const [isSaving, setIsSaving] = useState(false);

  // Sync edits if database changes/loads
  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.name);
      setEditRole(userProfile.role);
      setEditDepartment(userProfile.department);
    }
  }, [userProfile]);

  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRegenerateKey = async () => {
    const chars = 'abcdef0123456789';
    let newKey = 'cm_live_';
    for (let i = 0; i < 24; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    try {
      await updateProfile({ apiKey: newKey });
      showToast('Secure credentials regenerated and synced.');
    } catch (err: any) {
      showToast('Failed to sync regenerated key.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentProfile.apiKey || '');
    setIsCopied(true);
    showToast('API credential copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleAlert = async (alertName: string) => {
    const activeAlerts = currentProfile.activeAlerts || [];
    const exists = activeAlerts.includes(alertName);
    const updated = exists
      ? activeAlerts.filter(a => a !== alertName)
      : [...activeAlerts, alertName];
    
    try {
      await updateProfile({ activeAlerts: updated });
      showToast('Alert preferences updated in cloud database.');
    } catch (err: any) {
      showToast('Failed to sync alert preferences.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: editName,
        role: editRole,
        department: editDepartment
      });
      setIsEditing(false);
      showToast('Administrative Identity synchronized with database.');
    } catch (err: any) {
      showToast('Failed to synchronize identity profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Toast alert */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-brand-cyan/20 text-brand-cyan shadow-2xl font-sans"
        >
          <Sparkles size={18} />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex justify-between items-center">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Administrative Identity</h2>
          <p className="text-xs text-slate-400">Manage user clearance levels, active subscriptions, and secure access keys.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit2 size={13} className="text-brand-cyan" />
            <span>Edit Identity</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(currentProfile.name);
                setEditRole(currentProfile.role);
                setEditDepartment(currentProfile.department);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-400 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Profile Card left */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <GlassCard className="h-full flex flex-col justify-between" hoverEffect={false}>
            <div className="space-y-6 text-center lg:text-left">
              {/* Profile Image centering */}
              <div className="flex flex-col lg:flex-row items-center gap-5">
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-brand-purple ring-offset-4 ring-offset-slate-950"
                />
                
                <div className="space-y-1.5 min-w-0 flex-grow">
                  {!isEditing ? (
                    <>
                      <h3 className="font-display font-bold text-lg text-white truncate">{currentProfile.name}</h3>
                      <span className="text-xs font-mono text-brand-cyan font-bold block">{currentProfile.role}</span>
                      <span className="text-[10px] text-slate-400 block">{currentProfile.department}</span>
                    </>
                  ) : (
                    <div className="space-y-2 text-left w-full">
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Clearance Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Designation Role</label>
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Department</label>
                        <input
                          type="text"
                          value={editDepartment}
                          onChange={(e) => setEditDepartment(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clearance levels details */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">CLEARANCE CREDENTIALS</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] text-slate-500 block">Clearance level</span>
                    <span className="text-sm font-semibold text-white mt-1 block">Level 04</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] text-slate-500 block">Session status</span>
                    <span className="text-sm font-semibold text-emerald-400 mt-1 block font-mono">Authenticated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1"><Compass size={12} className="text-brand-purple animate-spin" style={{ animationDuration: '20s' }} /> ID: CM_93021X</span>
              <span>EMAIL: {currentProfile.email}</span>
            </div>
          </GlassCard>
        </div>

        {/* API keys and Alert preferences right */}
        <div className="lg:col-span-7 space-y-6">
          {/* API Key node */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2.5 text-brand-cyan">
              <Key size={18} />
              <h3 className="font-display font-bold text-sm text-white">Secure API Credentials</h3>
            </div>
            <p className="text-xs text-slate-400">Authenticate external automated script terminals, servers, and model pipelines with this unique access code.</p>

            <div className="flex items-center gap-2">
              <div className="flex-grow bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-300 font-mono overflow-x-auto truncate">
                {currentProfile.apiKey}
              </div>
              
              <button
                onClick={copyToClipboard}
                className="p-3 rounded-xl border border-white/5 bg-white/5 hover:border-brand-cyan/30 hover:bg-white/10 text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
                title="Copy Credential"
              >
                <Copy size={15} />
              </button>

              <button
                onClick={handleRegenerateKey}
                className="p-3 rounded-xl border border-white/5 bg-white/5 hover:border-brand-purple/30 hover:bg-white/10 text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
                title="Regenerate Credential"
              >
                <RefreshCw size={15} />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal">
              Warning: Regenerating your security API key immediately invalidates all active automation scripts connected to the CityMind endpoint. Handle with care.
            </p>
          </GlassCard>

          {/* Active alerts panel */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2.5 text-brand-purple">
              <BellRing size={18} />
              <h3 className="font-display font-bold text-sm text-white">Active Alert Notifications</h3>
            </div>
            <p className="text-xs text-slate-400">Choose which dynamic municipal alerts you wish to subscribe to in your main navbar feed.</p>

            <div className="space-y-2.5">
              {[
                { name: 'District 4 Power Grid Load Peak', desc: 'Alerts when localized grid factors exceed 85% safety limits.' },
                { name: 'Northbound Express Traffic Bottleneck', desc: 'Alerts if travel delays exceed an average of 15 minutes.' },
                { name: 'Air Quality Index drop in Industrial Zone', desc: 'Trigger alerts when laser particulate measurements drop past 100 US AQI.' }
              ].map((alert, idx) => {
                const isActive = (currentProfile.activeAlerts || []).includes(alert.name);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleAlert(alert.name)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                      isActive
                        ? 'bg-brand-purple/5 border-brand-purple/20 hover:border-brand-purple/30'
                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-semibold block ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                        {alert.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{alert.desc}</span>
                    </div>

                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${
                      isActive ? 'bg-brand-purple flex justify-end' : 'bg-slate-800 flex justify-start'
                    }`}>
                      <div className="w-3 h-3 bg-white rounded-full shadow-md" />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
