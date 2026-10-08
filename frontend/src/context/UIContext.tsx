import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isBestieOpen: boolean;
  openBestie: () => void;
  closeBestie: () => void;
  toggleBestie: () => void;
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBestieOpen, setIsBestieOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <UIContext.Provider
      value={{
        isBestieOpen,
        openBestie: () => setIsBestieOpen(true),
        closeBestie: () => setIsBestieOpen(false),
        toggleBestie: () => setIsBestieOpen(prev => !prev),
        activeModal,
        openModal: (name: string) => setActiveModal(name),
        closeModal: () => setActiveModal(null),
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
