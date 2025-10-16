
import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { Meal } from '../types';

interface EditMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal | null;
  onSave: (updatedMeal: Meal) => void;
}

const EditMealModal: React.FC<EditMealModalProps> = ({ isOpen, onClose, meal, onSave }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<Partial<Meal>>({});

  useEffect(() => {
    if (meal) {
      setFormData(meal);
    }
  }, [meal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    if (meal) {
      onSave({ ...meal, ...formData });
    }
  };

  if (!isOpen || !meal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="edit-meal-title">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 id="edit-meal-title" className="text-xl font-bold text-brand-dark-purple mb-6 text-center">{t('editMeal')}</h3>
        
        <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('calories')}</label>
              <input type="number" name="calories" value={formData.calories || 0} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('protein')}</label>
              <input type="number" name="protein" value={formData.protein || 0} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('carbs')}</label>
              <input type="number" name="carbs" value={formData.carbs || 0} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fat')}</label>
              <input type="number" name="fat" value={formData.fat || 0} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-brand-purple hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all"
          >
            {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMealModal;