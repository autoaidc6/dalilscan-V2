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
        
        let stream: MediaStream;
        const environmentConstraints: MediaStreamConstraints = {
            video: { facingMode: { exact: 'environment' } }
        };

        try {
            // First, try to get the rear camera
            stream = await navigator.mediaDevices.getUserMedia(environmentConstraints);
        } catch (err) {
            console.warn("Could not get environment camera, trying default.", err);

            if (err instanceof DOMException && (err.name === 'OverconstrainedError' || err.name === 'NotFoundError' || err.name === 'NotReadableError')) {
                // This is an expected failure on devices without a rear camera or if it's in use.
                // Fallback to any camera.
                const fallbackConstraints: MediaStreamConstraints = { video: true };
                stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
            } else {
                // If the error was something else (like permission denied), re-throw it to be handled by the outer catch.
                throw err;
            }
        }

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;

    } catch (err) {
        console.error("Final error accessing camera: ", err);
        if (err instanceof DOMException) {
            switch (err.name) {
                case 'NotAllowedError':
                case 'PermissionDeniedError':
                    setCameraError(t('errorCameraPermissionDenied'));
                    break;
                case 'NotFoundError':
                case 'DevicesNotFoundError':
                    setCameraError(t('errorCameraNotFound'));
                    break;
                default:
                    setCameraError(t('errorCameraGeneric'));
            }
        } else {
            // For other types of errors, e.g., regular Error object
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="scan-modal-title">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h3 id="scan-modal-title" className="text-xl font-bold text-brand-dark-purple mb-4 text-center">{t('takePicture')}</h3>
        <div className="w-full h-80 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-6 bg-brand-dark-purple overflow-hidden text-white p-4">
          {cameraError ? (
             <div className="text-center">
                <CameraIcon className="w-12 h-12 mx-auto text-red-300 mb-4" />
                <p className="font-bold text-red-300 mb-2">{t('errorCameraTitle')}</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">{cameraError}</p>
             </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-white border border-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleCapture}
            disabled={!!cameraError}
            className="w-full bg-brand-purple text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all disabled:bg-brand-light-purple disabled:text-brand-purple/70 disabled:cursor-not-allowed"
          >
            {t('capture')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanModal;