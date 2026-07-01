import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '@shared/services/firebase';
import type { AppUser, UserRole } from '@shared/types';

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as AppUser;
};

// Creates a new user WITHOUT signing out the current admin.
// Firebase's createUserWithEmailAndPassword changes the auth session to the new user,
// so we use a secondary app instance to avoid this.
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<string> => {
  const secondaryApp = initializeApp(firebaseConfig, `create-user-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = cred.user.uid;

    try {
      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        role,
        createdAt: Timestamp.now(),
        disabled: false,
      });
    } catch (firestoreError) {
      // Firestore failed — roll back the Auth account to avoid an orphaned user.
      await cred.user.delete().catch(() => {});
      throw firestoreError;
    }

    return uid;
  } finally {
    await signOut(secondaryAuth).catch(() => {});
    await deleteApp(secondaryApp).catch(() => {});
  }
};

export const getAllUsers = async (): Promise<AppUser[]> => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser));
};

// Creates (or overwrites) the Firestore profile document for an existing Firebase Auth user.
// Used to repair accounts where the Firestore doc was never created.
export const repairUserProfile = async (
  uid: string,
  name: string,
  email: string,
  role: UserRole
): Promise<void> => {
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    role,
    createdAt: Timestamp.now(),
    disabled: false,
  });
};

export const updateUserName = async (uid: string, name: string): Promise<void> =>
  updateDoc(doc(db, 'users', uid), { name });

export const toggleUserDisabled = async (uid: string, disabled: boolean) =>
  updateDoc(doc(db, 'users', uid), { disabled });

export const updateFCMToken = async (uid: string, token: string) =>
  updateDoc(doc(db, 'users', uid), { fcmToken: token });

export const sendPasswordReset = (email: string) =>
  sendPasswordResetEmail(auth, email);

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Kein Benutzer eingeloggt');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};
