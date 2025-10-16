import React from 'react';
import { NavLink } from 'react-router-dom';
// FIX: Replace missing ScanIcon with CameraIcon and import HomeIcon
import { HomeIcon, CameraIcon, HistoryIcon, ProfileIcon } from './icons/Icons';
import { useI18n } from '../context/I18nContext';

const BottomNav = () => {
  const { t } = useI18n();

  const navItems = [
    { path: '/dashboard', label: t('navDashboard'), icon: HomeIcon },
    // FIX: Use CameraIcon for the scan navigation item
    { path: '/scan', label: t('navScan'), icon: CameraIcon },
    { path: '/history', label: t('navHistory'), icon: HistoryIcon },
    { path: '/profile', label: t('navProfile'), icon: ProfileIcon },
  ];

  const navLinkClasses = 'flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 w-full pt-2 pb-1 transition-colors duration-200';
  const activeNavLinkClasses = '!text-emerald-500 dark:!text-emerald-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-t-lg z-50">
      <div className="flex justify-around h-full max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;