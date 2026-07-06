import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Send,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Clock,
  Gauge,
  HelpCircle,
  FileText,
  Workflow,
  Sparkle
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CityVital, CommunityReport, MapNode } from '../types';

interface PriorityItem {
  title: string;
  category: string;
  location: string;
  priorityScore: number;
  reason: string;
}

interface RecommendedAction {
  action: string;
  department: string;
  urgency: string;
}

interface AIAnalysisResponse {
  executiveSummary: string;
  keyInsights: string[];
  priorityRanking: PriorityItem[];
  recommendedActions: RecommendedAction[];
  reasoning: string;
  confidenceScore: number;
  expectedCommunityImpact: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  analysis?: AIAnalysisResponse;
  isError?: boolean;
}

interface AIDecisionAssistantProps {
  vitals: CityVital[];
  reports: CommunityReport[];
  nodes: MapNode[];
}

export const AIDecisionAssistant: React.FC<AIDecisionAssistantProps> = ({
  vitals,
  reports,
  nodes,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Greetings. I am the CityMind Decision Intelligence Core, powered by Google Gemini. I have ingested the active municipal feeds, live community incident records, and IoT telemetry. What policy shift, resource allocation, or emergency dispatch scenario would you like to simulate today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      label: 'Immediate Attention Issues',
      prompt: 'Which community issues require immediate attention based on their priority, reports count, and category?',
      icon: <ShieldAlert size={14} className="text-rose-400" />
    },
    {
      label: 'High-Priority Areas Today',
      prompt: 'Which areas or locations in the city should be prioritized for maintenance and inspection today?',
      icon: <AlertTriangle size={14} className="text-amber-400" />
    },
    {
      label: 'Optimal Resource Allocation',
      prompt: 'How should available municipal resources (maintenance crews, water engineers, cleaners) be allocated across active reports?',
      icon: <Cpu size={14} className="text-brand-cyan" />
    },
    {
      label: 'First Responder Department',
      prompt: 'Which department should respond first to the current reported incidents, and what is the dispatch order?',
      icon: <Workflow size={14} className="text-brand-purple" />
    },
    {
      label: "Summarize Critical Incidents",
      prompt: 'Provide an executive summary of today\'s critical incidents and community reports.',
      icon: <FileText size={14} className="text-slate-300" />
    },
    {
      label: 'Anomalies & Issue Patterns',
      prompt: 'Identify any systemic patterns, hotspots, and geographical anomalies from the active community issues.',
      icon: <Activity size={14} className="text-emerald-400" />
    },
  ];

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Loading stages sequence to simulate complex calculation
  useEffect(() => {
    if (!isTyping) {
      setLoadingStage('');
      return;
    }

    const stages = [
      'Ingesting live Firestore community alerts...',
      'Mapping geographical nodes and landmark vectors...',
      'Cross-referencing sensor load levels and city vitals...',
      'Formulating priority matrix via Gemini Core...',
      'Polishing executive synthesis and recommended actions...'
    ];

    let index = 0;
    setLoadingStage(stages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % stages.length;
      setLoadingStage(stages[index]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: text,
          reports,
          vitals,
          nodes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Cognitive query failed.');
      }

      const data: AIAnalysisResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: 'The Decision Core has completed the multi-system impact assessment. Here is your executive brief:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error querying intelligence core:', error);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `Consultation error: ${error.message || 'The request could not be fulfilled. Ensure GEMINI_API_KEY is configured in your Settings > Secrets panel.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputText);
    }
  };

  // Score styling helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'immediate':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'scheduled':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 relative">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2.5">
          <Brain className="text-brand-cyan shrink-0" size={24} />
          <span>Decision Intelligence Assistant</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Grounding advanced Gemini models with real-time community reports, environmental telemetry, and active IoT nodes to drive optimized municipal dispatches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: System Presets and Grounding telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Preset Queries Card */}
          <GlassCard className="p-5 space-y-4" hoverEffect={false}>
            <div className="flex items-center gap-2 text-brand-cyan">
              <Brain size={16} />
              <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">Cognitive Presets</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Execute pre-configured municipal inquiries mapped directly to live report telemetry:
            </p>

            <div className="space-y-2 pt-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset.prompt)}
                  disabled={isTyping}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-brand-purple/20 hover:bg-slate-800/30 transition-all text-xs font-sans font-medium text-slate-300 flex items-center justify-between group disabled:opacity-40 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {preset.icon}
                    <span className="truncate group-hover:text-white">{preset.label}</span>
                  </div>
                  <ArrowRight size={12} className="text-slate-500 group-hover:text-brand-purple group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Active Data Feeds Grounding indicator */}
          <GlassCard className="p-5 space-y-4" hoverEffect={false}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity size={16} />
                <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">Grounded Feeds</h3>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              The Decision Core is grounded directly in live municipal data, optimizing insights as feeds update:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                <p className="text-[10px] font-mono text-slate-500 font-bold">REPORTS</p>
                <p className="text-lg font-bold font-display text-white mt-0.5">{reports.length}</p>
                <p className="text-[8px] text-emerald-400 mt-0.5 font-mono">Real-time</p>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                <p className="text-[10px] font-mono text-slate-500 font-bold">KPI VITALS</p>
                <p className="text-lg font-bold font-display text-white mt-0.5">{vitals.length}</p>
                <p className="text-[8px] text-brand-cyan mt-0.5 font-mono">Under analysis</p>
              </div>

              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                <p className="text-[10px] font-mono text-slate-500 font-bold">IoT NODES</p>
                <p className="text-lg font-bold font-display text-white mt-0.5">{nodes.length}</p>
                <p className="text-[8px] text-brand-purple mt-0.5 font-mono">Active arrays</p>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Conversation stream & UI output */}
        <div className="lg:col-span-8 flex flex-col h-[650px]">
          <GlassCard className="flex-grow flex flex-col justify-between p-0 overflow-hidden" hoverEffect={false}>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-white shadow-lg">
                    <Brain size={18} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">Cognitive Decision Intelligence Node</h4>
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider mt-1 block">ACTIVE DATA GROUNDING ONLINE</span>
                </div>
              </div>
            </div>

            {/* Conversational Stream logs */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => {
                const isAI = msg.sender === 'assistant';
                const isUsr = msg.sender === 'user';

                return (
                  <div key={msg.id} className={`flex ${isUsr ? 'justify-end' : 'justify-start'}`}>
                    <div className={`w-full max-w-2xl rounded-2xl p-5 text-xs leading-relaxed space-y-4 shadow-xl ${
                      isUsr
                        ? 'bg-gradient-to-r from-brand-cyan/15 to-brand-blue/15 border border-brand-cyan/30 text-slate-100 max-w-lg'
                        : msg.isError
                        ? 'bg-rose-950/30 border border-rose-500/20 text-rose-300'
                        : 'bg-slate-900/40 border border-white/5 text-slate-300'
                    }`}>
                      
                      {/* Message author badge & details */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-b border-white/5 pb-2">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
                          {isUsr ? 'EXECUTIVE COMMAND' : 'COGNITIVE BRIEFING'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <p className="font-sans leading-relaxed">{msg.text}</p>

                      {/* Render analysis cards if response is from the AI */}
                      {msg.analysis && (
                        <div className="space-y-5 pt-3 border-t border-white/5">
                          
                          {/* Executive Summary */}
                          <div className="space-y-1 bg-slate-950/60 p-4 rounded-xl border-l-2 border-brand-cyan relative overflow-hidden">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-brand-cyan block">EXECUTIVE BRIEF</span>
                            <p className="text-xs text-slate-200 leading-relaxed italic">
                              "{msg.analysis.executiveSummary}"
                            </p>
                          </div>

                          {/* Key Insights Grid */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-brand-purple flex items-center gap-1">
                              <Sparkle size={12} /> KEY INSIGHTS & PATTERNS:
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {msg.analysis.keyInsights.map((insight, index) => (
                                <div key={index} className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex gap-2">
                                  <span className="text-brand-purple shrink-0 mt-0.5">•</span>
                                  <span className="text-[11px] text-slate-300 leading-normal">{insight}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Priority Ranking */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 flex items-center gap-1">
                              <AlertTriangle size={12} /> CRITICAL PRIORITY RANKING:
                            </span>
                            <div className="space-y-2">
                              {msg.analysis.priorityRanking.map((item, index) => (
                                <div key={index} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                  <div className="space-y-1 max-w-md">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-400 font-mono">0{index + 1}</span>
                                      <h5 className="font-bold text-white text-xs">{item.title}</h5>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono">
                                      {item.category} • {item.location}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                                      {item.reason}
                                    </p>
                                  </div>
                                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg border text-center shrink-0 ${getScoreColor(item.priorityScore)}`}>
                                    PRIORITY SCORE: {item.priorityScore}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Actions */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-brand-cyan flex items-center gap-1">
                              <CheckCircle2 size={12} /> RECOMMENDED IMMEDIATE ACTIONS:
                            </span>
                            <div className="overflow-hidden border border-white/5 rounded-xl bg-slate-950/40">
                              <table className="w-full text-left text-[11px] border-collapse">
                                <thead>
                                  <tr className="bg-slate-950/80 text-[9px] font-mono text-slate-500 uppercase font-bold border-b border-white/5">
                                    <th className="p-3">Action Plan</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3 text-right">Urgency</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {msg.analysis.recommendedActions.map((act, index) => (
                                    <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-slate-900/20">
                                      <td className="p-3 text-slate-200 font-semibold">{act.action}</td>
                                      <td className="p-3 text-slate-400 font-mono">{act.department}</td>
                                      <td className="p-3 text-right">
                                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getUrgencyColor(act.urgency)}`}>
                                          {act.urgency}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Tech Reasoning */}
                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 block">SYSTEM DEPENDENCY REASONING:</span>
                            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-white/5">
                              {msg.analysis.reasoning}
                            </p>
                          </div>

                          {/* Expected Community Impact & Confidence */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 block">EXPECTED PUBLIC IMPACT:</span>
                              <p className="text-[11px] text-slate-400 leading-normal">{msg.analysis.expectedCommunityImpact}</p>
                            </div>

                            <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                                <span className="flex items-center gap-1.5"><Gauge size={12} className="text-brand-cyan" /> CONFIDENCE SCORE</span>
                                <span className="text-white font-bold">{msg.analysis.confidenceScore}%</span>
                              </div>
                              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className="bg-gradient-to-r from-brand-cyan to-brand-purple h-full transition-all duration-1000" 
                                  style={{ width: `${msg.analysis.confidenceScore}%` }}
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

              {/* Typing simulation view */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 text-xs text-slate-400 flex flex-col gap-3 max-w-md shadow-xl">
                    <div className="flex items-center gap-3">
                      <Brain className="text-brand-purple animate-spin" size={16} />
                      <span className="font-mono text-[10px] text-slate-300 font-bold uppercase tracking-widest animate-pulse">Decision Core Processing</span>
                    </div>
                    {loadingStage && (
                      <p className="text-[10px] text-slate-500 font-mono animate-pulse border-l border-brand-purple/40 pl-2">
                        {loadingStage}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input block */}
            <div className="p-4 border-t border-white/5 bg-slate-900/10 flex gap-3 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                placeholder="Ask the Decision Core to prioritize areas, allocate crews, or summarize hazard data..."
                className="flex-grow bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-cyan/40 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={isTyping || !inputText.trim()}
                className="p-3.5 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-115 disabled:opacity-40 rounded-xl text-white transition-all shadow-lg cursor-pointer shrink-0"
                title="Send Instruction to Core"
              >
                <Send size={15} />
              </button>
            </div>

          </GlassCard>
        </div>

      </div>
    </div>
  );
};
