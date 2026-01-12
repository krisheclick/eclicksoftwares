"use client";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import DetailsForm from "./DetailsForm";
import { faXmark, faCheck, faSpinner} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import Select from "react-select";
import Image from "next/image";


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


const LetsConnectModal = ({ show, onHide, services, action }: ScheduleCallProps) => {
    const router = useRouter();

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

    const handleDetailsSubmit = async () => {
        if (validateDetails()) {
            await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
            
        e.preventDefault();
        if (!validateDetails()) return;

        setIsSubmit(true);
        setStatusMessage('');
        const payload = {
            service: formData.service, // OR map service → ID
            sc_full_name: formData.fullName,
            sc_business_email: formData.email,
            sc_phone_number: formData.phone,
            sc_message: formData.requirement,
            sc_flag: action,
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
                sessionStorage.setItem("lets_connect_success", "true");
                // Navigate to success page
                router.push('/lets-connect/success');
                onHide();
            }
        } catch (err: any) {
            setStatusMessage(err.message || "Something went wrong");
        } finally {
            setIsSubmit(false);
        }
    };

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


    const serviceOptions = serviceCategories.map(category => ({
        label: category.service_category_title,
        options: category.services
            .filter(service => service?.service_slug)
            .map(service => ({
                value: service.service_slug,
                label: service.service_title,
            })),
        }));





    return (
        <Modal show={show} onHide={()=>{resetAllFormData();onHide();}} size="lg" backdrop="static" keyboard={false} centered className={styles.scheduleModal} scrollable={false}>
            <Modal.Body className="px-4">
                <a className={`${styles.modalCloseBtn} position-absolute`} onClick={()=>{resetAllFormData();onHide();}}  aria-label="Close"><FontAwesomeIcon icon={faXmark} /></a>

                <div className="mb-30" style={{ minHeight: "650px" }}>
                    <DetailsForm
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        handleDetailsSubmit={handleDetailsSubmit}
                        setFormData={setFormData}
                        serviceOptions={serviceOptions}
                        heading={
                            <div className="text-center mb-4">
                                <h4 className="mb-2">Let&apos;s Connect</h4>
                                <p className="text-muted">Fill in your details and we&apos;ll get back to you</p>
                            </div>
                        }
                        buttonComponent={
                            <div className="d-flex justify-content-center">
                                <Button onClick={handleDetailsSubmit} className={`eclick-btn-connect ${styles.bannerBtn ?? ''}`} disabled={isSubmit}>
                                    {isSubmit ? (
                                        <>
                                            <span className={styles.phoneIcon}><FontAwesomeIcon icon={faSpinner} spin className="me-2" /></span>
                                            <em>Submitting...</em>
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.phoneIcon}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/chat.png`}
                                                    alt="Conversation"
                                                    width={22} height={21}
                                                    loading="lazy"
                                                />
                                            </span>
                                            <em>Submit</em>
                                        </>
                                    )}
                                </Button>
                            </div>
                        }
                        isSubmitting={isSubmit}
                    />
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default LetsConnectModal;
