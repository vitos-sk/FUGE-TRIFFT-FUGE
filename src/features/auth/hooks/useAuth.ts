import { useAuthContext } from '@features/auth/context';

export const useAuth = () => {
  const { firebaseUser, appUser, loading, initializing } = useAuthContext();
  return {
    user: appUser,
    firebaseUser,
    loading,
    initializing,
    isAdmin: appUser?.role === 'admin',
    isWorker: appUser?.role === 'worker',
    uid: firebaseUser?.uid ?? null,
  };
};
