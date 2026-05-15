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
import { FullPageSpinner, Spinner } from "@shared/ui/Spinner";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const BoardPage = lazy(() => import("./pages/BoardPage"));
const ObjectDetailPage = lazy(() => import("./pages/ObjectDetailPage"));
const HoursPage = lazy(() => import("./pages/HoursPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ArchivePage = lazy(() => import("./pages/ArchivePage"));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firebaseUser, loading } = useAuth();
  if (loading)
    return (
      <FullPageSpinner>
        <Spinner size={32} />
      </FullPageSpinner>
    );
  if (!firebaseUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firebaseUser, loading, isAdmin } = useAuth();
  if (loading)
    return (
      <FullPageSpinner>
        <Spinner size={32} />
      </FullPageSpinner>
    );
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
        <Suspense
          fallback={
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
              <Spinner size={32} />
            </div>
          }
        >
          {children}
        </Suspense>
      </PageWrapper>
      <MobileTabBar />
    </>
  );
};

const AppRoutes: React.FC = () => {
  const { firebaseUser, loading } = useAuth();

  if (loading)
    return (
      <FullPageSpinner>
        <Spinner size={32} />
      </FullPageSpinner>
    );

  return (
    <Suspense
      fallback={
        <FullPageSpinner>
          <Spinner size={32} />
        </FullPageSpinner>
      }
    >
      <Routes>
        <Route
          path="/login"
          element={firebaseUser ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
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
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AppShell>
                <AdminUsersPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
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
        <Route path="*" element={<Navigate to="/" replace />} />
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
