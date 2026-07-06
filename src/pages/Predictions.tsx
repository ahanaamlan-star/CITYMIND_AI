import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  HelpCircle,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { ScenarioParam, PredictionMetric } from '../types';
import { initialScenarioParams } from '../data';

export const Predictions: React.FC = () => {
  const [params, setParams] = useState<ScenarioParam[]>(initialScenarioParams);
  const [projectionData, setProjectionData] = useState<PredictionMetric[]>([]);
  const [activeCurve, setActiveCurve] = useState<keyof Omit<PredictionMetric, 'year'>>('carbonEmission');

  // Dynamically compute projection curves based on slider coefficients
  useEffect(() => {
    const transitSubsidy = params.find(p => p.id === 'p_transit')?.value || 15;
    const carbonPricing = params.find(p => p.id === 'p_carbon')?.value || 8;
    const solarRebate = params.find(p => p.id === 'p_solar')?.value || 30;
    const evBudget = params.find(p => p.id === 'p_ev')?.value || 4.5;

    // Linear progression simulating standard urban coefficients
    const computedProjections: PredictionMetric[] = [];
    
    for (let year = 2026; year <= 2036; year += 2) {
      const index = (year - 2026) / 2;
      
      // Coefficients
      const carbonCoef = Math.max(10, 100 - (transitSubsidy * 0.4) - (carbonPricing * 1.5) - (solarRebate * 0.3) - (evBudget * 2.0) - (index * 4));
      const congestionCoef = Math.max(5, 80 - (transitSubsidy * 0.5) - (carbonPricing * 1.8) - (index * 2));
      const gridLoadCoef = Math.max(20, 60 + (index * 5) - (solarRebate * 0.5) + (evBudget * 1.5));
      const livabilityCoef = Math.min(100, 50 + (transitSubsidy * 0.3) + (solarRebate * 0.2) + (evBudget * 1.0) - (congestionCoef * 0.2) + (index * 1.5));
      const deficitCoef = Math.max(-50, (transitSubsidy * 0.8) + (solarRebate * 0.4) + (evBudget * 1.5) - (carbonPricing * 1.2));

      computedProjections.push({
        year,
        carbonEmission: parseFloat(carbonCoef.toFixed(1)),
        congestionRate: parseFloat(congestionCoef.toFixed(1)),
        energyGridLoad: parseFloat(gridLoadCoef.toFixed(1)),
        livabilityIndex: parseFloat(livabilityCoef.toFixed(1)),
        budgetDeficit: parseFloat(deficitCoef.toFixed(1))
      });
    }

    setProjectionData(computedProjections);
  }, [params]);

  const handleSliderChange = (id: string, newValue: number) => {
    setParams(prev =>
      prev.map(p => (p.id === id ? { ...p, value: newValue } : p))
    );
  };

  const getCurveLabel = (curve: string) => {
    switch (curve) {
      case 'carbonEmission':
        return 'Carbon Emissions (Mt/yr)';
      case 'congestionRate':
        return 'Street Congestion Index (%)';
      case 'energyGridLoad':
        return 'Central Grid Strain (MW)';
      case 'livabilityIndex':
        return 'General Livability Index';
      default:
        return 'Estimated Budget Deficit ($M)';
    }
  };

  const getCurveColor = (curve: string) => {
    switch (curve) {
      case 'carbonEmission':
        return '#06b6d4';
      case 'congestionRate':
        return '#0ea5e9';
      case 'energyGridLoad':
        return '#f59e0b';
      case 'livabilityIndex':
        return '#10b981';
      default:
        return '#8b5cf6';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="font-display font-bold text-xl text-white">Scenario Projections Workbench</h2>
        <p className="text-xs text-slate-400">Calibrate capital allocation weights and pricing policies to model 10-year urban forecasting curves.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Sliders panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <GlassCard className="h-full space-y-6" hoverEffect={false}>
            <div>
              <div className="flex items-center gap-2 text-brand-purple mb-2">
                <SlidersHorizontal size={18} />
                <h3 className="font-display font-bold text-sm text-white">Variable Calibrator</h3>
              </div>
              <p className="text-[11px] text-slate-400">Drag sliders below to change municipal planning budgets and observe dynamic projections.</p>
            </div>

            <div className="space-y-5">
              {params.map(param => (
                <div key={param.id} className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{param.name}</span>
                    <span className="font-mono text-brand-cyan font-bold">
                      {param.value}{param.unit}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={(e) => handleSliderChange(param.id, parseFloat(e.target.value))}
                    className="w-full accent-brand-cyan bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                  />
                  
                  <p className="text-[10px] text-slate-500 leading-normal">{param.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono block">PLANNING ALIGNMENT TARGETS</span>
              <p className="text-[10px] text-slate-400">Optimal equilibrium is reached when carbon emissions stay below 35 Mt/yr while keeping budget deficits beneath $20M.</p>
            </div>
          </GlassCard>
        </div>

        {/* Prediction Charts */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <GlassCard className="h-full flex flex-col justify-between" hoverEffect={false}>
            {/* Header & toggle curves */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-white">10-Year Planning Forecast</h3>
                  <p className="text-xs text-slate-400">Simulating progressive coefficients up to 2036.</p>
                </div>

                <div className="flex items-center gap-2 text-brand-purple text-[11px] font-mono font-bold uppercase tracking-wider bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-1 rounded-full">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>PREDICTION: CONVERGED</span>
                </div>
              </div>

              {/* Curve toggles */}
              <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-white/5">
                {(['carbonEmission', 'congestionRate', 'energyGridLoad', 'livabilityIndex', 'budgetDeficit'] as const).map(curve => (
                  <button
                    key={curve}
                    onClick={() => setActiveCurve(curve)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wide transition-all ${
                      activeCurve === curve
                        ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md'
                        : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {curve.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Projection Recharts Line Chart */}
            <div className="h-72 w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(5, 8, 17, 0.9)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={activeCurve}
                    stroke={getCurveColor(activeCurve)}
                    strokeWidth={3}
                    dot={{ stroke: getCurveColor(activeCurve), strokeWidth: 1.5, r: 4 }}
                    name={getCurveLabel(activeCurve)}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast insight message */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] leading-relaxed text-slate-300 flex items-start gap-2.5">
              <Activity className="text-brand-cyan shrink-0 mt-0.5" size={14} />
              <div>
                <span className="font-semibold text-white">Dynamic AI Projection Insight:</span>{' '}
                Under current configurations, {getCurveLabel(activeCurve).toLowerCase()} is predicted to trend{' '}
                {projectionData[projectionData.length - 1]?.[activeCurve] < projectionData[0]?.[activeCurve] ? 'downward' : 'upward'}{' '}
                by 2036. Align additional energy grid parameters to avoid overcapacity risk.
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
