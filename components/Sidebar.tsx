import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useUser } from '../context/UserContext';
import { CameraIcon, HistoryIcon, TargetIcon, ProfileIcon, GlobeIcon, LogoIcon } from './icons/Icons';

const Sidebar = () => {
  const { t, changeLanguage, language } = useI18n();
  const { user } = useUser();

  const navItems = [
    { path: '/dashboard', label: t('navScan'), icon: CameraIcon },
    { path: '/history', label: t('navHistory'), icon: HistoryIcon },
    { path: '/goals', label: t('navGoals'), icon: TargetIcon },
    { path: '/profile', label: t('navProfile'), icon: ProfileIcon },
  ];

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  const navLinkClasses = 'flex items-center space-x-4 rtl:space-x-reverse px-4 py-3 text-gray-500 rounded-lg hover:bg-brand-light-purple hover:text-brand-purple transition-colors duration-200';
  const activeNavLinkClasses = '!bg-brand-light-purple !text-brand-purple font-bold';

  return (
    <aside className="w-64 bg-white flex-shrink-0 p-6 flex flex-col border-r border-gray-200">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-10">
        <div className="bg-brand-purple p-2 rounded-full">
            <LogoIcon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h1 className="font-bold text-xl text-brand-dark-purple">{t('appName')}</h1>
            <p className="text-xs text-gray-500">{t('appSubtitle')}</p>
        </div>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path} className="mb-2">
              <NavLink
                to={path}
                className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button onClick={handleLanguageToggle} className={`${navLinkClasses} w-full mt-4`}>
            <GlobeIcon className="w-6 h-6" />
            <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

      </nav>

      <div className="mt-auto">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
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
  );
};

export default Sidebar;
