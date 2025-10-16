import React from 'react';
import { useToast } from '../context/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

// Success Icon
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Error Icon (the 'X' mark)
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Toast = () => {
  const { toasts, hideToast } = useToast();

  const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
        <AnimatePresence>
            {toasts.map(toast => (
                <motion.div
                    key={toast.id}
                    variants={toastVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    className={`flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 border-l-4 ${
                        toast.type === 'success' ? 'border-green-500' : 'border-red-500'
                    }`}
                    role="alert"
                >
                    <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full ${
                        toast.type === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                    }`}>
                        {toast.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
                    </div>
                    <div className="ms-3 text-sm font-normal">{toast.message}</div>
                    <button
                        type="button"
                        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                        aria-label="Close"
                        onClick={() => hideToast(toast.id)}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 13L13 1M1 1l12 12"/>
                        </svg>
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
  );
};

export default Toast;