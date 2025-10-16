import React from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { MenuIcon } from './icons/Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { t } = useI18n();
    const location = useLocation();

    // Dynamically gets page title based on the route
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/dashboard')) return t('navDashboard');
        if (path.startsWith('/scan')) return t('navScan');
        if (path.startsWith('/history')) return t('navHistory');
        if (path.startsWith('/goals')) return t('navGoals');
        if (path.startsWith('/insights')) return t('navInsights');
        if (path.startsWith('/profile')) return t('navProfile');
        return t('appName');
    };

    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-30 p-4 border-b border-gray-200 flex items-center justify-between md:hidden">
            <h1 className="text-lg font-bold text-brand-dark-purple">{getPageTitle()}</h1>
            <button onClick={onMenuClick} className="p-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-purple" aria-label="Open menu">
                <MenuIcon className="w-6 h-6" />
            </button>
        </header>
    );
};

export default Header;
