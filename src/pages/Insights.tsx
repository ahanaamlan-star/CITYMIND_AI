import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  DollarSign,
  Activity
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Recommendation } from '../types';

interface InsightsProps {
  recommendations: Recommendation[];
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>;
}

export const Insights: React.FC<InsightsProps> = ({ recommendations, setRecommendations }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApply = (id: string, title: string) => {
    // Set to active
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status: 'active' } : rec))
    );
    showToast(`Policy change executed: "${title}" is now deployed.`);
  };

  const handleSimulate = (id: string, title: string) => {
    // Set to simulating
    setRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status: 'simulating' } : rec))
    );
    showToast(`Quantum modeling initiated for: "${title}".`);
    
    // Auto-complete simulation after 3 seconds
    setTimeout(() => {
      setRecommendations(prev =>
        prev.map(rec => (rec.id === id ? { ...rec, status: 'pending', confidence: Math.min(99, rec.confidence + 2) } : rec))
      );
      showToast(`Simulation complete. Recommendations recalibrated for: "${title}".`);
    }, 3000);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesCategory = categoryFilter === 'All' || rec.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'All' || rec.urgency === urgencyFilter;
    const matchesSearch = rec.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          rec.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesUrgency && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-brand-purple/20 text-brand-purple shadow-2xl font-sans"
        >
          <Sparkles size={18} />
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Dynamic Policy Decisions Hub</h2>
          <p className="text-xs text-slate-400">Automated machine-learning insights formulated to offset urban bottlenecks.</p>
        </div>

        {/* Sync telemetry info */}
        <div className="flex items-center gap-2 text-brand-purple text-[11px] font-mono font-bold bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-full uppercase">
          <Database size={12} />
          <span>INSIGHT ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Search and Filters bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search recommendation indices..."
            className="w-full bg-[#050811]/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-cyan/40"
          />
        </div>

        {/* Category filter */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="text-slate-500 shrink-0" size={14} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#050811]/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-brand-cyan/40"
          >
            <option value="All">All Categories</option>
            <option value="Mobility">Mobility</option>
            <option value="Energy">Energy</option>
            <option value="Safety">Safety</option>
            <option value="Environment">Environment</option>
          </select>
        </div>

        {/* Urgency filter */}
        <div className="md:col-span-4">
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full bg-[#050811]/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-brand-cyan/40"
          >
            <option value="All">All Urgency Levels</option>
            <option value="Immediate">Immediate Impact</option>
            <option value="Scheduled">Scheduled Deployment</option>
            <option value="Routine">Routine Maintenance</option>
          </select>
        </div>
      </div>

      {/* Policy list */}
      <div className="space-y-6">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map(rec => (
            <GlassCard key={rec.id} className="p-0 overflow-hidden" hoverEffect={false}>
              {/* Header border banner */}
              <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[9px] font-mono tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                    rec.category === 'Mobility'
                      ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                      : rec.category === 'Energy'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : rec.category === 'Safety'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20'
                  }`}>
                    {rec.category}
                  </span>

                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    rec.urgency === 'Immediate'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    <Clock size={10} />
                    <span>{rec.urgency}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">Confidence Score:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full" style={{ width: `${rec.confidence}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-cyan">{rec.confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left info */}
                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="font-display font-bold text-lg text-white leading-snug">{rec.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                    
                    <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 space-y-1.5">
                      <span className="text-[10px] text-brand-purple font-mono font-bold tracking-wide block">INTELLIGENCE COGNITIVE REASONING</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{rec.aiReasoning}</p>
                    </div>
                  </div>

                  {/* Right impact indicators */}
                  <div className="lg:col-span-4 bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] text-slate-500 font-mono uppercase font-bold mb-3 tracking-wide">Forecasted Impact Delta</h4>
                      <div className="space-y-2">
                        {rec.metricsAffected.map((metric, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-b-0">
                            <span className="text-xs text-slate-300 font-medium">{metric.metric}</span>
                            <span className={`text-xs font-mono font-bold ${metric.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {metric.change}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">Capital cost</span>
                      <span className="text-white font-sans font-semibold flex items-center gap-0.5">
                        <DollarSign size={12} className="text-brand-cyan" />
                        {rec.costEstimate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Created: {new Date(rec.createdAt).toLocaleDateString()} at {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {rec.status === 'simulating' ? (
                      <button className="w-full sm:w-auto px-4 py-2 bg-brand-purple/20 border border-brand-purple/30 text-brand-purple rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed">
                        <Activity className="animate-spin" size={13} />
                        <span>Quantum Simulating...</span>
                      </button>
                    ) : rec.status === 'active' ? (
                      <span className="px-4 py-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1.5 justify-center w-full sm:w-auto">
                        <CheckCircle2 size={13} />
                        <span>Policy Live</span>
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSimulate(rec.id, rec.title)}
                          className="w-full sm:w-auto px-4 py-2 border border-white/10 hover:border-brand-purple/30 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-semibold transition-all"
                        >
                          Run Scenario Check
                        </button>
                        <button
                          onClick={() => handleApply(rec.id, rec.title)}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:brightness-110 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Execute Intervention</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-2 glass rounded-2xl border border-white/5">
            <AlertTriangle className="mx-auto" size={24} />
            <h4 className="text-sm font-bold text-white">No policies found</h4>
            <p className="text-xs max-w-sm mx-auto">Adjust search parameters or category filter dropdown to locate automated policy options.</p>
          </div>
        )}
      </div>
    </div>
  );
};
