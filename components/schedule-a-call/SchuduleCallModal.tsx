"use client";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import { useScheduleCallContext } from "@/context/SchuduleACallContext";
import DateTimePicker from "./DateTimePicker";
import DetailsForm from "./DetailsForm";
import { faXmark, faClock, faGlobe, faArrowLeft, faCalendarDays,faCheck, faCalendarAlt, faSpinner, faEnvelope, faPhone, faBuilding, faUser, faFileLines, faLock} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { formatDate, formatTime24 } from "@/utils/timezoneUtils";
import { useThemeContext } from "@/context/ThemeContext";


interface ScheduleCallProps {
    show: boolean;
    onHide: () => void;
    services?: string[];
    action?: string | null;
}

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    requirement: string;
    preferredDateTime: string;
    skipDateTime: boolean;
    privacyConsent: boolean;
}

interface ServiceCategory {
    service_category_slug: string;
    service_category_title: string;
    services: {
        service_slug: string;
        service_title: string;
    }[];
}

const SchuduleCallModal = ({ show, onHide, action }: ScheduleCallProps) => {
    const router = useRouter();
    const { selectedService, setSelectedService } = useThemeContext();

    const {
        visibleTimeField,
        setVisibleTimeField,
        setFromLoading,
        step,
        setStep,
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        timezone, 
        setTimezone
        
    } = useScheduleCallContext();

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        requirement: '',
        preferredDateTime: '',
        skipDateTime: false,
        privacyConsent: false
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);


    const resetAllFormData = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            company: '',
            service: '',
            requirement: '',
            preferredDateTime: '',
            skipDateTime: false,
            privacyConsent: false
        });
        setStep(1);
        setVisibleTimeField(false);
        setFromLoading(false);
        setSelectedDate(undefined);
        setSelectedSlot(null);
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        setErrors({});
        setSelectedService('');
    };

    const validateField = (name: string, value: string) => {
        if (name === "service" && !value) return "Please select a service.";
        if (name === "requirement" && !value.trim()) return "Please describe your Message.";
        if (name === "fullName" && !value.trim()) return "Full name is required.";
        if (name === "email") {
            if (!value.trim()) return "Email is required.";
            if (!/^\S+@\S+\.\S+$/.test(value)) return "Please enter a valid email.";
        }
        if (name === "phone" && !value.trim()) return "Phone number is required.";
        if (name === "company" && !value.trim()) return "Company name is required.";
        return "";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const nextValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: nextValue
        }));
        setErrors(prev => {
            if (!prev[name]) return prev;
            const fieldError = validateField(name, String(nextValue));
            const nextErrors = { ...prev };
            if (fieldError) {
                nextErrors[name] = fieldError;
            } else {
                delete nextErrors[name];
            }
            return nextErrors;
        });
    };

    const validateDetails = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.service) newErrors.service = "Please select a service.";
        if (!formData.requirement.trim()) newErrors.requirement = "Please describe your Message.";
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email.";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
        if (!formData.company.trim()) newErrors.company = "Company name is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDetailsSubmit = () => {
        if (validateDetails()) {
            // setCurrentView('confirm');
            setStep(3);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
            
        e.preventDefault();
        if (!validateDetails()) return;

        setIsSubmit(true);
        setStatusMessage('');
        const payload = {
            service: formData.service, // OR map service → ID
            sc_date: formatDate(selectedDate || new Date()),
            sc_time: formatTime24(selectedSlot || ''),
            sc_full_name: formData.fullName,
            sc_business_email: formData.email,
            sc_phone_number: formData.phone,
            sc_message: formData.requirement,
            sc_flag: action,
            sc_time_zone: timezone,
        };

        console.log("payload", payload)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}schedule-a-call`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Submission failed");
            }
            if(data.status !== 'success'){
                throw new Error(data.msg || "Submission failed");
            }else{
                resetAllFormData();
                sessionStorage.setItem("schedule_call_success", "true");
                // Navigate to success page
                router.push('/schedule-a-call/thank-you');
                onHide();
            }
        } catch (err: unknown) {
            setStatusMessage(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmit(false);
        }
    };

    function addMinutesToTime(
        time: string,
        minutesToAdd: number
    ): string {
        const match = time.match(/(\d+):(\d+)(am|pm)/i);
        if (!match) return time;

        const [, hr, min, period] = match;
        let hours = parseInt(hr, 10);
        const minutes = parseInt(min, 10);

        // convert to 24h
        if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
        if (period.toLowerCase() === "am" && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours, minutes + minutesToAdd, 0, 0);

        // format back to 12h
        let endHours = date.getHours();
        const endMinutes = date.getMinutes();
        const endPeriod = endHours >= 12 ? "pm" : "am";

        endHours = endHours % 12 || 12;

        return `${endHours}:${endMinutes
            .toString()
            .padStart(2, "0")}${endPeriod}`;
    }

    useEffect(() => {
        if (show) {
            document.documentElement.style.overflow = "hidden"; // or document.body
        } else {
            document.documentElement.style.overflow = "auto"; // reset
        }

        return () => {
            document.documentElement.style.overflow = "auto"; // cleanup
        };
    }, [show]);

    useEffect(() => {
        const fetchServiceCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category/with-service`);
                if (response.ok) {
                    const data = await response.json();
                    setServiceCategories(data.response_data);
                }
            } catch (error) {
                console.error('Failed to fetch service categories:', error);
            }
        };
        fetchServiceCategories();
        
    },[]);

    useEffect(() => {
        if (!show || !selectedService) return;

        setFormData(prev => ({
            ...prev,
            service: selectedService,
        }));
        setErrors(prev => {
            if (!prev.service) return prev;
            const nextErrors = { ...prev };
            delete nextErrors.service;
            return nextErrors;
        });
    }, [show, selectedService]);

    const getServiceName = (serviceId: string) => {
        for (const category of serviceCategories) {
            const service = category.services.find(s => s.service_slug.toString() === serviceId);
            if (service) return service.service_title;
        }
        return serviceId; // fallback to ID if not found
    };
    const serviceOptions = serviceCategories.map(category => ({
        label: category.service_category_title,
        options: category.services
            .filter(service => service?.service_slug)
            .map(service => ({
                value: service.service_slug,
                label: service.service_title,
            })),
        }));

    const renderConfirmation = () => (
        <div className={styles.confirmView}>
            <div className={styles.confirmHeader}>
                <span>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <h4>Confirm Your Appointment</h4>
                <p>Please review your booking details before we lock this in.</p>
            </div>

            <div className={styles.confirmGrid}>
                <section className={styles.confirmCard}>
                    <div className={styles.confirmCardTitle}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <h5>Appointment Details</h5>
                    </div>
                    <dl className={styles.confirmList}>
                        <div>
                            <dt>Date</dt>
                            <dd>{
                                selectedDate?.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }</dd>
                        </div>
                        <div>
                            <dt>Time</dt>
                            <dd>{selectedSlot}</dd>
                        </div>
                        <div>
                            <dt>Duration</dt>
                            <dd>30 minutes</dd>
                        </div>
                        <div>
                            <dt>Service</dt>
                            <dd>{getServiceName(formData.service)}</dd>
                        </div>
                    </dl>
                </section>

                <section className={styles.confirmCard}>
                    <div className={styles.confirmCardTitle}>
                        <FontAwesomeIcon icon={faUser} />
                        <h5>Contact Information</h5>
                    </div>
                    <ul className={styles.contactList}>
                        <li>
                            <FontAwesomeIcon icon={faUser} />
                            <span>{formData.fullName}</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>{formData.email}</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>{formData.phone}</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faBuilding} />
                            <span>{formData.company}</span>
                        </li>
                    </ul>
                </section>
            </div>

            <section className={styles.commentCard}>
                <div className={styles.confirmCardTitle}>
                    <FontAwesomeIcon icon={faFileLines} />
                    <h5>Project Details</h5>
                </div>
                <p>{formData.requirement}</p>
            </section>

            <Form onSubmit={handleSubmit}>
                {statusMessage && (
                    <Alert variant={statusMessage.includes('error') ? 'danger' : 'success'} className={styles.confirmAlert}>
                        {statusMessage}
                    </Alert>
                )}

                <div className={styles.confirmSubmitArea}>
                    <button type="submit" className={styles.modernScheduleBtn} disabled={isSubmit}>
                        {!isSubmit ?
                            <>
                                <FontAwesomeIcon icon={faCheck} />
                                <em>Confirm & Schedule</em>
                            </>:<>
                                <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                                <em>Scheduling...</em>
                            </>
                        }
                    </button>
                    <p><FontAwesomeIcon icon={faLock} /> Your information is secure.</p>
                </div>
            </Form>
        </div>
    );

    const renderCurrentView = () => {
        switch (step) {
            case 1:
                return <DateTimePicker />;
            case 2:
                return (
                    <DetailsForm
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        handleDetailsSubmit={handleDetailsSubmit}
                        handleBack={() => setStep(step - 1)}
                        setFormData={setFormData}
                        setErrors={setErrors}
                        validateField={validateField}
                        serviceOptions={serviceOptions}
                        heading={
                            <div className="text-center mb-4">
                                <h4 className="mb-2">Enter Details</h4>
                                <p className="text-muted">Tell us about your project and contact information</p>
                            </div>
                        }
                        buttonText="Confirm & Schedule"
                        isSubmitting={isSubmit}
                    />
                );
            case 3:
                return renderConfirmation();
            default:
                return <DateTimePicker />;
        }
    };

    return (
        <Modal show={show} onHide={()=>{resetAllFormData();onHide();}} size={(visibleTimeField ? "xl" : "lg")} backdrop="static" keyboard={false} centered className={`scheduleModal ${styles.scheduleModal ?? ''}`} scrollable={false}>
            <Modal.Body className="px-4">
                <a className={`${styles.modalCloseBtn} position-absolute`} onClick={()=>{resetAllFormData();onHide();}}  aria-label="Close"><FontAwesomeIcon icon={faXmark} /></a>

                <Row className={`schuduleRow rowGap ${styles.schuduleRow}`}>
                    <Col sm={12} className={`${(!visibleTimeField ? `col-md-6 ${styles.borderRight}` : "col-xl-4")}`}>
                        {step !=1 && (<Button
                            className={styles.backButton}
                            onClick={() => setStep(step - 1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>)}
                        <h4 className="mb-1 fw-semibold">Schedule a call with Eclick Softwares Solutions</h4>
                        {/* <p className="text-muted mb-0">Getting Started - Eclick Softwares Solutions</p> */}
                        <div className={styles.scheduleDetails}>
                            <p className="text-muted mb-0 pt-2"><FontAwesomeIcon icon={faClock} /> 30 Min</p>
                            {
                                step !== 1 && (
                                    <>
                                        <p className="text-muted mb-0 pt-2"><FontAwesomeIcon icon={faCalendarDays} /> {selectedSlot} - {addMinutesToTime(selectedSlot??'', 30)} {" at "} {selectedDate ? new Date(selectedDate).toDateString() : ""}</p>
                                        <p className="text-muted mb-0 pt-2"><FontAwesomeIcon icon={faGlobe} /> {timezone}</p>
                                    </>
                                )
                            }
                        </div>

                    </Col>
                    <Col sm={12} className={(!visibleTimeField ? "col-md-6" : "col-xl-8")}>
                        {renderCurrentView()}
                    </Col>
                </Row>

            </Modal.Body>
        </Modal>
    );
};

export default SchuduleCallModal;
