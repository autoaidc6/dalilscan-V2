import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLog } from '../context/LogContext';
import { Meal, MealCategory } from '../types';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { analyzeFoodImage } from '../services/geminiService';

const getMealType = (timestamp: Date): MealCategory => {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 22) return 'Dinner';
    return 'Snack';
};

const AnalysisSkeleton: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="w-full max-w-lg mt-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="h-5 bg-gray-200 rounded-md w-full"></div>
                <div className="h-5 bg-gray-200 rounded-md w-full"></div>
                <div className="h-5 bg-gray-200 rounded-md w-full"></div>
                <div className="h-5 bg-gray-200 rounded-md w-full"></div>
            </div>
            <div className="flex gap-4 mt-6">
                 <button disabled className="w-full bg-gray-200 text-transparent font-bold py-3 px-4 rounded-lg">{t('retake')}</button>
                 <button disabled className="w-full bg-gray-200 text-transparent font-bold py-3 px-4 rounded-lg">{t('logMeal')}</button>
            </div>
        </div>
    );
};

const Scan = () => {
    const { t } = useI18n();
    const { addMeal } = useLog();
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<Meal | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    
    useEffect(() => {
        if (location.state && location.state.imageSrc) {
            setImageSrc(location.state.imageSrc);
        } else {
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    // Automatically analyze the image when the component loads with an image source
    useEffect(() => {
        if (imageSrc) {
            handleAnalyzeImage();
        }
    }, [imageSrc]);

    const handleAnalyzeImage = async () => {
        if (!imageSrc) {
            showToast(t('errorNoImage'), 'error');
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const result = await analyzeFoodImage(imageSrc);
            const mealTimestamp = new Date();
            const mealData: Meal = {
                ...result,
                type: 'Meal',
                id: mealTimestamp.toISOString(),
                timestamp: mealTimestamp,
                image: imageSrc,
                mealType: getMealType(mealTimestamp),
            };
            setAnalysisResult(mealData);
        } catch (e) {
            console.error(e);
            showToast(t('errorAnalysis'), 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogMeal = () => {
        if (analysisResult) {
            addMeal(analysisResult);
            navigate('/dashboard'); 
        }
    };

    const handleUploadAnother = () => {
        navigate('/dashboard');
    }

    if (!imageSrc) {
        return null; // Render nothing while redirecting
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 bg-background min-h-screen">
            <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('scanTitle')}</h1>
            <p className="text-gray-500 mb-8">{t('scanSubtitle')}</p>

            <div className="bg-white rounded-2xl shadow-subtle p-6 flex flex-col items-center">
                <div className="w-full max-w-lg h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-900 text-white overflow-hidden">
                    <img src={imageSrc} alt="Meal to analyze" className="h-full w-full object-cover" loading="lazy" />
                </div>

                {isLoading && <AnalysisSkeleton />}
                
                {analysisResult && !isLoading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-lg mt-6 text-left rtl:text-right"
                    >
                        <h3 className="text-2xl font-bold mb-2 text-brand-dark-purple">{analysisResult.name}</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-brand-text">
                            <p><strong>{t('calories')}:</strong> {analysisResult.calories.toFixed(0)}</p>
                            <p><strong>{t('protein')}:</strong> {analysisResult.protein.toFixed(1)}g</p>
                            <p><strong>{t('carbs')}:</strong> {analysisResult.carbs.toFixed(1)}g</p>
                            <p><strong>{t('fat')}:</strong> {analysisResult.fat.toFixed(1)}g</p>
                        </div>
                        <div className="flex gap-4 mt-6">
                             <button
                                onClick={handleUploadAnother}
                                className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('uploadAnother')}
                            </button>
                            <button
                                onClick={handleLogMeal}
                                className="w-full bg-brand-accent hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-subtle-md transition-all"
                            >
                                {t('logMeal')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Scan;