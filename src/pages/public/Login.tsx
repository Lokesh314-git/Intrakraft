import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Lock, Mail, User as UserIcon, Building, LogIn } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { isFirebaseConfigured, auth } from '../../services/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const Login: React.FC = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, setUser, addToast } = useAppStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // ID / Email & Password Submission
  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        if (authMode === 'register') {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const userProfile = {
            uid: firebaseUser.uid,
            name: name || email.split('@')[0] || 'Merchandiser',
            email: firebaseUser.email || email,
            company: company || 'Luxury Merchandising',
            role: 'Merchandising Lead' as const,
            createdAt: new Date().toISOString(),
          };

          setUser(userProfile);
          addToast('Account Created', `Welcome, ${userProfile.name}!`, 'success');
          navigate('/auth/callback');
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const userProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0] || 'Merchandiser',
            email: firebaseUser.email || email,
            company: 'LVMH Merchandising Group',
            role: 'Merchandising Lead' as const,
            createdAt: new Date().toISOString(),
          };
          setUser(userProfile);
          addToast('Signed In', `Welcome back, ${userProfile.name}!`, 'success');
          navigate('/auth/callback');
        }
      } else {
        setUser({
          uid: `usr-${Date.now()}`,
          name: name || email.split('@')[0] || 'Alexander Sterling',
          email,
          company: company || 'LVMH Merchandising Group',
          role: 'Merchandising Lead',
          createdAt: new Date().toISOString(),
        });
        addToast('Signed In', `Welcome back, ${email}`, 'success');
        navigate('/auth/callback');
      }
    } catch (err: any) {
      addToast('Authentication Failed', err.message || 'Check credentials and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Sign In (Passwordless)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setUser({
          uid: result.user.uid,
          name: result.user.displayName || 'Google Merchandiser',
          email: result.user.email || '',
          company: 'LVMH Merchandising Group',
          role: 'Merchandising Lead',
          avatarUrl: result.user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        });
        addToast('Google Sign In', `Welcome, ${result.user.displayName || 'Merchandiser'}!`, 'success');
        navigate('/auth/callback');
      } else {
        setUser({
          uid: `usr-${Date.now()}`,
          name: 'Alexander Sterling',
          email: 'a.sterling@louisvuitton.com',
          company: 'LVMH Merchandising Group',
          role: 'Merchandising Lead',
          createdAt: new Date().toISOString(),
        });
        navigate('/auth/callback');
      }
    } catch (err: any) {
      addToast('Google Sign In Failed', err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxe-bg flex flex-col md:flex-row font-sans">
      {/* Left Editorial Visual Section */}
      <div className="hidden md:flex md:w-1/2 bg-luxe-dark text-luxe-bg p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 filter grayscale contrast-125"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop')` }}
        />
        <div className="relative z-10">
          <span className="font-playfair text-2xl font-bold tracking-widest uppercase text-luxe-bg">
            LUXÉ
          </span>
        </div>

        <div className="relative z-10 max-w-md space-y-3">
          <h2 className="font-playfair text-4xl font-bold leading-tight">
            Precision in every collection.
          </h2>
          <p className="text-xs text-luxe-lightMuted leading-relaxed">
            Enterprise merchandising management, grade-wise size allocation ratios, and catalogue ingestion.
          </p>
        </div>

        <div className="relative z-10 text-[10px] text-luxe-lightMuted tracking-wider uppercase">
          © 2026 LUXÉ Merchandise Console
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 max-w-xl mx-auto w-full">
        <div>
          <div className="flex justify-between items-center mb-10">
            <span className="font-playfair text-2xl font-bold tracking-widest uppercase text-luxe-text">
              LUXÉ
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
                AUTHENTICATION PORTAL
              </span>
              <h1 className="font-playfair text-3xl font-bold text-luxe-text">
                {authMode === 'register' ? 'Create Merchandiser Account' : 'Sign In to Workspace'}
              </h1>
              <p className="text-xs text-luxe-muted">
                {authMode === 'register'
                  ? 'Register your account to manage catalogues and size ratios.'
                  : 'Enter your credentials or use Google OAuth to access your workspace.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-luxe-border gap-6 text-xs font-semibold pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`pb-2 transition-colors uppercase tracking-wider text-[11px] ${authMode === 'signin' ? 'border-b-2 border-luxe-dark text-luxe-text font-bold' : 'text-luxe-muted hover:text-luxe-text'
                  }`}
              >
                ID & Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`pb-2 transition-colors uppercase tracking-wider text-[11px] ${authMode === 'register' ? 'border-b-2 border-luxe-dark text-luxe-text font-bold' : 'text-luxe-muted hover:text-luxe-text'
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Google OAuth Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded font-semibold text-xs border border-luxe-border text-luxe-text bg-luxe-surface hover:bg-luxe-bg transition-colors flex items-center justify-center gap-3 shadow-subtle"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-luxe-border" />
                </div>
                <span className="relative bg-luxe-bg px-3 text-[10px] uppercase font-bold text-luxe-muted tracking-widest">
                  Or {authMode === 'register' ? 'Register Credentials' : 'Sign In With ID'}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-muted mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-3.5 h-3.5 text-luxe-muted absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alexander Sterling"
                        className="w-full bg-luxe-surface border border-luxe-border rounded pl-10 pr-4 py-2.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-muted mb-1.5">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-luxe-muted absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="LVMH / Gucci Merchandising"
                        className="w-full bg-luxe-surface border border-luxe-border rounded pl-10 pr-4 py-2.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-muted mb-1.5">
                  User ID / Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-luxe-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchandiser@louisvuitton.com"
                    className="w-full bg-luxe-surface border border-luxe-border rounded pl-10 pr-4 py-2.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-muted mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-luxe-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-luxe-surface border border-luxe-border rounded pl-10 pr-4 py-2.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded font-semibold text-xs bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>
                  {loading
                    ? 'Authenticating...'
                    : authMode === 'register'
                      ? 'Create Merchandiser Account'
                      : 'Sign In With ID & Password'}
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="flex gap-4 text-[11px] text-luxe-muted pt-8 border-t border-luxe-border">
          <span className="hover:text-luxe-text cursor-pointer">Privacy Policy</span>
          <span className="hover:text-luxe-text cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  );
};
