import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { CameraIcon } from './icons/Icons';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onCapture }) => {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);


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

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-brand-dark-purple mb-4 text-center">{t('takePicture')}</h3>
        <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-6 bg-gray-900 overflow-hidden text-white p-4">
          {cameraError ? (
             <div className="text-center">
                <CameraIcon className="w-16 h-16 mx-auto text-red-400 opacity-50 mb-4" />
                <p className="font-bold text-red-400">{t('errorCameraTitle')}</p>
                <p className="text-sm text-gray-300 mt-2 max-w-xs mx-auto">{cameraError}</p>
             </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
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
      </div>
    </div>
  );
};

export default ScanModal;