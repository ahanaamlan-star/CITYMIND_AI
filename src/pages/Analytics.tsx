import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Cpu,
  Database,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ComposedChart,
  Area
} from 'recharts';
import { GlassCard } from '../components/GlassCard';

// Sample data structures
const hourlyData = [
  { label: '02:00', congestion: 18, renewable: 72, quality: 130 },
  { label: '06:00', congestion: 35, renewable: 65, quality: 125 },
  { label: '10:00', congestion: 82, renewable: 40, quality: 110 },
  { label: '14:00', congestion: 68, renewable: 55, quality: 118 },
  { label: '18:00', congestion: 90, renewable: 48, quality: 135 },
  { label: '22:00', congestion: 42, renewable: 68, quality: 128 }
];

const weeklyData = [
  { label: 'Mon', congestion: 75, renewable: 58, quality: 122 },
  { label: 'Tue', congestion: 78, renewable: 60, quality: 124 },
  { label: 'Wed', congestion: 82, renewable: 55, quality: 128 },
  { label: 'Thu', congestion: 80, renewable: 62, quality: 126 },
  { label: 'Fri', congestion: 85, renewable: 64, quality: 132 },
  { label: 'Sat', congestion: 40, renewable: 78, quality: 114 },
  { label: 'Sun', congestion: 30, renewable: 82, quality: 108 }
];

const monthlyData = [
  { label: 'Wk 1', congestion: 72, renewable: 59, quality: 120 },
  { label: 'Wk 2', congestion: 74, renewable: 61, quality: 123 },
  { label: 'Wk 3', congestion: 76, renewable: 63, quality: 125 },
  { label: 'Wk 4', congestion: 68, renewable: 65, quality: 118 }
];

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'hourly' | 'weekly' | 'monthly'>('weekly');
  const [activeMetric, setActiveMetric] = useState<'congestion' | 'renewable' | 'quality'>('congestion');

  const getChartData = () => {
    switch (timeRange) {
      case 'hourly':
        return hourlyData;
      case 'monthly':
        return monthlyData;
      default:
        return weeklyData;
    }
  };

  const getMetricTitle = () => {
    switch (activeMetric) {
      case 'renewable':
        return 'Renewable Energy Capture';
      case 'quality':
        return 'Atmospheric AQI Density';
      default:
        return 'Macro Transit Congestion';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Statistical Analytics Center</h2>
          <p className="text-xs text-slate-400">Deep telemetry analysis of carbon levels, energy flow, and street networks.</p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {(['hourly', 'weekly', 'monthly'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                timeRange === range
                  ? 'bg-slate-950 text-white border border-slate-800/80 shadow-inner'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === 'hourly' ? '24 Hours' : range === 'weekly' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Select active analytic category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveMetric('congestion')}
          className={`text-left p-4 rounded-xl border transition-all ${
            activeMetric === 'congestion'
              ? 'bg-brand-blue/10 border-brand-blue/60 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wide">Congestion index</span>
            <TrendingDown className="text-emerald-400" size={14} />
          </div>
          <span className="text-xl font-display font-bold text-white mt-1.5 block">42.4% Average</span>
          <p className="text-[10px] text-slate-400 mt-1">Daily street volume latency ratios.</p>
        </button>

        <button
          onClick={() => setActiveMetric('renewable')}
          className={`text-left p-4 rounded-xl border transition-all ${
            activeMetric === 'renewable'
              ? 'bg-brand-purple/10 border-brand-purple/60 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wide">Renewable share</span>
            <TrendingUp className="text-emerald-400" size={14} />
          </div>
          <span className="text-xl font-display font-bold text-white mt-1.5 block">64.2% Capture</span>
          <p className="text-[10px] text-slate-400 mt-1">Solar PV and micro-hydro ratios.</p>
        </button>

        <button
          onClick={() => setActiveMetric('quality')}
          className={`text-left p-4 rounded-xl border transition-all ${
            activeMetric === 'quality'
              ? 'bg-brand-cyan/10 border-brand-cyan/60 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wide">Atmosphere quality</span>
            <TrendingUp className="text-rose-400" size={14} />
          </div>
          <span className="text-xl font-display font-bold text-white mt-1.5 block">124 AQI Density</span>
          <p className="text-[10px] text-slate-400 mt-1">Particulate matter local telemetry grids.</p>
        </button>
      </div>

      {/* Main Big Chart */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display font-bold text-base text-white">{getMetricTitle()}</h3>
            <p className="text-xs text-slate-400">Comparing real-time telemetry datasets under simulated environmental loads.</p>
          </div>
          <Calendar className="text-slate-500" size={18} />
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeMetric === 'congestion' ? '#0ea5e9' : activeMetric === 'renewable' ? '#8b5cf6' : '#06b6d4'} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={activeMetric === 'congestion' ? '#0ea5e9' : activeMetric === 'renewable' ? '#8b5cf6' : '#06b6d4'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 41, 59, 0.4)" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(30, 41, 59, 0.8)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#f8fafc'
                }}
              />
              <Area type="monotone" dataKey={activeMetric} stroke={activeMetric === 'congestion' ? '#0ea5e9' : activeMetric === 'renewable' ? '#8b5cf6' : '#06b6d4'} strokeWidth={2.5} fillOpacity={1} fill="url(#colorActive)" name={getMetricTitle()} />
              <Bar dataKey={activeMetric} barSize={20} fill="rgba(255,255,255,0.03)" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Grid Diagnostics details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-display font-bold text-base text-white mb-4">Historical System Calibration logs</h3>
          <div className="space-y-3">
            {[
              { id: 'CAL_48', title: 'Broadway Intersection Sync', author: 'AI Optimizer', status: 'optimal', date: '2 hours ago' },
              { id: 'CAL_47', title: 'District 4 Microgrid Peak-Shave', author: 'Elena Rostova', status: 'optimal', date: '4 hours ago' },
              { id: 'CAL_46', title: 'Industrial Scrubber Audit Limit', author: 'Automated Agent', status: 'warning', date: '1 day ago' }
            ].map(log => (
              <div key={log.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block">{log.id}</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{log.title}</span>
                  <span className="text-[10px] text-slate-400">Triggered by {log.author} • {log.date}</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                  log.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between" hoverEffect={false}>
          <div>
            <h3 className="font-display font-bold text-base text-white mb-2">Integrated Sensor Health Index</h3>
            <p className="text-xs text-slate-400 mb-6">Real-time status breakdown of active IoT components in District 1 through 12.</p>
            
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Transit Video Nodes</span>
                  <span className="font-mono text-emerald-400">99.2% Active</span>
                </div>
                <div className="w-full bg-slate-950/80 border border-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[99%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Microgrid Telemetry Points</span>
                  <span className="font-mono text-emerald-400">97.8% Active</span>
                </div>
                <div className="w-full bg-slate-950/80 border border-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[97%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Air Quality Lasers</span>
                  <span className="font-mono text-amber-400">88.4% Active</span>
                </div>
                <div className="w-full bg-slate-950/80 border border-slate-850 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[88%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1"><Cpu size={12} className="text-brand-purple" /> SYS_LOAD: 22%</span>
            <span>DATASETS SYNC: OK</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
