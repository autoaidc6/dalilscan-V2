import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { CameraIcon, HistoryIcon, TargetIcon, ProfileIcon, GlobeIcon, LogoIcon, ChartBarIcon } from './icons/Icons';

// Simple Logout Icon
const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t, changeLanguage, language } = useI18n();
  const { user } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: t('navScan'), icon: CameraIcon },
    { path: '/history', label: t('navHistory'), icon: HistoryIcon },
    { path: '/goals', label: t('navGoals'), icon: TargetIcon },
    { path: '/insights', label: t('navInsights'), icon: ChartBarIcon },
    { path: '/profile', label: t('navProfile'), icon: ProfileIcon },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // md breakpoint
      onClose();
    }
  };

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
    handleLinkClick();
  };

  const handleLogout = () => {
    handleLinkClick();
    logout();
    navigate('/');
  };

  const navLinkClasses = 'flex items-center space-x-4 rtl:space-x-reverse px-4 py-3 text-gray-500 rounded-lg hover:bg-brand-light-purple hover:text-brand-purple transition-colors duration-200';
  const activeNavLinkClasses = '!bg-brand-light-purple !text-brand-purple font-bold';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col p-6 bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-10">
          <div className="bg-brand-purple p-2 rounded-full">
              <LogoIcon className="w-6 h-6 text-white" />
          </div>
          <div>
              <h1 className="font-bold text-xl text-brand-dark-purple">{t('appName')}</h1>
              <p className="text-xs text-gray-500">{t('appSubtitle')}</p>
          </div>
        </div>

        <nav>
          <ul>
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path} className="mb-2">
                <NavLink
                  to={path}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button onClick={handleLanguageToggle} className={`${navLinkClasses} w-full mb-4`}>
              <GlobeIcon className="w-6 h-6" />
              <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          <button onClick={handleLogout} className={`${navLinkClasses} w-full text-red-500 hover:bg-red-50 hover:text-red-600`}>
              <LogoutIcon className="w-6 h-6" />
              <span className="text-sm font-medium">{t('logout')}</span>
          </button>

          <div className="mt-6 flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold">
              {user.avatarInitial}
            </div>
            <div>
              <p className="text-sm font-bold text-brand-dark-purple">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
