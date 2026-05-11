import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { firebaseUser, appUser, loading } = useAuthContext();
  return {
    user: appUser,
    firebaseUser,
    loading,
    isAdmin: appUser?.role === 'admin',
    isWorker: appUser?.role === 'worker',
    uid: firebaseUser?.uid ?? null,
  };
};
