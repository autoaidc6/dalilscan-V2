import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';

const Profile = () => {
    const { t, changeLanguage, language } = useI18n();
    const { user, updateUser } = useUser();
    const [name, setName] = useState(user.name);
    const [goal, setGoal] = useState(user.calorieGoal);
    const [isSaved, setIsSaved] = useState(false);

    const handleLanguageChange = (lang: 'en' | 'ar') => {
        changeLanguage(lang);
    };

    const handleSave = () => {
        updateUser({ name, calorieGoal: goal });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000); // Hide message after 2 seconds
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
            <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('profileTitle')}</h1>
            <p className="text-gray-500 mb-8">{t('profileSubtitle')}</p>

            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto border border-gray-100">
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
                {isSaved && <p className="text-green-500 text-center mt-4">{t('profileSaved')}</p>}

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

            </div>
        </motion.div>
    );
};

export default Profile;