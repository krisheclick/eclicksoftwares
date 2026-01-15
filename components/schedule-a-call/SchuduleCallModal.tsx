"use client";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import { useScheduleCallContext } from "@/context/SchuduleACallContext";
import DateTimePicker from "./DateTimePicker";
import DetailsForm from "./DetailsForm";
import { faXmark, faClock, faGlobe, faArrowLeft, faCalendarDays,faCheck, faCalendarAlt, faSpinner} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { formatDate, formatTime24 } from "@/utils/timezoneUtils";


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
        } catch (err: any) {
            setStatusMessage(err.message || "Something went wrong");
        } finally {
            setIsSubmit(false);
        }

        // try {
        //     // // Combine date and time
        //     // if (selectedDate && selectedSlot) {
        //     //     const [hours, minutes] = selectedSlot.split(':');
        //     //     const dateTime = new Date(selectedDate);
        //     //     dateTime.setHours(parseInt(hours), parseInt(minutes));
        //     //     formData.preferredDateTime = dateTime.toISOString();
        //     // }



        //     // Simulate API call
        //     await new Promise(resolve => setTimeout(resolve, 1000));
        //     setStatusMessage('Thank you! We will get back to you soon.');
        //     // Reset form
        //     setFormData({
        //         fullName: '',
        //         email: '',
        //         phone: '',
        //         company: '',
        //         service: '',
        //         requirement: '',
        //         preferredDateTime: '',
        //         skipDateTime: false,
        //         privacyConsent: false
        //     });
        //     setErrors({});
        //     setCurrentView('calendar');
        //     setSelectedDate(undefined);
        //     // setSelectedTime(null);
        //     // Close modal after success
        //     setTimeout(() => {
        //         onHide();
        //         setStatusMessage('');
        //     }, 2000);
        // } catch {
        //     setStatusMessage('An error occurred. Please try again.');
        // } finally {
        //     setIsSubmit(false);
        // }
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

    // const renderDetailsForm = () => (
    //     <div className={styles.detailsView}>
    //         <div className="text-center mb-4">
    //             <h4 className="mb-2">Enter Details</h4>
    //             <p className="text-muted">Tell us about your project and contact information</p>
    //         </div>
    //         <Form className={styles.detailsForm}>
    //             <Row>
    //                 <Col md={6}>
    //                     <Form.Group className="mb-3">
    //                         <Form.Label className="fw-bold">Full Name *</Form.Label>
    //                         <Form.Control
    //                             type="text"
    //                             name="fullName"
    //                             value={formData.fullName}
    //                             onChange={handleInputChange}
    //                             isInvalid={!!errors.fullName}
    //                             placeholder="Your full name"
    //                         />
    //                         <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
    //                     </Form.Group>
    //                 </Col>
    //                 <Col md={6}>
    //                     <Form.Group className="mb-3">
    //                         <Form.Label className="fw-bold">Company *</Form.Label>
    //                         <Form.Control
    //                             type="text"
    //                             name="company"
    //                             value={formData.company}
    //                             onChange={handleInputChange}
    //                             isInvalid={!!errors.company}
    //                             placeholder="Your company name"
    //                         />
    //                         <Form.Control.Feedback type="invalid">{errors.company}</Form.Control.Feedback>
    //                     </Form.Group>
    //                 </Col>
    //             </Row>

    //             <Form.Group className="mb-3">
    //                 <Form.Label className="fw-bold">Email Address *</Form.Label>
    //                 <Form.Control
    //                     type="email"
    //                     name="email"
    //                     value={formData.email}
    //                     onChange={handleInputChange}
    //                     isInvalid={!!errors.email}
    //                     placeholder="your.email@company.com"
    //                 />
    //                 <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
    //             </Form.Group>

    //             <Form.Group className="mb-3">
    //                 <Form.Label className="fw-bold">Phone Number *</Form.Label>
    //                 <Form.Control
    //                     type="tel"
    //                     name="phone"
    //                     value={formData.phone}
    //                     onChange={handleInputChange}
    //                     isInvalid={!!errors.phone}
    //                     placeholder="+1 (555) 123-4567"
    //                 />
    //                 <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
    //             </Form.Group>

    //             <Form.Group className="mb-3">
    //                 <Form.Label className="fw-bold">What service are you interested in? *</Form.Label>
    //                 {/* <Form.Select
    //                     name="service"
    //                     value={formData.service}
    //                     onChange={handleInputChange}
    //                     isInvalid={!!errors.service}
    //                     >
    //                     <option value="">Select a service...</option>

    //                     {serviceCategories.length > 0 &&
    //                         serviceCategories.map(category => (
    //                         <optgroup key={category.service_category_slug} label={category.service_category_title}>
    //                             {category.services?.map(service => (
    //                             <option key={service.service_slug} value={String(service.service_slug)}>
    //                                 {service.service_title}
    //                             </option>
    //                             ))}
    //                         </optgroup>
    //                         ))}
    //                 </Form.Select> */}

    //                 <Select
    //                     options={serviceOptions}
    //                     placeholder="Select a service..."
    //                     isSearchable
    //                     onChange={(selected) =>
    //                         setFormData(prev => ({
    //                             ...prev,
    //                             service: selected?.value || "",
    //                         }))
    //                     }
    //                     value={serviceOptions
    //                         .flatMap(group => group.options)
    //                         .find(opt => opt.value === formData.service)}
    //                     classNamePrefix="react-select"
    //                     styles={{
    //                         menu: base => ({ ...base, zIndex: 9999 }),
    //                     }}
    //                     />
    //                 <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
    //             </Form.Group>

    //             <Form.Group className="mb-3">
    //                 <Form.Label className="fw-bold">Project Details *</Form.Label>
    //                 <Form.Control
    //                     as="textarea"
    //                     rows={3}
    //                     name="requirement"
    //                     placeholder="Tell us briefly about your project, goals, challenges, and timeline..."
    //                     value={formData.requirement}
    //                     onChange={handleInputChange}
    //                     isInvalid={!!errors.requirement}
    //                 />
    //                 <Form.Control.Feedback type="invalid">{errors.requirement}</Form.Control.Feedback>
    //             </Form.Group>

                

    //             <Form.Group className="mb-4">
    //                 <Form.Check
    //                     type="checkbox"
    //                     label="I agree to the Privacy Policy and Terms & Conditions *"
    //                     name="privacyConsent"
    //                     checked={formData.privacyConsent}
    //                     onChange={handleInputChange}
    //                     isInvalid={!!errors.privacyConsent}
    //                 />
    //                 <Form.Control.Feedback type="invalid">{errors.privacyConsent}</Form.Control.Feedback>
    //             </Form.Group>
    //         </Form>

    //         <div className="d-flex justify-content-between">
    //             <button onClick={handleDetailsSubmit} className={`eclick-btn-connect ${styles.bannerBtn ?? ''}`}>
    //                 <span className={styles.phoneIcon}>
    //                     <Image
    //                         src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
    //                         alt="Conversation"
    //                         width={22} height={21}
    //                         loading="lazy"
    //                     />
    //                 </span>
    //                 <em>Schedule a Call</em>
    //             </button>
    //         </div>
    //     </div>
    // );

    const renderConfirmation = () => (
        <div className={styles.confirmView}>
            <div className="text-center mb-4">
                <h4 className="mb-2">Confirm Your Appointment</h4>
                <p className="text-muted">Please review your booking details</p>
            </div>

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6 className="text-primary mb-3">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                Appointment Details
                            </h6>
                            <p className="mb-1"><strong>Date:</strong> {
                                selectedDate?.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }</p>
                            <p className="mb-1"><strong>Time:</strong> {selectedSlot}</p>
                            <p className="mb-1"><strong>Duration:</strong> 30 minutes</p>
                            <p className="mb-0"><strong>Service:</strong> {getServiceName(formData.service)}</p>
                        </Col>
                        <Col md={6}>
                            <h6 className="text-primary mb-3">
                                <FontAwesomeIcon icon={faCheck} className="me-2" />
                                Contact Information
                            </h6>
                            <p className="mb-1"><strong>Name:</strong> {formData.fullName}</p>
                            <p className="mb-1"><strong>Email:</strong> {formData.email}</p>
                            <p className="mb-1"><strong>Phone:</strong> {formData.phone}</p>
                            <p className="mb-0"><strong>Company:</strong> {formData.company}</p>
                        </Col>
                    </Row>
                    <hr />
                    <div>
                        <h6 className="text-primary mb-2">Project Details</h6>
                        <p className="mb-0">{formData.requirement}</p>
                    </div>
                </Card.Body>
            </Card>

            <Form onSubmit={handleSubmit}>
                {statusMessage && (
                    <Alert variant={statusMessage.includes('error') ? 'danger' : 'success'} className="text-center mb-4">
                        {statusMessage}
                    </Alert>
                )}

                <div className="d-flex justify-content-between">
                    <Button type="submit" className={`eclick-btn-connect ${styles.bannerBtn ?? ''}`} disabled={isSubmit}>
                        {
                            !isSubmit ?
                            <>
                                <span className={styles.phoneIcon}>
                                    <FontAwesomeIcon icon={faCheck} className="ms-2" />
                                </span>
                                <em>Confirm & Schedule</em>
                            </>:<>
                                <span className={styles.phoneIcon}>
                                    <FontAwesomeIcon icon={faSpinner} className="ms-2" />
                                </span>
                                <em>Scheduling...</em>
                            </>
                        }
                        
                    </Button>
                    {/* <Button type="submit" disabled={isSubmit} className="btn-primary">
                        {isSubmit ? 'Scheduling...' : 'Confirm & Schedule'}
                        {!isSubmit ?<FontAwesomeIcon icon={faCheck} className="ms-2" />:null}
                    </Button> */}
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
                        setFormData={setFormData}
                        serviceOptions={serviceOptions}
                        heading={
                            <div className="text-center mb-4">
                                <h4 className="mb-2">Enter Details</h4>
                                <p className="text-muted">Tell us about your project and contact information</p>
                            </div>
                        }
                        buttonText="Schedule a Call"
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
        <Modal show={show} onHide={()=>{resetAllFormData();onHide();}} size={(visibleTimeField ? "xl" : "lg")} backdrop="static" keyboard={false} centered className={styles.scheduleModal} scrollable={false}>
            <Modal.Body className="px-4">
                <a className={`${styles.modalCloseBtn} position-absolute`} onClick={()=>{resetAllFormData();onHide();}}  aria-label="Close"><FontAwesomeIcon icon={faXmark} /></a>

                <Row className="mb-30" style={{ minHeight: "650px" }}>
                    <Col className={(!visibleTimeField ? "col-6" : "col-4")} style={{ borderRight: '1px solid #eee' }}>
                        {step !=1 && (<Button
                            variant="outline-secondary"
                            className={styles.backButton}
                            onClick={() => setStep(step - 1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        </Button>)}
                        <h4 className="mb-1">Schedule a call with Eclick Softwares Solutions</h4>
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
                    <Col className={(!visibleTimeField ? "col-6" : "col-8")}>
                        {renderCurrentView()}
                    </Col>
                </Row>

            </Modal.Body>
        </Modal>
    );
};

export default SchuduleCallModal;
