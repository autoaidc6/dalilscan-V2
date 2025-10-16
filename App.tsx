import React, { useEffect, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import History from './pages/History';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import { UserProvider } from './context/UserContext';
import { LogProvider } from './context/LogContext';
import { I18nProvider, useI18n } from './context/I18nContext';

const AppContent = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/';

    return (
        <div className="flex min-h-screen bg-white">
            {showSidebar && <Sidebar />}
            <div className="flex-1 overflow-y-auto">
                 <main className="relative">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Onboarding />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/scan" element={<Scan />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/goals" element={<Goals />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};


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
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-gray-100">Loading...</div>}>
      <I18nProvider>
        <UserProvider>
          <LogProvider>
              <HashRouter>
                  <LanguageEffect />
                  <AppContent />
              </HashRouter>
          </LogProvider>
        </UserProvider>
      </I18nProvider>
    </Suspense>
  );
};

export default App;