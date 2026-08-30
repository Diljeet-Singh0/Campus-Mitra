import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserRole, UserProfile } from '../../types';
import {
  Sparkles,
  GraduationCap,
  Shield,
  Building2,
  Lock,
  ArrowRight,
  KeyRound,
  Mail,
  UserPlus,
  LogIn,
  Sun,
  Moon,
  CheckCircle2,
  ArrowLeft,
  HeartHandshake
} from 'lucide-react';
import { ThreeBackgroundCanvas } from '../../components/three/ThreeBackgroundCanvas';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginPageProps {
  onSignIn: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string; user?: UserProfile }> | { success: boolean; error?: string; user?: UserProfile };
  onSignUp: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string; user?: UserProfile }> | { success: boolean; error?: string; user?: UserProfile };
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSignIn,
  onSignUp,
  theme,
  onToggleTheme
}) => {
  const navigate = useNavigate();
  
  // Navigation Flow State: 'welcome' -> 'choice' -> 'form'
  const [authStage, setAuthStage] = useState<'welcome' | 'choice' | 'form'>('welcome');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter a valid campus email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'signin') {
        const res = await onSignIn(email.trim(), password, selectedRole);
        if (!res.success) {
          setErrorMsg(res.error || 'Invalid credentials.');
          setLoading(false);
          return;
        }
        if (res.user) {
          navigate(`/${res.user.role}`, { replace: true });
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name to register.');
          setLoading(false);
          return;
        }
        const res = await onSignUp(fullName.trim(), email.trim(), password, selectedRole);
        if (!res.success) {
          setErrorMsg(res.error || 'Account creation failed.');
          setLoading(false);
          return;
        }
        if (res.user) {
          navigate(`/${res.user.role}`, { replace: true });
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const portalInfo: Record<UserRole, { title: string; subtitle: string; icon: any; color: string; badgeColor: string }> = {
    student: {
      title: 'Mann Mitra Student Portal',
      subtitle: 'Talk to MannMitra AI, track daily check-ins & explore support',
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/30'
    },
    counselor: {
      title: 'Campus Pulse Counselor Center',
      subtitle: 'Priority review queue, intervention tracking & analytics',
      icon: Shield,
      color: 'from-teal-600 to-cyan-600',
      badgeColor: 'bg-teal-500/10 text-teal-800 dark:text-teal-400 border-teal-500/30'
    },
    admin: {
      title: 'Campus Pulse Admin Overview',
      subtitle: 'Institutional trend analytics, stress forecasting & governance',
      icon: Building2,
      color: 'from-emerald-700 to-amber-600',
      badgeColor: 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30'
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-4 lg:p-8 relative overflow-hidden">
      <ThreeBackgroundCanvas theme={theme} />
      
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-7xl w-full mx-auto pb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-500 dark:text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Campus Mitra</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-extrabold">
                Student & Campus Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Privacy-First Wellbeing Platform
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleTheme}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800 text-amber-300 hover:bg-slate-800'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </motion.button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto flex-1 flex flex-col justify-center items-center py-6 relative z-10">
        <AnimatePresence mode="wait">
          {/* STAGE 1: WELCOME SCREEN WITH GET STARTED BUTTON */}
          {authStage === 'welcome' && (
            <motion.div
              key="stage-welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto"
            >
              <div className="space-y-4">
                <span className="text-xs px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-extrabold uppercase tracking-wider shadow-xs">
                  AI-Powered Student & Campus Wellbeing Platform
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  Nurturing Minds, Supporting Growth
                </h2>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
                  A confidential, privacy-first ecosystem connecting students with MannMitra AI companion, longitudinal care signals, and human counselor support.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
                <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 w-fit">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">MannMitra Companion</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Non-judgmental, multi-lingual AI space to express your thoughts.</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                  <div className="p-2 rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-400 w-fit">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Counselor Center</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Priority review queue for proactive human counselor support.</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 w-fit">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">DPDP Act Compliant</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">End-to-end encrypted signals with complete consent control.</p>
                </div>
              </div>

              {/* Main CTA Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthStage('choice')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm tracking-wide flex items-center gap-3 shadow-xl shadow-emerald-600/35 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* STAGE 2: CHOICE SCREEN (SIGN IN VS SIGN UP) */}
          {authStage === 'choice' && (
            <motion.div
              key="stage-choice"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center space-y-6 max-w-xl w-full mx-auto"
            >
              <div className="space-y-2">
                <button
                  onClick={() => setAuthStage('welcome')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mx-auto mb-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Welcome
                </button>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  How would you like to continue?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Select an option below to enter your campus portal credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {/* Option 1: Sign In */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMsg('');
                    setAuthStage('form');
                  }}
                  className="glass-panel p-6 rounded-3xl border border-emerald-500/30 hover:border-emerald-500 text-left space-y-4 shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 w-fit">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      Sign In
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Access your existing student, counselor, or admin campus account.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 pt-2">
                    <span>Continue to Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* Option 2: Sign Up */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMsg('');
                    setAuthStage('form');
                  }}
                  className="glass-panel p-6 rounded-3xl border border-teal-500/30 hover:border-teal-500 text-left space-y-4 shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-800 dark:text-teal-300 w-fit">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      Create Account
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Register a new student, counselor, or admin profile with campus email.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-teal-700 dark:text-teal-400 pt-2">
                    <span>Create Profile</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: EXCLUSIVE FORM SCREEN FOR SIGN IN OR CREATE ACCOUNT */}
          {authStage === 'form' && (
            <motion.div
              key={`stage-form-${activeTab}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthStage('choice')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Options
                </button>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  {activeTab === 'signin' ? 'Sign In Mode' : 'Create Account Mode'}
                </span>
              </div>

              {/* Exclusive Mode Header */}
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  {activeTab === 'signin' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {activeTab === 'signin' ? 'Sign In to Campus Portal' : 'Create Campus Profile'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {activeTab === 'signin'
                    ? 'Select your portal role and enter your registered credentials.'
                    : 'Select your target role and fill in your campus registration details.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-300 text-xs text-center font-extrabold leading-relaxed">
                  {errorMsg}
                </div>
              )}

              {/* Portal Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                  Select Portal Target:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['student', 'counselor', 'admin'] as const).map(role => {
                    const info = portalInfo[role];
                    const Icon = info.icon;
                    const isSelected = selectedRole === role;
                    return (
                      <motion.button
                        key={role}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 font-bold'
                            : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] capitalize">{role}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {activeTab === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Aarohi Verma"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs font-medium"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">Campus Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={
                        selectedRole === 'student'
                          ? 'aarohi@campus.edu'
                          : selectedRole === 'counselor'
                          ? 'ananya@campus.edu'
                          : 'dean.mehta@campus.edu'
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs font-medium"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all mt-2"
                >
                  <span>
                    {activeTab === 'signin'
                      ? `Sign In to ${selectedRole.toUpperCase()} Portal`
                      : `Register ${selectedRole.toUpperCase()} Account`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              {/* Mode switch link */}
              <div className="text-center pt-1">
                {activeTab === 'signin' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMsg('');
                    }}
                    className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                  >
                    Don't have an account? Create one here
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMsg('');
                    }}
                    className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                  >
                    Already have an account? Sign in here
                  </button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>End-to-End Encrypted & DPDP Act Compliant Session.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 dark:text-slate-400 font-medium py-4 border-t border-slate-200 dark:border-slate-800/40 relative z-10">
        Campus Mitra Wellbeing & Mental Health Intelligence System • DPDP Act & University Privacy Compliant
      </footer>
    </div>
  );
};
