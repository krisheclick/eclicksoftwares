// Utility hook to easily trigger modals from any component
import { useThemeContext } from "@/context/ThemeContext";

export const useScheduleCall = () => {
    const { showScheduleModal, setShowScheduleModal, setClickFrom, clickFrom, setSelectedService } = useThemeContext();

    const openScheduleModal = (action?: string, serviceSlug?: string) => {
        setShowScheduleModal(true);
        setSelectedService(serviceSlug || '');
        if (action) {
            setClickFrom(action);
        }
    };

    return { openScheduleModal, showScheduleModal, setShowScheduleModal, clickFrom };
};

export const useLetsConnect = () => {
    const { showLetsConnectModal, setShowLetsConnectModal, setClickFrom, clickFrom, setSelectedService } = useThemeContext();

    const openLetsConnectModal = (action?: string, serviceSlug?: string) => {
        setShowLetsConnectModal(true);
        setSelectedService(serviceSlug || '');
        if (action) {
            setClickFrom(action);
        }
    };

    return { openLetsConnectModal, showLetsConnectModal, setShowLetsConnectModal, clickFrom };
};

export const useHireModal = () => {
    const { showHireModal, setShowHireModal, selectedUsp,setSelectedUsp } = useThemeContext();

    const openHireModal = () => {
        setShowHireModal(true);
    };

    const closeHireModal = () => {
        setShowHireModal(false);
    };

    return { openHireModal, closeHireModal, showHireModal, setShowHireModal, selectedUsp, setSelectedUsp };
};
export const useReferModal = () => {
    const { showReferModal, setShowReferModal } = useThemeContext();

    const openReferModal = () => {
        setShowReferModal(true);
    };

    const closeReferModal = () => {
        setShowReferModal(false);
    };

    return { openReferModal, closeReferModal, showReferModal, setShowReferModal };
};
