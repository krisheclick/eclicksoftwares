"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type HireModalContextData = {
    showHireModal: boolean;
    openHireModal: () => void;
    closeHireModal: () => void;
}

const HireModalContext = createContext<HireModalContextData | undefined>(undefined);

export const HireModalProvider = ({ children }: { children: ReactNode }) => {
    const [showHireModal, setShowHireModal] = useState(false);

    const openHireModal = () => setShowHireModal(true);
    const closeHireModal = () => setShowHireModal(false);

    return (
        <HireModalContext.Provider value={{
            showHireModal,
            openHireModal,
            closeHireModal
        }}>
            {children}
        </HireModalContext.Provider>
    );
}

export const useHireModal = (): HireModalContextData => {
    const context = useContext(HireModalContext);
    if (!context) {
        throw new Error('useHireModal must be used within a HireModalProvider');
    }
    return context;
}
