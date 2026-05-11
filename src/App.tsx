import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { GlobalStyles } from "./styles/GlobalStyles";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import { ConfirmProvider } from "./components/ui/ConfirmDialog";
import { useAuth } from "./hooks/useAuth";
import { useFCM } from "./hooks/useFCM";
import { Navbar } from "./components/layout/Navbar";
import { MobileTabBar } from "./components/layout/MobileTabBar";
import { PageWrapper } from "./components/layout/PageWrapper";
import { FullPageSpinner, Spinner } from "./components/ui/Spinner";

const LoginPage        = lazy(() => import("./pages/LoginPage"));
const BoardPage        = lazy(() => import("./pages/BoardPage"));
const ObjectDetailPage = lazy(() => import("./pages/ObjectDetailPage"));
const HoursPage        = lazy(() => import("./pages/HoursPage"));
const AdminUsersPage   = lazy(() => import("./pages/AdminUsersPage"));

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
              <AppShell><BoardPage /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/objects/:id"
          element={
            <ProtectedRoute>
              <AppShell><ObjectDetailPage /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hours"
          element={
            <ProtectedRoute>
              <AppShell><HoursPage /></AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AppShell><AdminUsersPage /></AppShell>
            </ProtectedRoute>
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
