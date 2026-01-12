"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type LetsConnectContextData = {
    showLetsConnectModal: boolean;
    setShowLetsConnectModal: (show: boolean) => void;
}

const LetsConnectContext = createContext<LetsConnectContextData | undefined>(undefined);

export const LetsConnectProvider = ({children}: {children: ReactNode}) => {
    const [showLetsConnectModal, setShowLetsConnectModal] = useState(false);

    return (
        <LetsConnectContext.Provider value={{
            showLetsConnectModal,
            setShowLetsConnectModal
        }}>
            {children}
        </LetsConnectContext.Provider>
    );
}

export const useLetsConnectModal = (): LetsConnectContextData => {
    const context = useContext(LetsConnectContext);
    if (!context) {
        throw new Error('useLetsConnectModal must be used within a LetsConnectProvider');
    }
    return context;
}