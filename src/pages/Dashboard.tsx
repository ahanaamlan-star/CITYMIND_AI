import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Car,
  Wind,
  ShieldCheck,
  RefreshCw,
  Droplet,
  Compass,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { CityVital, Recommendation } from '../types';

interface DashboardProps {
  vitals: CityVital[];
  setVitals: React.Dispatch<React.SetStateAction<CityVital[]>>;
  recommendations: Recommendation[];
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>;
}

// Chart sample data
const activityChartData = [
  { time: '00:00', congestion: 20, load: 45, carbon: 30 },
  { time: '04:00', congestion: 15, load: 38, carbon: 22 },
  { time: '08:00', congestion: 78, load: 68, carbon: 85 },
  { time: '12:00', congestion: 65, load: 84, carbon: 78 },
  { time: '16:00', congestion: 88, load: 92, carbon: 92 },
  { time: '20:00', congestion: 45, load: 72, carbon: 55 },
  { time: '24:00', congestion: 22, load: 50, carbon: 35 }
];

export const Dashboard: React.FC<DashboardProps> = ({
  vitals,
  setVitals,
  recommendations,
  setRecommendations
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'alert'>('success');

  const showToast = (message: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredVitals = vitals.filter(vital => {
    if (selectedCategory === 'All') return true;
    return vital.category === selectedCategory;
  });

  const getVitalIcon = (category: string) => {
    switch (category) {
      case 'Mobility':
        return <Car className="text-brand-blue" size={20} />;
      case 'Energy':
        return <Zap className="text-amber-400" size={20} />;
      case 'Safety':
        return <ShieldCheck className="text-emerald-400" size={20} />;
      case 'Environment':
        return <Wind className="text-brand-cyan" size={20} />;
      default:
        return <Activity className="text-white" size={20} />;
    }
  };

  const triggerRapidAction = (actionName: string) => {
    showToast(`Simulation initiated: "${actionName}" dispatched successfully.`, 'success');
  };

  const handleApplyRecommendation = (id: string, title: string) => {
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status: 'active' } : rec))
    );
    showToast(`Policy change applied: "${title}" is now running active.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass shadow-[0_10px_30px_rgba(0,0,0,0.5)] border ${
            toastType === 'success' ? 'border-emerald-500/20 text-emerald-400' : 'border-rose-500/20 text-rose-400'
          }`}
        >
          {toastType === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span className="text-xs font-medium font-sans tracking-wide">{toastMessage}</span>
        </motion.div>
      )}

      {/* Grid Filter and Sub-header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">City Control Command</h2>
          <p className="text-xs text-slate-400">Integrated multi-system sensor network monitoring Districts 1-12.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Mobility', 'Energy', 'Safety', 'Environment'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid: City Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVitals.map(vital => (
          <GlassCard key={vital.id} className="relative overflow-hidden group">
            {/* Status light glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-10 ${
              vital.status === 'optimal' ? 'bg-emerald-500' : vital.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
            }`} />

            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-brand-cyan/20 transition-all">
                {getVitalIcon(vital.category)}
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                vital.status === 'optimal'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : vital.status === 'warning'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
              }`}>
                {vital.status}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <span className="text-xs text-slate-400 font-medium block truncate">{vital.name}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {vital.value}
                </span>
                <span className="text-xs text-slate-400 font-mono">{vital.unit}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">vs yesterday</span>
              <span className={`font-mono font-bold flex items-center ${
                vital.change < 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {vital.change > 0 ? '+' : ''}{vital.change}%
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Analytics and Action Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Analytics Card */}
        <div className="lg:col-span-8">
          <GlassCard className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-bold text-base text-white">Dynamic Load Distribution</h3>
                <p className="text-xs text-slate-400">Comparing traffic congestion rates and power grid thresholds over 24-hour cycles.</p>
              </div>
              <span className="text-xs text-brand-cyan font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Live Feed</span>
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 41, 59, 0.4)" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(30, 41, 59, 0.8)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)'
                    }}
                  />
                  <Area type="monotone" dataKey="congestion" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorCongestion)" name="Congestion Rate (%)" />
                  <Area type="monotone" dataKey="load" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" name="Grid Load Factor (MW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Rapid Actions Control Room */}
        <div className="lg:col-span-4">
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white">Rapid Control Room</h3>
              <p className="text-xs text-slate-400 mb-6">Execute high-priority municipal dispatches and automatic system overrides.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => triggerRapidAction('Evacuation Simulation')}
                  className="w-full text-left p-3 rounded-lg border border-rose-500/15 bg-rose-500/5 hover:bg-rose-500/10 transition-all flex items-start gap-3 group"
                >
                  <AlertTriangle className="text-rose-400 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-xs font-semibold text-rose-300 group-hover:underline">Simulate Emergency Pathing</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Model dynamic routing for sirens, blocking high-occupancy grids.</p>
                  </div>
                </button>

                <button
                  onClick={() => triggerRapidAction('Broadway Green Peak Calibration')}
                  className="w-full text-left p-3 rounded-lg border border-brand-cyan/15 bg-brand-cyan/5 hover:bg-brand-cyan/10 transition-all flex items-start gap-3 group"
                >
                  <Car className="text-brand-cyan mt-0.5" size={16} />
                  <div>
                    <h4 className="text-xs font-semibold text-brand-cyan group-hover:underline">Engage Eco-Flow Timers</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Force secondary Broadway intersections to match eco-transit rhythms.</p>
                  </div>
                </button>

                <button
                  onClick={() => triggerRapidAction('District 4 Supplemental Microgrid Ignition')}
                  className="w-full text-left p-3 rounded-lg border border-amber-500/15 bg-amber-500/5 hover:bg-amber-500/10 transition-all flex items-start gap-3 group"
                >
                  <Zap className="text-amber-400 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-300 group-hover:underline">Trigger Microgrid Shaving</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">Feed commercial thermal batteries back into Central Substation 4.</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <Compass size={12} className="text-brand-purple" />
              <span>DISPATCH CAPABILITIES LEVEL: 04 (CHIEF)</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Active High-Confidence AI Suggestions */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-base text-white">Recommended Policy Interventions</h3>
            <p className="text-xs text-slate-400">Critical optimizations generated by CityMind models currently waiting for approval.</p>
          </div>
          <span className="text-[10px] font-mono text-brand-purple uppercase tracking-wider flex items-center gap-1 bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-full">
            <BellRing size={12} className="animate-pulse" />
            <span>AI ENGINE EVALUATIONS READY</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.slice(0, 2).map(rec => (
            <div
              key={rec.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-brand-purple/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-xs font-bold text-slate-200">{rec.title}</h4>
                  <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-full font-bold">
                    {rec.confidence}% Confidence
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rec.description}</p>
                
                {/* Metric changes */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {rec.metricsAffected.map((metric, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800 p-2 rounded-lg text-[10px]">
                      <span className="text-slate-500 block truncate">{metric.metric}</span>
                      <span className={`font-mono font-bold ${metric.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {metric.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-mono">
                  Cost: <span className="text-slate-300 font-sans font-medium">{rec.costEstimate}</span>
                </div>
                {rec.status === 'active' ? (
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Applied & Live</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyRecommendation(rec.id, rec.title)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-purple hover:bg-brand-purple/90 text-white transition-all flex items-center gap-1.5"
                  >
                    <span>Approve Policy</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
