import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ALL_BADGES } from '../gamification/badges';
import * as Icons from '../components/icons/Icons';

const BadgeDisplay = () => {
    const { t } = useI18n();
    const { user } = useUser();
    
    const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = Icons;

    return (
        <div className="mt-8 border-t pt-6 border-gray-200">
             <h2 className="text-xl font-bold text-center text-brand-dark-purple mb-4">{t('myBadges')}</h2>
             <div className="grid grid-cols-3 gap-4 text-center">
                {ALL_BADGES.map(badge => {
                    const hasBadge = user.earnedBadges.includes(badge.id);
                    const IconComponent = iconComponents[badge.icon];
                    return (
                        <div key={badge.id} className="flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${hasBadge ? 'bg-amber-400 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                                {IconComponent && <IconComponent className="w-8 h-8" />}
                            </div>
                            <h3 className={`mt-2 text-sm font-bold ${hasBadge ? 'text-brand-dark-purple' : 'text-gray-500'}`}>{t(badge.nameKey)}</h3>
                            <p className="text-xs text-gray-400">{t(badge.descriptionKey)}</p>
                        </div>
                    );
                })}
             </div>
        </div>
    );
};

const Profile = () => {
    const { t, changeLanguage, language } = useI18n();
    const { user, updateUser } = useUser();
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState(user.name);
    const [goal, setGoal] = useState(user.calorieGoal);

    const handleLanguageChange = (lang: 'en' | 'ar') => {
        changeLanguage(lang);
    };

    const handleSave = () => {
        try {
            updateUser({ name, calorieGoal: goal });
            showToast(t('profileSaved'), 'success');
        } catch (error) {
            showToast(t('saveError'), 'error');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
            <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('profileTitle')}</h1>
            <p className="text-gray-500 mb-8">{t('profileSubtitle')}</p>

            <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto border border-gray-100">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">{t('name')}</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-800"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1 rtl:text-right">{t('calorieGoal')}</label>
                    <input
                        type="number"
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-800"
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="w-full bg-brand-purple hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                    {t('saveChanges')}
                </button>
               
                <div className="mt-8 border-t pt-6 border-gray-200">
                    <p className="font-semibold text-center text-gray-700 mb-4">{t('selectLanguage')}</p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                    <button
                        onClick={() => handleLanguageChange('en')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${
                        language.startsWith('en')
                            ? 'bg-brand-purple text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => handleLanguageChange('ar')}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${
                        language === 'ar'
                            ? 'bg-brand-purple text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        العربية
                    </button>
                    </div>
                </div>

                <BadgeDisplay />

                 <div className="mt-8 border-t pt-6 border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        {t('logout')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;