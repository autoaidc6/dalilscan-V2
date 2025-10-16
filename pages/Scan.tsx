import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { useLog } from '../context/LogContext';
import { Meal, MealCategory } from '../types';
import { useI18n } from '../context/I18nContext';
import { useToast } from '../context/ToastContext';
import { CameraIcon } from '../components/icons/Icons';

const getMealType = (timestamp: Date): MealCategory => {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 22) return 'Dinner';
    return 'Snack';
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
    const [cameraError, setCameraError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        try {
            setCameraError(null);
            if (streamRef.current) stopCamera();
            
            const constraints: MediaStreamConstraints = {
                video: { facingMode: 'environment' }
            };

            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (err) {
                console.warn("Could not get environment camera, trying default", err);
                // Fallback to any camera
                const fallbackConstraints: MediaStreamConstraints = { video: true };
                stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
            }
      
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (err) {
            console.error("Error accessing camera: ", err);
            if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
                setCameraError(t('errorCameraPermissionDenied'));
            } else {
                setCameraError(t('errorCameraGeneric'));
            }
        }
    }, [stopCamera, t]);

    useEffect(() => {
        if (location.state && location.state.imageSrc) {
            setImageSrc(location.state.imageSrc);
        } else {
            startCamera();
        }
        return () => stopCamera();
    }, [location.state, startCamera, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setImageSrc(dataUrl);
                stopCamera();
            }
        }
    };
    
    const handleRetake = () => {
        setAnalysisResult(null);
        setImageSrc(null);
        startCamera();
    };

    const dataUrlToGenerativePart = (dataUrl: string) => {
        const base64EncodedData = dataUrl.split(',')[1];
        const mimeType = dataUrl.split(';')[0].split(':')[1];
        return {
            inlineData: { data: base64EncodedData, mimeType },
        };
    }

    const analyzeImage = async () => {
        if (!imageSrc) {
            showToast(t('errorNoImage'), 'error');
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const imagePart = dataUrlToGenerativePart(imageSrc);

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: {
                    parts: [
                        { text: "Analyze the food item in this image. Provide its name, and estimated nutritional information (calories, protein, carbs, fat) in grams for a single serving. Your response MUST be in JSON." },
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
            const mealTimestamp = new Date();

            const mealData: Meal = {
                type: 'Meal',
                id: new Date().toISOString(),
                name: parsedResult.name,
                calories: parsedResult.calories,
                protein: parsedResult.protein,
                carbs: parsedResult.carbs,
                fat: parsedResult.fat,
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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
            <h1 className="text-4xl font-bold text-brand-dark-purple mb-2">{t('scanTitle')}</h1>
            <p className="text-gray-500 mb-8">{t('scanSubtitle')}</p>

            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                <div className="w-full max-w-lg h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-900 text-white overflow-hidden">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Meal to analyze" className="h-full w-full object-cover" loading="lazy" />
                    ) : cameraError ? (
                        <div className="text-center p-4">
                            <CameraIcon className="w-16 h-16 mx-auto text-red-400 opacity-50 mb-4" />
                            <p className="font-bold text-red-400">{t('errorCameraTitle')}</p>
                            <p className="text-sm text-gray-300 mt-2 max-w-xs mx-auto">{cameraError}</p>
                        </div>
                    ) : (
                        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    )}
                </div>

                <div className="w-full max-w-lg">
                     {analysisResult ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full text-left rtl:text-right"
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
                                    onClick={handleRetake}
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
                        </motion.div>
                    ) : imageSrc ? (
                         <div className="flex gap-4">
                            <button
                                onClick={handleRetake}
                                className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('retake')}
                            </button>
                            <button
                                onClick={analyzeImage}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('analyzing') : t('analyzeMeal')}
                            </button>
                        </div>
                    ) : (
                         <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleCapture}
                                disabled={!!cameraError}
                                className="w-full bg-gradient-to-r from-brand-purple to-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('capture')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Scan;