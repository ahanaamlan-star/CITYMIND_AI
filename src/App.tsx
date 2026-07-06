import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { GlassCard } from './components/GlassCard';
import { Shield, Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react';

// Firebase imports
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

// Page Imports
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AIDecisionAssistant } from './pages/AIDecisionAssistant';
import { InteractiveMap } from './pages/InteractiveMap';
import { Analytics } from './pages/Analytics';
import { Predictions } from './pages/Predictions';
import { Insights } from './pages/Insights';
import { CommunityReports } from './pages/CommunityReports';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

// Shared Mock Data
import {
  initialVitals,
  initialRecommendations,
  initialCommunityReports,
  initialMapNodes
} from './data';
import { CityVital, Recommendation, CommunityReport, MapNode } from './types';


export default function App() {
  const { user, loading, logout, reloadUser, sendVerification } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Verification states
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string>('');

  // Core municipal shared states
  const [vitals, setVitals] = useState<CityVital[]>(initialVitals);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [nodes, setNodes] = useState<MapNode[]>(initialMapNodes);

  // Synchronize reports with Firestore in real-time
  useEffect(() => {
    if (!user) {
      setReports([]);
      return;
    }

    const reportsCol = collection(db, 'reports');
    
    const unsubscribe = onSnapshot(reportsCol, (snapshot) => {
      const fetchedReports: CommunityReport[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedReports.push({
          id: docSnap.id,
          ...data,
          // Calculate userVoted locally
          userVoted: data.voters?.includes(user.uid) || false
        } as CommunityReport);
      });
      
      // Sort reports by reportedAt descending
      fetchedReports.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
      
      if (fetchedReports.length > 0) {
        setReports(fetchedReports);
      } else {
        // Seed initial reports if collection is empty
        const seedReports = async () => {
          try {
            for (const rep of initialCommunityReports) {
              await setDoc(doc(db, 'reports', rep.id), {
                id: rep.id,
                title: rep.title,
                description: rep.description,
                category: rep.category,
                status: rep.status,
                votes: rep.votes,
                location: rep.location,
                latitude: rep.latitude,
                longitude: rep.longitude,
                reportedBy: rep.reportedBy,
                reportedByUid: 'system_seed',
                reportedAt: rep.reportedAt,
                priority: rep.priority,
                voters: []
              });
            }
          } catch (err) {
            console.error("Seeding failed: ", err);
          }
        };
        seedReports();
      }
    }, (error) => {
      console.error("onSnapshot error: ", error);
      try {
        handleFirestoreError(error, OperationType.GET, 'reports');
      } catch (err) {
        // Silently swallow after logging so app doesn't crash on boot if offline/unauthorized
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Check if email needs verification (only for password provider accounts)
  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');
  const needsVerification = user && !user.emailVerified && !isGoogleUser;

  const handleResendVerification = async () => {
    setVerifyError('');
    try {
      await sendVerification();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to resend verification email.');
    }
  };

  const handleCheckVerification = async () => {
    setVerifyError('');
    setIsRefreshing(true);
    try {
      await reloadUser();
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to verify email status.');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple p-[1px] flex items-center justify-center animate-spin">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <span className="font-display font-bold text-xl text-brand-cyan">C</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase animate-pulse">
            Establishing Secure Connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
        {user ? (
          needsVerification ? (
            <div className="min-h-screen w-full bg-[#03060f] text-slate-100 flex flex-col justify-center items-center px-6 relative overflow-hidden">
              {/* Dynamic Background Gradients */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

              <div className="mb-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <div className="w-full h-full bg-[#050811] rounded-2xl flex items-center justify-center">
                    <span className="font-display font-bold text-xl text-brand-cyan">C</span>
                  </div>
                </div>
                <h1 className="font-display font-bold text-2xl tracking-wide text-white">
                  Verification Required
                </h1>
                <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                  SECURITY AND ACCREDITATION NODE
                </p>
              </div>

              <div className="w-full max-w-md relative">
                <GlassCard hoverEffect={false} className="border-white/10 space-y-5">
                  <div className="space-y-1.5 text-center">
                    <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mx-auto mb-3">
                      <Mail size={22} />
                    </div>
                    <h2 className="font-display font-bold text-base text-white">Verify Your Email Address</h2>
                    <p className="text-xs text-slate-400 leading-normal">
                      An official verification link has been sent to <span className="text-brand-cyan font-mono font-bold">{user.email}</span>. Please verify your email to unlock the CityMind Administrative Console.
                    </p>
                  </div>

                  {verifyError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                      {verifyError}
                    </div>
                  )}

                  {verificationSent && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-2">
                      <CheckCircle size={14} />
                      <span>New verification link transmitted.</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <button
                      onClick={handleCheckVerification}
                      disabled={isRefreshing}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-xs font-semibold text-white shadow-lg hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                      <span>Check Verification Status</span>
                    </button>

                    <button
                      onClick={handleResendVerification}
                      className="w-full py-2 px-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 hover:bg-brand-cyan/10 text-xs font-semibold text-brand-cyan transition-all flex items-center justify-center gap-2"
                    >
                      <Mail size={13} />
                      <span>Resend Verification Link</span>
                    </button>

                    <button
                      onClick={() => logout()}
                      className="w-full py-2 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-semibold text-rose-400 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={13} />
                      <span>Logout Account</span>
                    </button>
                  </div>
                </GlassCard>
              </div>

              <div className="mt-8 flex items-center gap-2 text-slate-500 text-[10px] font-mono tracking-wide">
                <Shield size={12} />
                <span>AES-256 ENCRYPTED MUNICIPAL CHANNEL</span>
              </div>
            </div>
          ) : (
            <div className="flex w-full min-h-screen relative">
              {/* Sidebar Navigation */}
              <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                onLogout={() => logout()}
              />

              {/* Main Application Window */}
              <div
                className={`flex-grow flex flex-col min-w-0 transition-all duration-300 min-h-screen ${
                  sidebarCollapsed ? 'pl-20' : 'pl-64'
                }`}
              >
                <Navbar />

                {/* Dynamic Pages viewport with animation */}
                <main className="flex-grow p-6 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route
                        path="/dashboard"
                        element={
                          <Dashboard
                            vitals={vitals}
                            setVitals={setVitals}
                            recommendations={recommendations}
                            setRecommendations={setRecommendations}
                          />
                        }
                      />
                       <Route
                        path="/assistant"
                        element={<AIDecisionAssistant vitals={vitals} reports={reports} nodes={nodes} />}
                      />
                      <Route
                        path="/map"
                        element={<InteractiveMap nodes={nodes} setNodes={setNodes} />}
                      />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/predictions" element={<Predictions />} />
                      <Route
                        path="/insights"
                        element={
                          <Insights
                            recommendations={recommendations}
                            setRecommendations={setRecommendations}
                          />
                        }
                      />
                      <Route
                        path="/community"
                        element={<CommunityReports reports={reports} setReports={setReports} />}
                      />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Fallback to Dashboard if authenticated */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>
            </div>
          )
        ) : (
          <div className="w-full min-h-screen">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
              {/* Force redirect to landing page if unauthenticated */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

