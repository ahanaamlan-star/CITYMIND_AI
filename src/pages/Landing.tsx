import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Brain,
  Map,
  TrendingUp,
  Database,
  ArrowRight,
  Sparkles,
  Cpu,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-brand-cyan/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-slate-800/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-lg text-brand-cyan">C</span>
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white tracking-wide">
              CityMind <span className="text-brand-cyan">AI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-brand-cyan to-brand-blue hover:brightness-110 text-slate-950 font-bold rounded-lg shadow-md transition-all flex items-center gap-2 group"
          >
            <span>Launch Platform</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex-grow relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles size={12} />
              <span>Next-Gen Urban Decision Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-white leading-[1.1]"
            >
              Transforming urban data into{' '}
              <span className="text-gradient">better decisions</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Empower city leaders, urban planners, and agencies with predictive
              simulations, live multi-modal sensor tracking, AI-driven recommendations, and crowdsourced reporting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 rounded-lg shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-3 group"
              >
                <span>Enter Admin Console</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium border border-slate-800 hover:border-slate-700 rounded-lg bg-slate-900/65 hover:bg-slate-800/40 text-center transition-all"
              >
                Explore Modules
              </a>
            </motion.div>
          </div>

          {/* Interactive Mock visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md aspect-square rounded-2xl relative p-[1px] bg-gradient-to-b from-brand-blue/20 via-transparent to-brand-purple/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-full h-full bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between border border-slate-800 overflow-hidden">
                {/* Simulated UI Window Header */}
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-brand-cyan">CORE_AI_ACTIVE</span>
                </div>

                {/* Simulated Nodes/Visualizer */}
                <div className="flex-grow flex items-center justify-center relative my-4">
                  {/* Glowing core */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple opacity-20 blur-2xl animate-pulse absolute" />
                  <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center relative">
                    <Brain className="text-brand-cyan animate-bounce" size={28} />
                    {/* Ring orbits */}
                    <div className="absolute w-28 h-28 border border-dashed border-brand-purple/20 rounded-full animate-spin [animation-duration:15s]" />
                  </div>

                  {/* Tiny floating stat nodes */}
                  <div className="absolute top-2 left-6 glass px-2.5 py-1 rounded-lg text-[9px] font-mono border border-slate-800">
                    <span className="text-slate-400">EMISSION:</span> <span className="text-emerald-400">-12.4%</span>
                  </div>
                  <div className="absolute bottom-6 right-2 glass px-2.5 py-1 rounded-lg text-[9px] font-mono border border-slate-800">
                    <span className="text-slate-400">CONGESTION:</span> <span className="text-brand-cyan">OPTIMAL</span>
                  </div>
                </div>

                {/* Footer simulation details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Active Sensors</span>
                    <span className="font-mono text-white">4,812 Connected</span>
                  </div>
                  <div className="w-full bg-slate-950/80 border border-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full w-4/5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Module Section */}
        <section id="features" className="pt-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
              Smarter Solutions for Resilient Cities
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              CityMind consolidates municipal operations into a single platform driven by predictive intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-blue">
                <Brain size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">AI Decision Assistant</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Interact with highly trained ML models to model hypothetical actions and receive step-by-step mitigation advice.
              </p>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-cyan">
                <Map size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Interactive Urban Map</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Visualize active nodes, live traffic densities, power distribution lines, and local resident feedback layers on a dynamic grid.
              </p>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-purple">
                <TrendingUp size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Predictions & Projections</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tune macro factors with granular sliders to evaluate long-term carbon emissions, financial deficit forecasts, and livability impact.
              </p>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-cyan">
                <Database size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Actionable Insights</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Automated diagnostics trigger optimal recommendations, showing estimated deployment budgets and structural confidence levels.
              </p>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-blue">
                <Eye size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Crowdsourced Alerts</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Real-time portal to ingest, upvote, and track resident reports ranging from water main leaks to infrastructure safety concerns.
              </p>
            </GlassCard>

            <GlassCard className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-purple">
                <Cpu size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Enterprise Scalability</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Designed to ingest telemetry from massive sensor networks with dedicated security layers and granular role access.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pt-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 glass rounded-lg border border-slate-800/60">
            <div className="text-3xl sm:text-4xl font-display font-bold text-brand-blue">98.4%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Prediction Accuracy</div>
          </div>
          <div className="p-6 glass rounded-lg border border-slate-800/60">
            <div className="text-3xl sm:text-4xl font-display font-bold text-brand-cyan">140k+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">IoT Grid Sensors</div>
          </div>
          <div className="p-6 glass rounded-lg border border-slate-800/60">
            <div className="text-3xl sm:text-4xl font-display font-bold text-brand-purple">22 min</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Mean Dispatch Shaved</div>
          </div>
          <div className="p-6 glass rounded-lg border border-slate-800/60">
            <div className="text-3xl sm:text-4xl font-display font-bold text-white">12</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Governed Districts</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950 py-8 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-white">CityMind <span className="text-brand-cyan">AI</span></span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">Security Architecture</a>
            <a href="#privacy" className="hover:text-white transition-colors">API Keys Node</a>
            <a href="#docs" className="hover:text-white transition-colors">System Schema</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
