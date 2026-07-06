import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings as SettingsIcon,
  Cpu,
  RefreshCw,
  Sliders,
  Shield,
  Activity,
  CheckCircle2,
  Lock,
  Database,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Settings: React.FC = () => {
  const [activeModel, setActiveModel] = useState<string>('neural_matrix');
  const [ingestionSpeed, setIngestionSpeed] = useState<number>(5);
  const [replicationEnabled, setReplicationEnabled] = useState<boolean>(true);
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(true);

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveSettings = () => {
    showToast('Platform configurations committed to memory node.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">System Config Center</h2>
          <p className="text-xs text-slate-400">Configure ML model thresholds, ingestion speeds, and data backup replication.</p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:brightness-110 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <CheckCircle2 size={14} />
          <span>Commit Configurations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ML Engine settings left */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2.5 text-brand-cyan">
              <Cpu size={18} />
              <h3 className="font-display font-bold text-sm text-white">Active Intelligence Engine</h3>
            </div>
            <p className="text-xs text-slate-400">Choose which neural network model structures govern your predictive outputs and policy insights.</p>

            <div className="space-y-3 pt-2">
              {[
                { id: 'neural_matrix', name: 'Neural-Matrix City-9 Model', desc: 'Deep learning spatial grid regression. Yields high forecasting accuracy (98.4%) but consumes supplementary server nodes.' },
                { id: 'linear_urban', name: 'Linear Urban-S Predictor', desc: 'Fast, linear mathematical regressions. Optimized for quick macro evaluations with limited computational load.' },
                { id: 'spatial_progression', name: 'Spatial Progression Model', desc: 'Reinforcement learning model that targets ecological and street network curves sequentially.' }
              ].map(model => {
                const isSelected = activeModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setActiveModel(model.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex gap-3.5 items-start ${
                      isSelected
                        ? 'bg-brand-cyan/5 border-brand-cyan/30 text-slate-100'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border p-1 mt-1 flex items-center justify-center ${
                      isSelected ? 'border-brand-cyan text-brand-cyan' : 'border-slate-700'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />}
                    </div>

                    <div>
                      <span className={`text-xs font-semibold block ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {model.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1 leading-normal">{model.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Security & System variables right */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2.5 text-brand-purple">
              <Sliders size={18} />
              <h3 className="font-display font-bold text-sm text-white">Telemetry & Data Variables</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans">Control sensor refresh timeouts and data storage options.</p>

            <div className="space-y-4 pt-2">
              {/* Slider for ingestion speed */}
              <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">Sensor Sync Interval</span>
                  <span className="font-mono text-brand-purple font-bold">{ingestionSpeed} seconds</span>
                </div>
                
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={ingestionSpeed}
                  onChange={(e) => setIngestionSpeed(parseInt(e.target.value))}
                  className="w-full accent-brand-purple bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
                
                <p className="text-[9px] text-slate-500">Lower periods increase telemetry accuracy but incur heavier API key loads.</p>
              </div>

              {/* Toggle replication */}
              <div
                onClick={() => setReplicationEnabled(!replicationEnabled)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  replicationEnabled
                    ? 'bg-brand-purple/5 border-brand-purple/20'
                    : 'bg-white/5 border-white/5 text-slate-500'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Durable Cloud Storage Backup</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Auto-replicate municipal policies to Cloud Run Firestore database caches.</span>
                </div>

                <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${
                  replicationEnabled ? 'bg-brand-purple flex justify-end' : 'bg-slate-800 flex justify-start'
                }`}>
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Security & Access */}
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Shield size={18} />
              <h3 className="font-display font-bold text-sm text-white">Security & Integrity</h3>
            </div>

            <div
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                mfaEnabled
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-white/5 border-white/5 text-slate-500'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">LDAP Multi-Factor Authenticator</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Require multi-factor authorization whenever issuing extreme dispatches.</span>
              </div>

              <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${
                mfaEnabled ? 'bg-emerald-500 flex justify-end' : 'bg-slate-800 flex justify-start'
              }`}>
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
