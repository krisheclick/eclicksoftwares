"use client";

import { ScheduleCallProvider } from "@/context/SchuduleACallContext";
import SchuduleCallModal from "./SchuduleCallModal";

interface ScheduleCallProps {
    show: boolean;
    onHide: () => void;
    services?: string[];
    action?: string | null;
}
const ScheduleCall = ({ show, onHide, services, action }: ScheduleCallProps) => {
    return (
        <ScheduleCallProvider>
            <SchuduleCallModal show={show} onHide={onHide} services={services} action={action} />
        </ScheduleCallProvider>
    );
}
export default ScheduleCall;
