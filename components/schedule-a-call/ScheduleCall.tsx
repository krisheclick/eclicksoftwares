"use client";

import { ScheduleCallProvider } from "@/context/SchuduleACallContext";
import SchuduleCallModal from "./SchuduleCallModal";

interface ScheduleCallProps {
    show: boolean;
    onHide: () => void;
    services?: string[];
}
const ScheduleCall = ({ show, onHide, services }: ScheduleCallProps) => {
    return (
        <ScheduleCallProvider>
            <SchuduleCallModal show={show} onHide={onHide} services={services} />
        </ScheduleCallProvider>
    );
}
export default ScheduleCall;
