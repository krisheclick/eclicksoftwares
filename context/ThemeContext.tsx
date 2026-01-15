"use client"
import { createContext, ReactNode, useContext, useState } from 'react';

type ThemeData = {
    headerExtraClass: string | null,
    setHeaderExtraClass:(headerExtraClass:string | null)=>void;

    // Modal states
    showScheduleModal: boolean;
    setShowScheduleModal: (show: boolean) => void;

    showLetsConnectModal: boolean;
    setShowLetsConnectModal: (show: boolean) => void;

    showHireModal: boolean;
    setShowHireModal: (show: boolean) => void;

    showReferModal: boolean;
    setShowReferModal: (show: boolean) => void;

    clickFrom: string | null;
    setClickFrom: (clickFrom: string | null) => void;

    selectedUsp: string | '';
    setSelectedUsp: (selectedUsp: string | '') => void;
}

export const ThemeContext = createContext<ThemeData | undefined>(undefined);

export const ThemeProvider = ({children} : {children: ReactNode}) => {
    const [headerExtraClass, setHeaderExtraClass] = useState<string| null>(null);

    // Modal states
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [clickFrom, setClickFrom] = useState<string | null>(null);
    const [showLetsConnectModal, setShowLetsConnectModal] = useState(false);
    const [showHireModal, setShowHireModal] = useState(false);
    const [showReferModal, setShowReferModal] = useState(false);
    const [selectedUsp, setSelectedUsp] = useState('');

    return(
        <ThemeContext.Provider value={{
            headerExtraClass,
            setHeaderExtraClass,
            showScheduleModal,
            setShowScheduleModal,
            clickFrom, 
            setClickFrom,
            showLetsConnectModal,
            setShowLetsConnectModal,
            showHireModal,
            setShowHireModal,
            showReferModal,
            setShowReferModal,
            selectedUsp,
            setSelectedUsp
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () : ThemeData => {
    const useThemeContext = useContext(ThemeContext);
    if(!useThemeContext){
        throw new Error("ThemeProvider must be use on layout.tsx children wrapper");
    }
    return useThemeContext;
}