// Utility hook to easily trigger modals from any component
import { useThemeContext } from "@/context/ThemeContext";

export const useScheduleCall = () => {
    const { showScheduleModal, setShowScheduleModal, setClickFrom, clickFrom } = useThemeContext();

    const openScheduleModal = (action?: string) => {
        setShowScheduleModal(true);
        if (action) {
            setClickFrom(action);
        }
    };

    return { openScheduleModal, showScheduleModal, setShowScheduleModal, clickFrom };
};

export const useLetsConnect = () => {
    const { showLetsConnectModal, setShowLetsConnectModal, setClickFrom, clickFrom } = useThemeContext();

    const openLetsConnectModal = (action?: string) => {
        setShowLetsConnectModal(true);
        if (action) {
            setClickFrom(action);
        }
    };

    return { openLetsConnectModal, showLetsConnectModal, setShowLetsConnectModal, clickFrom };
};

export const useHireModal = () => {
    const { showHireModal, setShowHireModal } = useThemeContext();

    const openHireModal = () => {
        setShowHireModal(true);
    };

    const closeHireModal = () => {
        setShowHireModal(false);
    };

    return { openHireModal, closeHireModal, showHireModal, setShowHireModal };
};