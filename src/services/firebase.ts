import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { UserProfile } from '../types';

// Firebase configuration initialized with live credentials (Auth only)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCU-3wID7KzQ2ffTwK78nKTbfIj_D7nNx8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "student-acf58.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "student-acf58",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "student-acf58.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "280942266260",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:280942266260:web:9d6fd2f5581c8aac8bf181",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RJZ5S4R63P"
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialize Firebase App singleton safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export const auth = getAuth(app);

const USER_SESSION_KEY = 'luxe_active_user_session';

export const getSavedActiveUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveActiveUser = (user: UserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

// Real-time Firebase Auth listener saving active user session to localStorage
export const initFirebaseAuthListener = (onUserChanged: (user: UserProfile | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const activeUser: UserProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Apparel Merchandiser',
        email: firebaseUser.email || '',
        company: 'LUXE Merchandise Group',
        role: 'Merchandising Lead',
        avatarUrl: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };

      saveActiveUser(activeUser);
      onUserChanged(activeUser);
    } else {
      const savedUser = getSavedActiveUser();
      if (!savedUser) {
        onUserChanged(null);
      }
    }
  });
};

export const INITIAL_USER_PROFILE: UserProfile = {
  uid: 'usr-active-001',
  name: 'Alexander Sterling',
  email: 'a.sterling@louisvuitton.com',
  company: 'LVMH Merchandising Group',
  role: 'Merchandising Lead',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  createdAt: new Date().toISOString()
};
