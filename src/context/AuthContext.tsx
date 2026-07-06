import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, department?: string, role?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerification: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchOrCreateProfile = async (firebaseUser: User, nameForNewUser?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        // Create new profile in Firestore
        const defaultApiKey = 'cm_live_' + Array.from({ length: 24 }, () => 
          'abcdef0123456789'.charAt(Math.floor(Math.random() * 16))
        ).join('');

        const newProfile: UserProfile = {
          uid: firebaseUser.uid, // Add UID to the profile
          name: nameForNewUser || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous User',
          role: 'Chief Urban Intelligence Officer',
          department: 'Department of Smart Municipal Planning',
          avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
          email: firebaseUser.email || '',
          activeAlerts: [
            'District 4 Power Grid Load Peak',
            'Northbound Express Traffic Bottleneck',
            'Air Quality Index drop in Industrial Zone'
          ],
          apiKey: defaultApiKey,
          createdAt: new Date().toISOString()
        } as any; // Cast as any because of possible extra fields like uid/createdAt

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err: any) {
      console.error('Error fetching or creating user profile:', err);
      setError(err.message || 'Failed to sync user profile.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchOrCreateProfile(currentUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      await fetchOrCreateProfile(auth.currentUser);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
      throw err;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string, department?: string, role?: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Instantly create custom profile for them
      const userRef = doc(db, 'users', userCredential.user.uid);
      const defaultApiKey = 'cm_live_' + Array.from({ length: 24 }, () => 
        'abcdef0123456789'.charAt(Math.floor(Math.random() * 16))
      ).join('');

      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        name: name,
        role: role || 'Chief Urban Intelligence Officer',
        department: department || 'Department of Smart Municipal Planning',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        email: email,
        activeAlerts: [
          'District 4 Power Grid Load Peak',
          'Northbound Express Traffic Bottleneck',
          'Air Quality Index drop in Industrial Zone'
        ],
        apiKey: defaultApiKey,
        createdAt: new Date().toISOString()
      } as any;

      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);
      
      // Try to send verification email
      try {
        await sendEmailVerification(userCredential.user);
      } catch (verificationErr) {
        console.warn('Verification email send failed on registration:', verificationErr);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await fetchOrCreateProfile(userCredential.user);
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out.');
      throw err;
    }
  };

  const sendVerification = async () => {
    setError(null);
    if (!auth.currentUser) throw new Error('No user is currently signed in.');
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email.');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setError(null);
    if (!user) throw new Error('No authenticated user found.');
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        sendVerification,
        resetPassword,
        updateProfile,
        clearError,
        reloadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
