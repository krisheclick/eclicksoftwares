"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import type { WebsiteEnquiryPrefill } from "@/utils/chatbot/websiteEnquiry";

type ThemeData = {
    chatEnquirySubmitted: number;
    setChatEnquirySubmitted: (value: number) => void;
    enquiryPrefill: WebsiteEnquiryPrefill | null;
    setEnquiryPrefill: (value: WebsiteEnquiryPrefill | null) => void;
    headerExtraClass: string | null;
    setHeaderExtraClass: (headerExtraClass: string | null) => void;

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

    selectedService: string;
    setSelectedService: (selectedService: string) => void;

    selectedUsp: string | "";
    setSelectedUsp: (selectedUsp: string | "") => void;

    commonBanner: string | null;
    setCommonBanner: (commonBanner: string | null) => void;
};

export const ThemeContext = createContext<ThemeData | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [chatEnquirySubmitted, setChatEnquirySubmitted] = useState(0);
    const [enquiryPrefill, setEnquiryPrefill] =
        useState<WebsiteEnquiryPrefill | null>(null);
    const [headerExtraClass, setHeaderExtraClass] = useState<string | null>(
        null,
    );

    // Modal states
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [clickFrom, setClickFrom] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState("");
    const [showLetsConnectModal, setShowLetsConnectModal] = useState(false);
    const [showHireModal, setShowHireModal] = useState(false);
    const [showReferModal, setShowReferModal] = useState(false);
    const [selectedUsp, setSelectedUsp] = useState("");

    // Common Banner
    const [commonBanner, setCommonBanner] = useState<string | null>(null);

    return (
        <ThemeContext.Provider
            value={{
                chatEnquirySubmitted,
                setChatEnquirySubmitted,
                enquiryPrefill,
                setEnquiryPrefill,
                headerExtraClass,
                setHeaderExtraClass,
                showScheduleModal,
                setShowScheduleModal,
                clickFrom,
                setClickFrom,
                selectedService,
                setSelectedService,
                showLetsConnectModal,
                setShowLetsConnectModal,
                showHireModal,
                setShowHireModal,
                showReferModal,
                setShowReferModal,
                selectedUsp,
                setSelectedUsp,
                commonBanner,
                setCommonBanner,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = (): ThemeData => {
    const useThemeContext = useContext(ThemeContext);
    if (!useThemeContext) {
        throw new Error(
            "ThemeProvider must be use on layout.tsx children wrapper",
        );
    }
    return useThemeContext;
};
