import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '@shared/services/firebase';
import type { AppUser } from '@shared/types';

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  initializing: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  appUser: null,
  loading: true,
  initializing: true,
});

// Optimistic session flag — if user was logged in before, skip the loading spinner
// on return visits (Firebase restores session in ~200ms but we want instant UI)
const SESSION_KEY = 'ftf_uid';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hadSession = !!localStorage.getItem(SESSION_KEY);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(!hadSession);
  const [initializing, setInitializing] = useState(true);
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
      setInitializing(false);
      profileUnsubRef.current?.();
      profileUnsubRef.current = null;

      setFirebaseUser(user);

      if (!user) {
        localStorage.removeItem(SESSION_KEY);
        setAppUser(null);
        setLoading(false);
        return;
      }

      localStorage.setItem(SESSION_KEY, user.uid);

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
    <AuthContext.Provider value={{ firebaseUser, appUser, loading, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
