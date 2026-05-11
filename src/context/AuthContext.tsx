import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
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
  const profileUnsubRef = useRef<(() => void) | null>(null);

  const buildFallback = (user: User): AppUser => ({
    uid: user.uid,
    name: user.displayName || user.email || user.uid,
    email: user.email || '',
    role: 'worker',
    disabled: false,
    createdAt: Timestamp.now(),
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // Cancel previous profile subscription when auth state changes
      profileUnsubRef.current?.();
      profileUnsubRef.current = null;

      setFirebaseUser(user);

      if (!user) {
        setAppUser(null);
        setLoading(false);
        return;
      }

      // Subscribe to profile in real-time — detects disabled flag immediately
      const profileUnsub = onSnapshot(
        doc(db, 'users', user.uid),
        (snap) => {
          if (!snap.exists()) {
            setAppUser(buildFallback(user));
            setLoading(false);
            return;
          }

          const profile = { uid: user.uid, ...snap.data() } as AppUser;

          if (profile.disabled) {
            // Account was deactivated — sign out immediately
            signOut(auth);
            return;
          }

          setAppUser(profile);
          setLoading(false);
        },
        () => {
          setAppUser(buildFallback(user));
          setLoading(false);
        }
      );

      profileUnsubRef.current = profileUnsub;
    });

    return () => {
      unsubAuth();
      profileUnsubRef.current?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
