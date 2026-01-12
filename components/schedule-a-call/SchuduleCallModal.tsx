"use client";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import { useScheduleCallContext } from "@/context/SchuduleACallContext";
import DateTimePicker from "./DateTimePicker";
import { faXmark, faClock, faArrowRight, faArrowLeft, faCalendarAlt, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { set } from "nprogress";

interface ScheduleCallProps {
    show: boolean;
    onHide: () => void;
    services?: string[];
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


const SchuduleCallModal = ({ show, onHide, services }: ScheduleCallProps) => {
    const [currentView, setCurrentView] = useState<'calendar' | 'time' | 'details' | 'confirm'>('calendar');

    const {
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

    const defaultServices = [
        'Web Development',
        'Mobile App Development',
        'UI/UX Design',
        'Digital Marketing',
        'Consulting'
    ];
    const serviceOptions = services || defaultServices;

    
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
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateDetails = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.service) newErrors.service = "Please select a service.";
        if (!formData.requirement.trim()) newErrors.requirement = "Please describe your project.";
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email.";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
        if (!formData.company.trim()) newErrors.company = "Company name is required.";
        if (!formData.privacyConsent) {
            newErrors.privacyConsent = "Please accept the terms and conditions.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDetailsSubmit = () => {
        if (validateDetails()) {
            setCurrentView('confirm');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
            
        e.preventDefault();
        if (!validateDetails()) return;

        setIsSubmit(true);
        setStatusMessage('');

        try {
            // Combine date and time
            if (selectedDate && selectedSlot) {
                const [hours, minutes] = selectedSlot.split(':');
                const dateTime = new Date(selectedDate);
                dateTime.setHours(parseInt(hours), parseInt(minutes));
                formData.preferredDateTime = dateTime.toISOString();
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatusMessage('Thank you! We will get back to you soon.');
            // Reset form
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
            setErrors({});
            setCurrentView('calendar');
            setSelectedDate(undefined);
            // setSelectedTime(null);
            // Close modal after success
            setTimeout(() => {
                onHide();
                setStatusMessage('');
            }, 2000);
        } catch {
            setStatusMessage('An error occurred. Please try again.');
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

        let [, hr, min, period] = match;
        let hours = parseInt(hr, 10);
        let minutes = parseInt(min, 10);

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

    const renderDetailsForm = () => (
        <div className={styles.detailsView}>
            <div className="text-center mb-4">
                <h4 className="mb-2">Enter Details</h4>
                <p className="text-muted">Tell us about your project and contact information</p>
            </div>
            <Form className={styles.detailsForm}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Full Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.fullName}
                                placeholder="Your full name"
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Company *</Form.Label>
                            <Form.Control
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                isInvalid={!!errors.company}
                                placeholder="Your company name"
                            />
                            <Form.Control.Feedback type="invalid">{errors.company}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Email Address *</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        placeholder="your.email@company.com"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Phone Number *</Form.Label>
                    <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                        placeholder="+1 (555) 123-4567"
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">What service are you interested in? *</Form.Label>
                    <Form.Select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        isInvalid={!!errors.service}
                    >
                        <option value="">Select a service...</option>
                        {serviceOptions.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Project Details *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="requirement"
                        placeholder="Tell us briefly about your project, goals, challenges, and timeline..."
                        value={formData.requirement}
                        onChange={handleInputChange}
                        isInvalid={!!errors.requirement}
                    />
                    <Form.Control.Feedback type="invalid">{errors.requirement}</Form.Control.Feedback>
                </Form.Group>

                

                <Form.Group className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="I agree to the Privacy Policy and Terms & Conditions *"
                        name="privacyConsent"
                        checked={formData.privacyConsent}
                        onChange={handleInputChange}
                        isInvalid={!!errors.privacyConsent}
                    />
                    <Form.Control.Feedback type="invalid">{errors.privacyConsent}</Form.Control.Feedback>
                </Form.Group>
            </Form>

            <div className="d-flex justify-content-between">
                <Button onClick={handleDetailsSubmit}>
                    Continue
                    <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
            </div>
        </div>
    );

    const renderCurrentView = () => {
        switch (step) {
            case 1:
                return <DateTimePicker />;
            case 2:
                return renderDetailsForm();
            // case 3:
            //     return renderConfirmation();
            default:
                return <DateTimePicker />;
        }
    };

    return (
        <Modal show={show} onHide={()=>{resetAllFormData();onHide();}} size={(visibleTimeField ? "xl" : "lg")} backdrop="static" keyboard={false} centered className={styles.scheduleModal} scrollable={false}>
            <Modal.Body className="px-4">
                <a className={`${styles.modalCloseBtn} position-absolute`} onClick={()=>{resetAllFormData();onHide();}}  aria-label="Close"><FontAwesomeIcon icon={faXmark} /></a>

                <Row className="mb-30" style={{ minHeight: "650px" }}>
                    <Col className={(!visibleTimeField ? "col-6" : "col-4")} style={{ borderRight: '1px solid #eee' }}>
                        {step !=1 && (<Button
                            variant="outline-secondary"
                            onClick={() => setStep(step - 1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                            Back
                        </Button>)}
                        <h3 className="mb-1">Schedule a Call With Eclick Softwares Solutions</h3>
                        {/* <p className="text-muted mb-0">Getting Started - Eclick Softwares Solutions</p> */}
                        {
                            step !== 1 && (
                                <>
                                    <p className="text-muted mb-0 pt-2"><FontAwesomeIcon icon={faClock} /> 30 Min</p>
                                    <p className="text-muted mb-0 pt-2"><FontAwesomeIcon icon={faClock} /> {selectedSlot} - {addMinutesToTime(selectedSlot??'', 30)} {" at "} {selectedDate ? new Date(selectedDate).toDateString() : ""}</p>
                                    <p className="text-muted mb-0 pt-2"><FontAwesomeIcon icon={faClock} /> {timezone}</p>
                                </>
                            )
                        }
                        

                    </Col>
                    <Col className={(!visibleTimeField ? "col-6" : "col-8")}>
                        {renderCurrentView()}
                    </Col>
                </Row>

            </Modal.Body>
        </Modal>
    );
};

export default SchuduleCallModal;
