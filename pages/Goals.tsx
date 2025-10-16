import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../context/I18nContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { TargetIcon } from '../components/icons/Icons';

const Goals = () => {
  const { t } = useI18n();
  const { user, updateUser } = useUser();
  const { showToast } = useToast();

  // Local state for form inputs, initialized from user context
  const [goals, setGoals] = useState({
    calorieGoal: user.calorieGoal,
    proteinGoal: user.proteinGoal,
    carbsGoal: user.carbsGoal,
    fatGoal: user.fatGoal,
    waterGoal: user.waterGoal,
    weight: user.weight,
    height: user.height,
    age: user.age,
    activityLevel: user.activityLevel,
  });

  // This effect syncs the local state if the user context changes from another source
  useEffect(() => {
    setGoals({
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatGoal: user.fatGoal,
      waterGoal: user.waterGoal,
      weight: user.weight,
      height: user.height,
      age: user.age,
      activityLevel: user.activityLevel,
    });
  }, [user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGoals(prevGoals => ({
      ...prevGoals,
      // Ensure numeric inputs are stored as numbers
      [name]: e.target.type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    try {
      updateUser(goals);
      showToast(t('goalsSaved'), 'success');
    } catch (error) {
      showToast(t('saveError'), 'error');
      console.error("Failed to save goals:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/50 min-h-screen"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('nutritionGoalsTitle')}</h1>
        <p className="text-gray-500">{t('nutritionGoalsSubtitle')}</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Daily Targets Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-light-purple rounded-full">
                    <TargetIcon className="w-6 h-6 text-brand-purple" />
                </div>
                <h2 className="text-2xl font-bold text-brand-dark-purple">{t('dailyTargets')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dailyCalories')}</label>
                    <input type="number" name="calorieGoal" value={goals.calorieGoal} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dailyProtein')}</label>
                    <input type="number" name="proteinGoal" value={goals.proteinGoal} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dailyCarbs')}</label>
                    <input type="number" name="carbsGoal" value={goals.carbsGoal} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dailyFat')}</label>
                    <input type="number" name="fatGoal" value={goals.fatGoal} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dailyWater')}</label>
                    <input type="number" name="waterGoal" value={goals.waterGoal} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
            </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-brand-dark-purple mb-6">{t('personalInformation')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('weightKg')}</label>
                    <input type="number" name="weight" value={goals.weight} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('heightCm')}</label>
                    <input type="number" name="height" value={goals.height} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                    <input type="number" name="age" value={goals.age} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('activityLevel')}</label>
                    <select
                        name="activityLevel"
                        value={goals.activityLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                        <option value="sedentary">{t('activityLevelSedentary')}</option>
                        <option value="light">{t('activityLevelLight')}</option>
                        <option value="moderate">{t('activityLevelModerate')}</option>
                        <option value="active">{t('activityLevelActive')}</option>
                        <option value="veryActive">{t('activityLevelVeryActive')}</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div className="flex justify-center">
            <button
                onClick={handleSave}
                className="w-full max-w-sm bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
                {t('saveGoals')}
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Goals;
