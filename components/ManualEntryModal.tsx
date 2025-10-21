import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { Meal, MealCategory } from '../types';
import { useLog } from '../context/LogContext';
import { useToast } from '../context/ToastContext';

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getMealType = (timestamp: Date): MealCategory => {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 22) return 'Dinner';
    return 'Snack';
};

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const { addMeal } = useLog();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };
    
    modal.addEventListener('keydown', handleKeyDown);
    return () => modal.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const { name, calories, protein, carbs, fat } = formData;
    if (!name || !calories || !protein || !carbs || !fat) {
      showToast(t('errorAllFieldsRequired'), 'error');
      return;
    }
    const mealTimestamp = new Date();
    const newMeal: Meal = {
        type: 'Meal',
        id: mealTimestamp.toISOString(),
        name,
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        timestamp: mealTimestamp,
        mealType: getMealType(mealTimestamp),
    };
    addMeal(newMeal);
    showToast(t('logManuallySuccess'), 'success');
    setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    onClose();
  };
  
  const handleClose = () => {
      setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="manual-entry-title">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 id="manual-entry-title" className="text-xl font-bold text-brand-dark-purple mb-2 text-center">{t('manualEntryTitle')}</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">{t('manualEntrySubtitle')}</p>
        
        <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('foodName')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('calories')}</label>
                <input type="number" name="calories" value={formData.calories} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" placeholder="kcal" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('protein')}</label>
                <input type="number" name="protein" value={formData.protein} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" placeholder="g" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('carbs')}</label>
                <input type="number" name="carbs" value={formData.carbs} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" placeholder="g" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fat')}</label>
                <input type="number" name="fat" value={formData.fat} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple" placeholder="g" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleClose}
            className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-brand-accent hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-subtle-md transition-all"
          >
            {t('logMeal')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;