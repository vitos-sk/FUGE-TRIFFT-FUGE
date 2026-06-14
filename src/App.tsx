import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";
import { AuthProvider } from "@shared/context/AuthContext";
import { ToastProvider } from "@shared/ui/Toast";
import { ConfirmProvider } from "@shared/ui/ConfirmDialog";
import { useAuth } from "@shared/hooks/useAuth";
import { useFCM } from "@shared/hooks/useFCM";
import { Navbar } from "@shared/layout/Navbar";
import { MobileTabBar } from "@shared/layout/MobileTabBar";
import { PageWrapper } from "@shared/layout/PageWrapper";
import { FullPageLoader } from "@shared/ui/Loader";

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const BoardPage = lazy(() => import("./pages/BoardPage/BoardPage"));
const ObjectDetailPage = lazy(() => import("./pages/ObjectDetailPage/ObjectDetailPage"));
const HoursPage = lazy(() => import("./pages/HoursPage/HoursPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage/DashboardPage"));
const ArchivePage = lazy(() => import("./pages/ArchivePage/ArchivePage"));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!firebaseUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firebaseUser, loading, isAdmin } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!firebaseUser) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { uid } = useAuth();
  useFCM(uid);

  return (
    <>
      <Navbar />
      <PageWrapper>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </PageWrapper>
      <MobileTabBar />
    </>
  );
};

const AppRoutes: React.FC = () => {
  const { firebaseUser, loading, initializing } = useAuth();

  if (initializing || loading) return <FullPageLoader />;

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route
          path="/login"
          element={firebaseUser ? <Navigate to="/hours" replace /> : <LoginPage />}
        />
        <Route path="/" element={<Navigate to="/hours" replace />} />
        <Route
          path="/objects"
          element={
            <ProtectedRoute>
              <AppShell>
                <BoardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/objects/:id"
          element={
            <ProtectedRoute>
              <AppShell>
                <ObjectDetailPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hours"
          element={
            <ProtectedRoute>
              <AppShell>
                <HoursPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/users" element={<Navigate to="/" replace />} />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </AdminRoute>
          }
        />
        <Route
          path="/archiv"
          element={
            <AdminRoute>
              <AppShell>
                <ArchivePage />
              </AppShell>
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/hours" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
