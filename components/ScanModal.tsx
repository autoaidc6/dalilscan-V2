import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { CameraIcon, XCircleIcon } from './icons/Icons';
import { analyzeFoodImage } from '../services/geminiService';
import type { Meal, MealCategory } from '../types';
import { useLog } from '../context/LogContext';
import { motion } from 'framer-motion';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'camera' | 'loading' | 'result' | 'error';

const getMealType = (timestamp: Date): MealCategory => {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 22) return 'Dinner';
    return 'Snack';
};

const AnalysisSkeleton: React.FC = () => (
    <div className="w-full max-w-lg mt-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md w-3-4 mb-4"></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-full"></div>
            <div className="h-5 bg-gray-200 rounded-md w-full"></div>
            <div className="h-5 bg-gray-200 rounded-md w-full"></div>
            <div className="h-5 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="flex gap-4 mt-6">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
    </div>
);

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const { addMeal } = useLog();
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [view, setView] = useState<ModalView>('camera');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Meal | null>(null);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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

  const resetState = useCallback(() => {
      setView('camera');
      setImageSrc(null);
      setAnalysisResult(null);
      setCameraError(null);
      startCamera();
  }, [startCamera]);

  useEffect(() => {
    if (isOpen) {
      resetState();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, resetState, stopCamera]);

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
            handleClose();
        }
    };
    
    modal.addEventListener('keydown', handleKeyDown);
    return () => modal.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, view]); // Re-run when view changes to trap focus on new buttons

  const handleCapture = async () => {
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
        setView('loading');
        try {
            const result = await analyzeFoodImage(dataUrl);
            const mealTimestamp = new Date();
            const mealData: Meal = {
                ...result,
                type: 'Meal',
                id: mealTimestamp.toISOString(),
                timestamp: mealTimestamp,
                image: dataUrl,
                mealType: getMealType(mealTimestamp),
            };
            setAnalysisResult(mealData);
            setView('result');
        } catch (error) {
            console.error(error);
            setView('error');
        }
      }
    }
  };

  const handleLogMeal = () => {
    if (analysisResult) {
        addMeal(analysisResult);
        onClose();
    }
  };

  const handleClose = () => {
      stopCamera();
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="scan-modal-title">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg flex flex-col items-center">
        <h3 id="scan-modal-title" className="text-xl font-bold text-brand-dark-purple mb-4 text-center">
          {view === 'camera' && t('takePicture')}
          {view === 'loading' && t('analyzing')}
          {view === 'result' && analysisResult?.name}
          {view === 'error' && t('analysisErrorTitle')}
        </h3>

        <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-900 overflow-hidden text-white p-2">
          {view === 'camera' && (cameraError ? (
             <div className="text-center">
                <CameraIcon className="w-16 h-16 mx-auto text-red-400 opacity-50 mb-4" />
                <p className="font-bold text-red-400">{t('errorCameraTitle')}</p>
                <p className="text-sm text-gray-300 mt-2 max-w-xs mx-auto">{cameraError}</p>
             </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          ))}
          {(view === 'loading' || view === 'result' || view === 'error') && imageSrc && (
            <img src={imageSrc} alt="Captured meal" className="h-full w-full object-cover" />
          )}
        </div>
        
        {view === 'camera' && (
             <div className="flex gap-4 w-full">
                <button onClick={handleClose} className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">{t('cancel')}</button>
                <button onClick={handleCapture} disabled={!!cameraError} className="w-full bg-brand-purple text-white font-bold py-3 px-4 rounded-lg shadow-subtle-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">{t('capture')}</button>
            </div>
        )}
        
        {view === 'loading' && <AnalysisSkeleton />}
        
        {view === 'error' && (
            <div className="text-center w-full">
                <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">{t('errorAnalysis')}</p>
                <div className="flex gap-4 w-full">
                    <button onClick={resetState} className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">{t('tryAgain')}</button>
                </div>
            </div>
        )}

        {view === 'result' && analysisResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mt-0 text-left rtl:text-right">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-brand-text mb-6">
                    <p><strong>{t('calories')}:</strong> {analysisResult.calories.toFixed(0)}</p>
                    <p><strong>{t('protein')}:</strong> {analysisResult.protein.toFixed(1)}g</p>
                    <p><strong>{t('carbs')}:</strong> {analysisResult.carbs.toFixed(1)}g</p>
                    <p><strong>{t('fat')}:</strong> {analysisResult.fat.toFixed(1)}g</p>
                </div>
                <div className="flex gap-4">
                     <button onClick={resetState} className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">{t('scanAgain')}</button>
                    <button onClick={handleLogMeal} className="w-full bg-brand-accent hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-subtle-md transition-all">{t('logMeal')}</button>
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanModal;