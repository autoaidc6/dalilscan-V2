import React, { useState } from 'react';
import { useLog } from '../context/LogContext';
import { motion } from 'framer-motion';
import { Meal } from '../types';
import { useI18n } from '../context/I18nContext';

// FIX: Refactor MealCard to use React.FC to fix typing issue with the 'key' prop.
interface MealCardProps {
    meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
    const { t, language } = useI18n();
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex items-center space-x-4 rtl:space-x-reverse p-4 border border-gray-100">
            {meal.image && <img src={meal.image} alt={meal.name} className="w-24 h-24 object-cover rounded-lg" />}
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-brand-dark-purple">{meal.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{meal.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold text-calorie-progress">{meal.calories.toFixed(0)} {t('kcal')}</span>
                    <span className="text-blue-500">P: {meal.protein.toFixed(1)}g</span>
                    <span className="text-green-500">C: {meal.carbs.toFixed(1)}g</span>
                    <span className="text-orange-500">F: {meal.fat.toFixed(1)}g</span>
                </div>
            </div>
        </div>
    )
}

type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
const getMealType = (timestamp: Date): MealCategory => {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 22) return 'Dinner';
    return 'Snack';
};


const History = () => {
    const { t } = useI18n();
    const { loggedMeals } = useLog();
    const [filter, setFilter] = useState('All');

    const sortedMeals = [...loggedMeals].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const filteredMeals = sortedMeals.filter(meal => {
        if (filter === 'All') return true;
        return getMealType(meal.timestamp) === filter;
    });

    const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
            <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('historyTitle')}</h1>
            <p className="text-gray-500 mb-8">{t('historySubtitle')}</p>

            <div className="flex space-x-2 rtl:space-x-reverse mb-6 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                            filter === category
                            ? 'bg-brand-purple text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {t(`history${category}`)}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredMeals.length > 0 ? (
                    filteredMeals.map(meal => <MealCard key={meal.id} meal={meal} />)
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">{t('noHistory')}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default History;