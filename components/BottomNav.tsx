import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, HistoryIcon, ChartBarIcon, ProfileIcon, CameraIcon } from './icons/Icons';
import { useI18n } from '../context/I18nContext';
import { useUI } from '../context/UIContext';

const BottomNav = () => {
  const { t } = useI18n();
  const { openScanModal } = useUI();

  const navItems = [
    { path: '/dashboard', label: t('navDashboard'), icon: HomeIcon },
    { path: '/history', label: t('navHistory'), icon: HistoryIcon },
    { path: 'scan-action', label: t('navScan'), icon: null }, // Placeholder for the central button
    { path: '/insights', label: t('navInsights'), icon: ChartBarIcon },
    { path: '/profile', label: t('navProfile'), icon: ProfileIcon },
  ];
  
  const navLinkClasses = 'flex flex-col items-center justify-center text-gray-500 w-full pt-2 pb-1 transition-colors duration-200 hover:text-brand-purple';
  const activeNavLinkClasses = '!text-brand-purple';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-t-lg z-50">
      <div className="flex justify-around h-full max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }, index) => {
          // Special rendering for the central scan button
          if (path === 'scan-action') {
            return (
              <div key={path} className="flex-1 flex justify-center items-center">
                 <button 
                    onClick={openScanModal}
                    aria-label={label}
                    className="-mt-8 w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center text-white shadow-subtle-md transform hover:scale-105 transition-transform"
                  >
                   <CameraIcon className="w-8 h-8" />
                 </button>
              </div>
            );
          }
          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard'} // Use 'end' for the dashboard route
              className={({ isActive }) => `${navLinkClasses} flex-1 ${isActive ? activeNavLinkClasses : ''}`}
            >
              {Icon && <Icon className="w-6 h-6 mb-1" />}
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;