"use client";
import { useCallback, useState } from "react";

interface HireModalData {
    name: string;
    email: string;
    phone_no: string;
    company: string;
    usp: string;
    project_description: string;
}

export const useHireModalForm = () => {
    const [showHireModal, setShowHireModal] = useState(false);
    const [prefilledData, setPrefilledData] = useState<Partial<HireModalData>>({});

    const openHireModal = useCallback((data?: Partial<HireModalData>) => {
        if (data) {
            setPrefilledData(data);
        }
        setShowHireModal(true);
    }, []);

    const closeHireModal = useCallback(() => {
        setShowHireModal(false);
        setPrefilledData({});
    }, []);

    return {
        showHireModal,
        openHireModal,
        closeHireModal,
        prefilledData
    };
};
