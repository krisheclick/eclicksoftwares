"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type contextData = {
    visibleTimeField:boolean | null;
    setVisibleTimeField:(visibleTimeField: boolean) => void;
    fromLoading: boolean | null;
    setFromLoading: (hasLoading: boolean) => void;
    step: number | null;
    setStep: (step: number) => void;
    selectedDate :Date |undefined;
    setSelectedDate: (selectedDate: Date | undefined) => void;
    selectedSlot: string | null;
    setSelectedSlot: (selectedSlot: string | null) => void;
    timezone: string; 
    setTimezone: (timezone: string) => void;
    
}
const context = createContext<contextData | undefined>(undefined);
const detectedTZ =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
export const ScheduleCallProvider = ({children}: {children: ReactNode}) => {
    const [visibleTimeField, setVisibleTimeField] = useState<boolean | null>(false);
    const [fromLoading, setFromLoading] = useState<boolean | null>(null);
    const [step, setStep] = useState<number | null>(1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [timezone, setTimezone] = useState(detectedTZ);

    return (
        <context.Provider value={{
            visibleTimeField,
            setVisibleTimeField,
            fromLoading,
            setFromLoading,
            step, 
            setStep,
            selectedDate,
            setSelectedDate,
            selectedSlot,
            setSelectedSlot,
            timezone, 
            setTimezone
        }}>
            {children}
        </context.Provider>
    );
}

export const useScheduleCallContext = () : contextData => {
    const contextContent = useContext(context);
    if(!contextContent){
        throw new Error("useScheduleCallContext must be used within a ScheduleCallProvider on layout.tsx");
    }

    return contextContent;
}