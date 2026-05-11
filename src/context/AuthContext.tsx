import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { getUserProfile } from '../services/authService';
import type { AppUser } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  appUser: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const buildFallback = (user: User): AppUser => ({
    uid: user.uid,
    name: user.displayName || user.email || user.uid,
    email: user.email || '',
    role: 'worker',
    disabled: false,
    createdAt: Timestamp.now(),
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setAppUser(profile ?? buildFallback(user));
        } catch (err) {
          console.error('[AuthContext] getUserProfile failed, using fallback:', err);
          setAppUser(buildFallback(user));
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
