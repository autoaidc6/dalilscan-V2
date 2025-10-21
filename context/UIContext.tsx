import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';

interface UIContextType {
  isScanModalOpen: boolean;
  openScanModal: () => void;
  closeScanModal: () => void;
  isManualModalOpen: boolean;
  openManualModal: () => void;
  closeManualModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const openScanModal = useCallback(() => setIsScanModalOpen(true), []);
  const closeScanModal = useCallback(() => setIsScanModalOpen(false), []);
  const openManualModal = useCallback(() => setIsManualModalOpen(true), []);
  const closeManualModal = useCallback(() => setIsManualModalOpen(false), []);

  const value = useMemo(() => ({
    isScanModalOpen, openScanModal, closeScanModal,
    isManualModalOpen, openManualModal, closeManualModal
  }), [isScanModalOpen, isManualModalOpen, openScanModal, closeScanModal, openManualModal, closeManualModal]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
