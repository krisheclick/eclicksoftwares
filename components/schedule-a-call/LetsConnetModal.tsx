"use client";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import { faArrowRight, faBolt, faBuilding, faChevronDown, faEnvelope, faFileLines, faLock, faPhone, faShieldHalved, faSpinner, faTableCellsLarge, faUser, faUserGroup, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Select from "react-select";


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


const LetsConnectModal = ({ show, onHide, action }: ScheduleCallProps) => {
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
        setErrors({});
    };

    const validateField = (name: string, value: string) => {
        if (name === "service" && !value) return "Please select a service.";
        if (name === "requirement" && !value.trim()) return "Please describe your project.";
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
        if (!formData.requirement.trim()) newErrors.requirement = "Please describe your project.";
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
                router.push('/lets-connect/thank-you');
                onHide();
            }
        } catch (err: unknown) {
            setStatusMessage(err instanceof Error ? err.message : "Something went wrong");
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
        <Modal show={show} onHide={()=>{resetAllFormData();onHide();}} size="xl" backdrop="static" keyboard={false} centered className={`${styles.scheduleModal} ${styles.letsConnectModal}`} scrollable={false}>
            <Modal.Body className={styles.letsConnectBody}>
                <button className={styles.letsCloseBtn} type="button" onClick={()=>{resetAllFormData();onHide();}}  aria-label="Close">
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <aside className={styles.letsConnectAside}>
                    <figure className={styles.asideLogo}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/favicon.webp`}
                            alt="Eclick Softwares"
                            width={88}
                            height={82}
                            priority
                        />
                    </figure>
                    <span className={styles.asideMark}></span>
                    <h3>Let&apos;s build something great.</h3>
                    <p>Tell us about your project and our team will get back to you shortly.</p>

                    <ul className={styles.asideList}>
                        <li>
                            <span><FontAwesomeIcon icon={faBolt} /></span>
                            <div>
                                <strong>Quick response</strong>
                                <small>We value your time.</small>
                            </div>
                        </li>
                        <li>
                            <span><FontAwesomeIcon icon={faUserGroup} /></span>
                            <div>
                                <strong>Expert consultation</strong>
                                <small>Get the right guidance.</small>
                            </div>
                        </li>
                        <li>
                            <span><FontAwesomeIcon icon={faShieldHalved} /></span>
                            <div>
                                <strong>No obligation</strong>
                                <small>Just a conversation.</small>
                            </div>
                        </li>
                    </ul>
                </aside>

                <div className={styles.letsConnectFormPanel}>
                    <div className={styles.letsFormHeader}>
                        <h4>Let&apos;s Connect</h4>
                        <p>Share a few details and we&apos;ll take it from here.</p>
                    </div>

                    <form className={styles.letsForm} onSubmit={handleSubmit}>
                        <div className={styles.formGrid}>
                            <label className={styles.fieldGroup}>
                                <span>Full Name *</span>
                                <em>
                                    <FontAwesomeIcon icon={faUser} />
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your full name" />
                                </em>
                                {errors.fullName && <small>{errors.fullName}</small>}
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Company *</span>
                                <em>
                                    <FontAwesomeIcon icon={faBuilding} />
                                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Your company name" />
                                </em>
                                {errors.company && <small>{errors.company}</small>}
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Email Address *</span>
                                <em>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@company.com" />
                                </em>
                                {errors.email && <small>{errors.email}</small>}
                            </label>

                            <label className={styles.fieldGroup}>
                                <span>Phone Number *</span>
                                <em>
                                    <FontAwesomeIcon icon={faPhone} />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" />
                                </em>
                                {errors.phone && <small>{errors.phone}</small>}
                            </label>
                        </div>

                        <div className={`${styles.fieldGroup} ${styles.fullField}`}>
                            <label htmlFor="lets-connect-service">What service are you interested in? *</label>
                            <div className={`${styles.selectWrap} ${errors.service ? styles.hasError : ""}`}>
                                <FontAwesomeIcon icon={faTableCellsLarge} className={styles.fieldIcon} />
                                <Select
                                    inputId="lets-connect-service"
                                    options={serviceOptions}
                                    placeholder="Select a service"
                                    isSearchable
                                    unstyled
                                    onChange={(selected) => {
                                        const value = selected?.value || "";
                                        setFormData(prev => ({
                                            ...prev,
                                            service: value,
                                        }));
                                        setErrors(prev => {
                                            if (!prev.service) return prev;
                                            const nextErrors = { ...prev };
                                            const fieldError = validateField("service", value);
                                            if (fieldError) {
                                                nextErrors.service = fieldError;
                                            } else {
                                                delete nextErrors.service;
                                            }
                                            return nextErrors;
                                        });
                                    }}
                                    value={serviceOptions
                                        .flatMap(group => group.options)
                                        .find(opt => opt.value === formData.service)}
                                    classNamePrefix="lets-select"
                                    classNames={{
                                        control: () => styles.selectControl,
                                        valueContainer: () => styles.selectValue,
                                        placeholder: () => styles.selectPlaceholder,
                                        singleValue: () => styles.selectSingleValue,
                                        indicatorsContainer: () => styles.selectIndicators,
                                        group: () => styles.selectGroup,
                                        groupHeading: () => styles.selectGroupHeading,
                                        menu: () => styles.selectMenu,
                                        menuList: () => styles.selectMenuList,
                                        option: ({ isFocused, isSelected }) => `${styles.selectOption} ${isFocused ? styles.focusedOption : ""} ${isSelected ? styles.selectedOption : ""}`,
                                    }}
                                    components={{
                                        DropdownIndicator: () => <FontAwesomeIcon icon={faChevronDown} />,
                                        IndicatorSeparator: null,
                                    }}
                                />
                            </div>
                            {errors.service && <small>{errors.service}</small>}
                        </div>

                        <label className={`${styles.fieldGroup} ${styles.fullField}`}>
                            <span>Comment *</span>
                            <em className={styles.textareaField}>
                                <FontAwesomeIcon icon={faFileLines} />
                                <textarea name="requirement" value={formData.requirement} onChange={handleInputChange} placeholder="Briefly describe your project, goals, challenges, and timeline..." rows={3}></textarea>
                            </em>
                            {errors.requirement && <small>{errors.requirement}</small>}
                        </label>

                        {statusMessage && <p className={styles.formError}>{statusMessage}</p>}

                        <button className={styles.submitBtn} type="submit" disabled={isSubmit}>
                            {isSubmit ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Send Enquiry
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>
                            )}
                        </button>

                        <p className={styles.safeText}>
                            <FontAwesomeIcon icon={faLock} />
                            Your information is safe with us.
                        </p>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default LetsConnectModal;
