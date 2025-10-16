import React, { useState, useMemo } from 'react';
import { useLog } from '../context/LogContext';
import { motion } from 'framer-motion';
import { Meal, WaterLog } from '../types';
import { useI18n } from '../context/I18nContext';
import { WaterDropIcon, PencilIcon } from '../components/icons/Icons';
import EditMealModal from '../components/EditMealModal';

interface MealCardProps {
    meal: Meal;
    onEdit: (meal: Meal) => void;
}

const MealCard: React.FC<MealCardProps> = React.memo(({ meal, onEdit }) => {
    const { t, language } = useI18n();
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex items-start space-x-4 rtl:space-x-reverse p-4 border border-gray-100 relative">
            {meal.image && <img src={meal.image} alt={meal.name} className="w-24 h-24 object-cover rounded-lg" loading="lazy" />}
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-brand-dark-purple leading-tight max-w-[80%]">{meal.name}</h3>
                    <span className="text-xs font-semibold bg-brand-light-purple text-brand-purple px-2 py-1 rounded-full whitespace-nowrap">{t(`history${meal.mealType}`)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{meal.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold text-calorie-progress">{meal.calories.toFixed(0)} {t('kcal')}</span>
                    <span className="text-blue-500">P: {meal.protein.toFixed(1)}g</span>
                    <span className="text-green-500">C: {meal.carbs.toFixed(1)}g</span>
                    <span className="text-orange-500">F: {meal.fat.toFixed(1)}g</span>
                </div>
            </div>
             <button onClick={() => onEdit(meal)} aria-label={t('editMeal')} className="absolute top-3 right-3 rtl:left-3 rtl:right-auto text-gray-400 hover:text-brand-purple p-1 rounded-full hover:bg-gray-100 transition-colors">
                <PencilIcon className="w-5 h-5" />
            </button>
        </div>
    )
});

const WaterCard: React.FC<{ log: WaterLog }> = React.memo(({ log }) => {
    const { t, language } = useI18n();
    return (
        <div className="bg-white rounded-xl shadow-sm flex items-center space-x-4 rtl:space-x-reverse p-4 border border-gray-100">
            <div className="w-24 h-24 flex items-center justify-center bg-water-card rounded-lg">
                <WaterDropIcon className="w-12 h-12 text-brand-accent" />
            </div>
            <div className="flex-grow">
                 <h3 className="font-bold text-lg text-brand-dark-purple">{t('waterIntake')}</h3>
                 <p className="text-2xl font-bold text-brand-dark-purple mt-1">{`+${log.amount} ${t('ml')}`}</p>
                 <p className="text-sm text-gray-500 mt-2">{log.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    )
});

const History = () => {
    const { t } = useI18n();
    const { logEntries, updateMeal } = useLog();
    const [filter, setFilter] = useState('All');
    const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);

    const handleEditClick = (meal: Meal) => {
        setMealToEdit(meal);
    };

    const handleCloseModal = () => {
        setMealToEdit(null);
    };

    const handleSaveMeal = (updatedMeal: Meal) => {
        updateMeal(updatedMeal);
        setMealToEdit(null);
    };

    const filteredEntries = useMemo(() => {
        const sorted = [...logEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        if (filter === 'All') return sorted;
        return sorted.filter(entry => {
            if (entry.type === 'Water') return false; // Only show water in 'All' view
            return entry.mealType === filter;
        });
    }, [logEntries, filter]);

    const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];

    return (
        <>
        <EditMealModal
            isOpen={!!mealToEdit}
            onClose={handleCloseModal}
            meal={mealToEdit}
            onSave={handleSaveMeal}
        />
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
                {filteredEntries.length > 0 ? (
                    filteredEntries.map(entry => {
                        if (entry.type === 'Meal') {
                            return <MealCard key={entry.id} meal={entry} onEdit={handleEditClick} />
                        }
                        if (entry.type === 'Water') {
                            return <WaterCard key={entry.id} log={entry} />
                        }
                        return null;
                    })
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">{t('noHistory')}</p>
                    </div>
                )}
            </div>
        </motion.div>
        </>
    );
};

export default History;
