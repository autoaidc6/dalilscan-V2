import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { useLog } from '../context/LogContext';
import { Meal } from '../types';
import { useI18n } from '../context/I18nContext';

const Scan = () => {
    const { t } = useI18n();
    const { addMeal } = useLog();
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<Meal | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    
    useEffect(() => {
        if (location.state && location.state.imageSrc) {
            setImageSrc(location.state.imageSrc);
        } else {
            // If no image is passed, redirect back to dashboard.
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    const dataUrlToGenerativePart = (dataUrl: string) => {
        const base64EncodedData = dataUrl.split(',')[1];
        const mimeType = dataUrl.split(';')[0].split(':')[1];
        return {
            inlineData: { data: base64EncodedData, mimeType },
        };
    }

    const analyzeImage = async () => {
        if (!imageSrc) {
            setError(t('errorNoImage'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const imagePart = dataUrlToGenerativePart(imageSrc);

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: {
                    parts: [
                        { text: "Analyze the food item in this image. Provide its name, and estimated nutritional information (calories, protein, carbs, fat) in grams. Your response MUST be in JSON." },
                        imagePart
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fat: { type: Type.NUMBER },
                        },
                        required: ["name", "calories", "protein", "carbs", "fat"],
                    },
                }
            });
            
            const resultText = response.text;
            const parsedResult = JSON.parse(resultText);

            const mealData: Meal = {
                id: new Date().toISOString(),
                name: parsedResult.name,
                calories: parsedResult.calories,
                protein: parsedResult.protein,
                carbs: parsedResult.carbs,
                fat: parsedResult.fat,
                timestamp: new Date(),
                image: imageSrc,
            };
            setAnalysisResult(mealData);

        } catch (e) {
            console.error(e);
            setError(t('errorAnalysis'));
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

    const handleScanNew = () => {
        navigate('/dashboard');
    }

    if (!imageSrc) {
        return null; // Or a loading spinner while redirecting
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
            <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('scanTitle')}</h1>
            <p className="text-gray-500 mb-8">{t('scanSubtitle')}</p>

            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                <div className="w-full max-w-lg h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-900 text-white overflow-hidden">
                    <img src={imageSrc} alt="Meal to analyze" className="h-full w-full object-cover" />
                </div>

                <div className="w-full max-w-lg">
                    {!analysisResult && (
                        <div className="flex gap-4">
                            <button
                                onClick={handleScanNew}
                                className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={analyzeImage}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('analyzing') : t('analyzeMeal')}
                            </button>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                {analysisResult && (
                    <div className="w-full max-w-lg mt-6 text-left rtl:text-right animate-fade-in">
                        <h3 className="text-2xl font-bold mb-2 text-brand-dark-purple">{analysisResult.name}</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-brand-text">
                            <p><strong>{t('calories')}:</strong> {analysisResult.calories.toFixed(0)}</p>
                            <p><strong>{t('protein')}:</strong> {analysisResult.protein.toFixed(1)}g</p>
                            <p><strong>{t('carbs')}:</strong> {analysisResult.carbs.toFixed(1)}g</p>
                            <p><strong>{t('fat')}:</strong> {analysisResult.fat.toFixed(1)}g</p>
                        </div>
                        <div className="flex gap-4 mt-6">
                             <button
                                onClick={handleScanNew}
                                className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('retake')}
                            </button>
                            <button
                                onClick={handleLogMeal}
                                className="w-full bg-brand-accent hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all"
                            >
                                {t('logMeal')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Scan;