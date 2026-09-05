import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Building, User as UserIcon, Sparkles, LogIn } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { isFirebaseConfigured, auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser, addToast, addActivityLog } = useAppStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        if (isRegister) {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const userProfile = {
            uid: firebaseUser.uid,
            name: name || 'Merchandiser',
            email: firebaseUser.email || email,
            company: company || 'Luxury Apparel Group',
            role: 'Merchandising Lead' as const,
            createdAt: new Date().toISOString(),
          };

          setUser(userProfile);
          addToast('Account Created', `Welcome to LUXÉ Console, ${userProfile.name}!`, 'success');
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const userProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Merchandiser',
            email: firebaseUser.email || email,
            company: 'Luxury Merchandising',
            role: 'Merchandising Lead' as const,
            createdAt: new Date().toISOString(),
          };
          setUser(userProfile);
          addToast('Signed In', `Welcome back, ${userProfile.name}!`, 'success');
        }
      } else {
        const userProfile = {
          uid: `usr-${Date.now()}`,
          name: name || email.split('@')[0] || 'Apparel Merchandiser',
          email,
          company: company || 'Luxury Apparel Group',
          role: 'Merchandising Lead' as const,
          createdAt: new Date().toISOString(),
        };
        setUser(userProfile);
        addToast('Signed In', `Logged in as ${userProfile.name}`, 'success');
      }

      addActivityLog('Authentication', `User ${email} authenticated successfully`, 'auth');
      onClose();
    } catch (err: any) {
      addToast('Authentication Failed', err.message || 'Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const userProfile = {
          uid: result.user.uid,
          name: result.user.displayName || 'Google Merchandiser',
          email: result.user.email || '',
          company: 'Luxury Retail Group',
          role: 'Buyer' as const,
          avatarUrl: result.user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        setUser(userProfile);
        addToast('Google Sign In', `Welcome, ${userProfile.name}!`, 'success');
      } else {
        setUser({
          uid: `usr-${Date.now()}`,
          name: 'Alexander Sterling',
          email: 'a.sterling@louisvuitton.com',
          company: 'LVMH Merchandising Group',
          role: 'Merchandising Lead',
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (err: any) {
      addToast('Google Sign In Failed', err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxe-dark/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-md bg-luxe-surface border border-luxe-border rounded-lg p-6 sm:p-8 shadow-dropdown overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-luxe-muted hover:text-luxe-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-6">
            <h3 className="font-playfair text-2xl font-bold text-luxe-text tracking-wide">
              {isRegister ? 'Create Account' : 'Sign In to LUXÉ'}
            </h3>
            <p className="text-xs text-luxe-muted mt-1">
              Access catalogues, cart grouping, and size ratio engines
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
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
                      className="w-full bg-luxe-bg border border-luxe-border rounded pl-10 pr-4 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
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
                      className="w-full bg-luxe-bg border border-luxe-border rounded pl-10 pr-4 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-luxe-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchandiser@louisvuitton.com"
                  className="w-full bg-luxe-bg border border-luxe-border rounded pl-10 pr-4 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
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
                  className="w-full bg-luxe-bg border border-luxe-border rounded pl-10 pr-4 py-2 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            </button>
          </form>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-luxe-border"></div>
            </div>
            <span className="relative bg-luxe-surface px-3 text-[10px] uppercase font-bold text-luxe-muted tracking-widest">
              Or OAuth Access
            </span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-semibold border border-luxe-border text-luxe-text hover:bg-luxe-bg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-luxe-muted hover:text-luxe-text transition-colors inline-flex items-center gap-1"
            >
              <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
              <span className="font-semibold underline">
                {isRegister ? 'Sign In' : 'Register Now'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
