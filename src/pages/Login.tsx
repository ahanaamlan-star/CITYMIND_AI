import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, Shield, Check, Terminal, ArrowRight, UserCheck, Key, RefreshCw, User } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();

  const [formMode, setFormMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Department of Smart Municipal Planning');
  const [role, setRole] = useState('Chief Urban Intelligence Officer');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [securityCheckPassed, setSecurityCheckPassed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out all credentials.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      setIsLoading(false);
      setSecurityCheckPassed(true);
      
      setTimeout(() => {
        onLoginSuccess();
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      let errMsg = 'Failed to authenticate.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid security credentials.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Malformed email address.';
      } else {
        errMsg = err.message || errMsg;
      }
      setError(errMsg);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please provide all mandatory credentials.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await registerWithEmail(email, password, name, department, role);
      setIsLoading(false);
      setSuccessMessage('Accreditation recorded successfully! A verification code has been transmitted.');
      setTimeout(() => {
        setFormMode('signin');
        setSuccessMessage('');
      }, 3500);
    } catch (err: any) {
      setIsLoading(false);
      let errMsg = 'Failed to create accreditation profile.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already linked to an intelligence profile.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password strength must be robust (at least 6 characters).';
      } else {
        errMsg = err.message || errMsg;
      }
      setError(errMsg);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      setIsLoading(false);
      setSecurityCheckPassed(true);
      
      setTimeout(() => {
        onLoginSuccess();
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google accreditation failed.');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your intelligence account email.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await resetPassword(email);
      setIsLoading(false);
      setSuccessMessage('A password reset link has been dispatched to your email.');
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to dispatch reset keys.');
    }
  };

  const handleQuickBypass = () => {
    setEmail('e.rostova@citymind.gov');
    setPassword('demopass123'); // real valid password format
    setFormMode('signin');
    setError('Bypass active: registering demo credentials. Click Decrypt & Authenticate.');
  };

  return (
    <div className="min-h-screen bg-[#03060f] text-slate-100 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center gap-3 cursor-pointer animate-fade-in" onClick={() => navigate('/')}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <div className="w-full h-full bg-[#050811] rounded-2xl flex items-center justify-center">
            <span className="font-display font-bold text-xl text-brand-cyan">C</span>
          </div>
        </div>
        <h1 className="font-display font-bold text-2xl tracking-wide text-white">
          CityMind <span className="text-brand-cyan">AI</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          SECURE MUNICIPAL ACCESS NODE
        </p>
      </div>

      <div className="w-full max-w-md relative">
        <GlassCard hoverEffect={false} className="border-white/10">
          {securityCheckPassed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Check size={32} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">INTELLIGENCE ACCREDITED</h3>
              <p className="text-xs text-slate-400 font-mono animate-pulse">Initializing quantum city matrices...</p>
            </motion.div>
          ) : (
            <>
              {/* SIGN IN FORM */}
              {formMode === 'signin' && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-display font-bold text-lg text-white">Sign In to Dashboard</h2>
                    <p className="text-xs text-slate-400">Enter your official credentials or authorize via OAuth.</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      {successMessage}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                      Government Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.rostova@citymind.gov"
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input text-white font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                        Administrative Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setFormMode('forgot'); setError(''); setSuccessMessage(''); }}
                        className="text-[10px] text-brand-cyan hover:underline bg-transparent border-none outline-none cursor-pointer"
                      >
                        Reset Keys?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Auth Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-sm font-semibold text-white shadow-lg hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Terminal size={14} className="animate-spin" />
                        <span>Decrypting Matrix...</span>
                      </>
                    ) : (
                      <>
                        <span>Decrypt & Authenticate</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 12.24 1 12.24 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.079-1.32-.174-1.886H12.24z"/>
                    </svg>
                    <span>Authorize with Google Workspace</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setFormMode('signup'); setError(''); setSuccessMessage(''); }}
                      className="text-xs text-slate-400 hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer"
                    >
                      Need custom clearance? <span className="text-brand-cyan font-semibold">Request Access</span>
                    </button>
                  </div>

                  {/* Separator */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                      or quick credentials
                    </span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Quick Enterprise Bypass Button */}
                  <button
                    type="button"
                    onClick={handleQuickBypass}
                    disabled={isLoading}
                    className="w-full py-2 px-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 hover:bg-brand-cyan/10 text-xs font-semibold text-brand-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck size={14} />
                    <span>Autofill Mock Credentials</span>
                  </button>
                </form>
              )}

              {/* SIGN UP FORM */}
              {formMode === 'signup' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-display font-bold text-lg text-white">Create Security Profile</h2>
                    <p className="text-xs text-slate-400">Register administrative credentials for the system.</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                      Clearance Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Elena Rostova"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                      Designation Role
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Chief Urban Intelligence Officer"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                      Government Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.rostova@citymind.gov"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                      Security Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl glass-input text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Registration */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-sm font-semibold text-white shadow-lg hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Generating Secure Keys...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Intelligence clearance</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setFormMode('signin'); setError(''); setSuccessMessage(''); }}
                      className="text-xs text-slate-400 hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer"
                    >
                      Already cleared? <span className="text-brand-cyan font-semibold">Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {formMode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-display font-bold text-lg text-white">Restore Cryptographic Keys</h2>
                    <p className="text-xs text-slate-400">Transmit a secure recovery token directly to your inbox.</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      {successMessage}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 block font-mono uppercase tracking-wider">
                      Government Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.rostova@citymind.gov"
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl glass-input text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Reset */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple text-sm font-semibold text-white shadow-lg hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Transmitting Beacon...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Recovery Token</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setFormMode('signin'); setError(''); setSuccessMessage(''); }}
                      className="text-xs text-slate-400 hover:text-white transition-colors bg-transparent border-none outline-none cursor-pointer"
                    >
                      Remembered credentials? <span className="text-brand-cyan font-semibold">Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-500 text-[10px] font-mono tracking-wide animate-fade-in">
        <Shield size={12} />
        <span>AES-256 ENCRYPTED MUNICIPAL CHANNEL</span>
      </div>
    </div>
  );
};
