import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t, changeLanguage, language } = useI18n();

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    changeLanguage(lang);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 p-6 text-center"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-emerald-600 dark:text-emerald-400 text-3xl font-bold mb-2"
      >
        🌿 {t('appName')}
      </motion.div>
      <motion.h1 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('onboardingTitle')}</motion.h1>
      <motion.p 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">{t('onboardingSubtitle')}</motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="space-y-4">
          <p className="font-semibold text-gray-700 dark:text-gray-300">{t('selectLanguage')}</p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                language.startsWith('en')
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                language === 'ar'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        <button className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center">
          <svg className="w-6 h-6 mr-3 rtl:ml-3 rtl:mr-0" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20h2v-2h-2v-2h-2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h-2v2h2v2zM24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.522 5.025C14.381 15.317 18.798 12 24 12c3.059 0 5.842.979 8.17 2.639l6.19-5.238C34.86 6.81 29.692 4 24 4 16.227 4 9.505 8.444 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192L24 24 10.591 38.808C14.14 41.977 18.834 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083L24 24 10.591 9.192C14.14 6.023 18.834 4 24 4c5.692 0 10.86 2.81 13.97 7.039l5.64 4.819z" />
          </svg>
          {t('signInWithGoogle')}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          {t('continue')}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Onboarding;