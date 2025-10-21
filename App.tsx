import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import { UserProvider } from './context/UserContext';
import { LogProvider } from './context/LogContext';
import { I18nProvider, useI18n } from './context/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';
import { UIProvider, useUI } from './context/UIContext';
import ScanModal from './components/ScanModal';
import ManualEntryModal from './components/ManualEntryModal';

// Lazy load page components for better performance
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Scan = lazy(() => import('./pages/Scan'));
const History = lazy(() => import('./pages/History'));
const Goals = lazy(() => import('./pages/Goals'));
const Profile = lazy(() => import('./pages/Profile'));
const Insights = lazy(() => import('./pages/Insights'));

// A component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const AppContent = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { isScanModalOpen, closeScanModal, isManualModalOpen, closeManualModal } = useUI();
    
    const showNavigation = isAuthenticated && location.pathname !== '/';

    return (
        <div className="flex min-h-screen bg-background">
            {showNavigation && (
                <div className="hidden md:block">
                    <Sidebar />
                </div>
            )}
            <div className="flex-1 overflow-y-auto">
                 <main className="relative pb-20 md:pb-0">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Onboarding />} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
                            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
            {showNavigation && (
                <div className="md:hidden">
                    <BottomNav />
                </div>
            )}
            <ScanModal isOpen={isScanModalOpen} onClose={closeScanModal} />
            <ManualEntryModal isOpen={isManualModalOpen} onClose={closeManualModal} />
        </div>
    );
};

// This component handles the side effect of updating the document's language and direction
const LanguageEffect = () => {
  const { language, dir } = useI18n();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return null;
}

const App = () => {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-gray-100 text-lg font-semibold">Loading DalilScan...</div>}>
      <I18nProvider>
        <ToastProvider>
          <UserProvider>
            <LogProvider>
              <AuthProvider>
                <UIProvider>
                  <HashRouter>
                      <LanguageEffect />
                      <AppContent />
                      <Toast />
                  </HashRouter>
                </UIProvider>
              </AuthProvider>
            </LogProvider>
          </UserProvider>
        </ToastProvider>
      </I18nProvider>
    </Suspense>
  );
};

export default App;