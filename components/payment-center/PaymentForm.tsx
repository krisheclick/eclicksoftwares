"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import Styles from "./form.module.css";
import { Alert } from "react-bootstrap";
import intlTelInput from "intl-tel-input/intlTelInputWithUtils";
import PaymentCenterModal from "./PaymentModal";

interface PaymentFormData {
    name: string;
    email: string;
    phone_number: string;
    project_name: string;
    country: string;
    amount: string;
    currency: string;
    paymentFor: string;
    paymentVia: string;
    policyCheck: boolean;
    newsletterCheck: boolean;
}

interface ServiceCategory {
    service_category_slug: string;
    service_category_title: string;
}

const PaymentForm = () => {
    const [formData, setFormData] = useState<PaymentFormData>({
        name: '',
        email: '',
        phone_number: '',
        project_name: '',
        country: '',
        amount: '',
        currency: '',
        paymentFor: '',
        paymentVia: 'Paypal',
        policyCheck: false,
        newsletterCheck: false
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const projectRef = useRef<HTMLInputElement>(null);
    const countryRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const currencyRef = useRef<HTMLSelectElement>(null);
    const paymentForRef = useRef<HTMLSelectElement>(null);

    const [phoneInput, setPhoneInput] = useState<ReturnType<typeof intlTelInput> | null>(null);

    const eventListenersRef = useRef<{countryChange?: () => void; inputChange?: () => void}>({});

    useEffect(() => {
        let inputElement: HTMLInputElement | null = null;

        if (phoneInputRef.current && !phoneInput) {
            inputElement = phoneInputRef.current; // Capture the current element
            const iti = intlTelInput(inputElement, {
                // initialCountry: "in",
                separateDialCode: true,
                autoPlaceholder: "polite",
                allowDropdown: true,
                nationalMode: true,
                formatOnDisplay: true,
                initialCountry: "auto",
                geoIpLookup: (success, failure) => {
                    fetch("https://ipapi.co/json")
                    .then((res) => res.json())
                    .then((data) => success(data.country_code))
                    .catch(() => failure());
                },
                hiddenInput: () => ({
                    phone: "phone_full",
                    country: "country_code"
                }),
            });

            setPhoneInput(iti);

            // Set initial value if exists
            if (formData.phone_number) {
                inputElement.value = formData.phone_number;
                iti.setNumber(formData.phone_number);
            }

            // Set initial country
            const initialCountryData = iti.getSelectedCountryData();
            if (initialCountryData.name && !formData.country) {
                setFormData(prev => ({
                    ...prev,
                    country: initialCountryData.name
                }));
            }

            // Handle country change
            const handleCountryChange = () => {
                const number = iti.getNumber();
                const countryData = iti.getSelectedCountryData();
                if (number) {
                    setFormData(prev => ({
                        ...prev,
                        phone_number: number,
                        country: countryData.name || '',
                        country_code: countryData.dialCode || '',
                        country_code_alpha2: countryData.iso2 || ''
                    }));
                    setErrors(prev => ({ ...prev, phone_number: "" }));
                }
            };

            // Handle input change
            const handleInputChange = () => {
                const number = iti.getNumber();
                const countryData = iti.getSelectedCountryData();
                if (number) {
                    setFormData(prev => ({
                        ...prev,
                        phone_number: number,
                        country: countryData.name || ''
                    }));
                    setErrors(prev => ({ ...prev, phone_number: "" }));
                }
            };

            inputElement?.addEventListener('countrychange', handleCountryChange);
            inputElement?.addEventListener('input', handleInputChange);

            // Store event listeners for cleanup
            eventListenersRef.current = { countryChange: handleCountryChange, inputChange: handleInputChange };
        }

        return () => {
            if (phoneInput && inputElement) {
                // Remove event listeners using the captured element
                const listeners = eventListenersRef.current;
                if (listeners.countryChange) {
                    inputElement.removeEventListener('countrychange', listeners.countryChange);
                }
                if (listeners.inputChange) {
                    inputElement.removeEventListener('input', listeners.inputChange);
                }
                phoneInput.destroy();
                setPhoneInput(null);
                eventListenersRef.current = {};
            }
        };
    }, [phoneInput, formData.phone_number, formData.country]);

    // Update phone input when formData changes externally
    useEffect(() => {
        if (phoneInput && phoneInputRef.current && formData.phone_number !== phoneInput.getNumber()) {
            phoneInput.setNumber(formData.phone_number);
        }
    }, [formData.phone_number, phoneInput]);

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

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.name.trim()) newErrors.name = "Name is Required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is Required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter valid email address.";
        }
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Phone Number is Required.";
        } else if (phoneInput && !phoneInput.isValidNumber()) {
            newErrors.phone_number = "Please enter a valid phone number with country code.";
        }
        if (!formData.project_name.trim()) newErrors.project_name = "Project Name is Required.";
        if (!formData.country.trim()) newErrors.country = "Country is automatically detected from phone number.";
        if (!formData.amount.trim()) newErrors.amount = "Amount is Required.";
        if (!formData.currency.trim()) newErrors.currency = "Currency is Required.";
        if (!formData.paymentFor.trim()) newErrors.paymentFor = "Payment For is Required.";

        if (!formData.policyCheck) newErrors.policyCheck = "You must accept the Privacy Policy.";
        if (!formData.newsletterCheck) newErrors.newsletterCheck = "You must accept the Newsletter.";

        setErrors(newErrors);

        if (newErrors.name && nameRef.current) nameRef.current.focus();
        else if (newErrors.email && emailRef.current) emailRef.current.focus();
        else if (newErrors.project_name && projectRef.current) projectRef.current.focus();
        else if (newErrors.country && countryRef.current) countryRef.current.focus();
        else if (newErrors.amount && amountRef.current) amountRef.current.focus();
        else if (newErrors.currency && currencyRef.current) currencyRef.current.focus();
        else if (newErrors.paymentFor && paymentForRef.current) paymentForRef.current.focus();

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const { id } = target;
        let value: string | boolean;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        } else {
            value = target.value;
        }

        let cleanedValue = value;

        if (id === "amount" && typeof value === "string") {
            cleanedValue = value.replace(/[^0-9.]/g, "");
        }

        setFormData({
            ...formData,
            [id]: cleanedValue,
        });

        if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmit(true);
        setStatusMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}payment/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Request failed");
            
            const data = await res.json();
            setFormData(prev => ({
                ...prev,
                order_id: data.order_id
            }));
            setShowPaymentModal(true);
            // Assuming there's an API endpoint for payment
            // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}payment`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json", "Accept": "application/json" },
            //     body: JSON.stringify(formData),
            // });

            // if (!res.ok) throw new Error("Request failed");

            // const data = await res.json();
            // setStatusMessage(data?.response_message?.msg || "Payment request submitted successfully.");
        } catch {
            setStatusMessage("Something went wrong. Please try again later.");
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <>
            <div className={Styles.contactForm}>
                <form method="post" onSubmit={handleSubmit}>
                    <div className={`d-none d-xl-block ${Styles.formItem}`}>
                        <label htmlFor="paymentFor">Payment For</label>
                        <div className={`${Styles.inquiryOption} ${errors.paymentFor ? "is-invalid" : ""}`}>
                            {serviceCategories.map((category) => (
                                <label key={category.service_category_slug} htmlFor={category.service_category_slug}>
                                    <input
                                        type="radio"
                                        name="paymentFor"
                                        id={category.service_category_slug}
                                        value={category.service_category_slug}
                                        checked={formData.paymentFor === category.service_category_slug}
                                        onChange={(e) => setFormData({...formData, paymentFor: e.target.value})}
                                    />
                                    <em>{category.service_category_title}</em>
                                </label>
                            ))}
                            {errors.paymentFor && <div className="invalid-feedback d-block">{errors.paymentFor}</div>}
                        </div>
                    </div>

                    <div className={`d-xl-none ${Styles.service}`}>
                        <select
                            id="paymentFor"
                            className={`form-control ${errors.paymentFor ? 'is-invalid' : ''}`}
                            value={formData.paymentFor}
                            onChange={handleChange}
                            ref={paymentForRef}
                        >
                            <option value="">{errors.paymentFor || "Select Payment For"}</option>
                            <option value="Web">Web</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Mobile App">Mobile App</option>
                        </select>
                        {errors.paymentFor && <div className="invalid-feedback d-block">{errors.paymentFor}</div>}
                    </div>
                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <input
                                type="text"
                                id="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder={errors.name || "Full Name"}
                                aria-required="true"
                                value={formData.name}
                                onChange={handleChange}
                                ref={nameRef}
                            />
                            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder={errors.email || "Email Address"}
                                aria-required="true"
                                value={formData.email}
                                onChange={handleChange}
                                ref={emailRef}
                            />
                            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={`${Styles.itemWrap} ${Styles.phoneInputContainer}`}>
                            <input
                                type="tel"
                                id="phone_number"
                                className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                placeholder={errors.phone_number || "Phone Number"}
                                aria-required="true"
                                ref={phoneInputRef}
                                onChange={(e) => {
                                    // This will be handled by the intl-tel-input events
                                    const value = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        phone_number: value
                                    }));
                                    if (errors.phone_number) setErrors((prev) => ({ ...prev, phone_number: "" }));
                                }}
                            />
                            {errors.phone_number && <div className="invalid-feedback d-block">{errors.phone_number}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <input
                                type="text"
                                id="project_name"
                                className={`form-control ${errors.project_name ? 'is-invalid' : ''}`}
                                placeholder={errors.project_name || "Project Name"}
                                aria-required="true"
                                value={formData.project_name}
                                onChange={handleChange}
                                ref={projectRef}
                            />
                            {errors.project_name && <div className="invalid-feedback d-block">{errors.project_name}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <input
                                type="text"
                                id="country"
                                className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                placeholder={errors.country || "Country"}
                                aria-required="true"
                                value={formData.country}
                                readOnly
                                ref={countryRef}
                            />
                            {errors.country && <div className="invalid-feedback d-block">{errors.country}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <input
                                type="number"
                                id="amount"
                                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                placeholder={errors.amount || "Do you know your budget?"}
                                aria-required="true"
                                value={formData.amount}
                                onChange={handleChange}
                                ref={amountRef}
                            />
                            {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <select
                                id="currency"
                                className={`form-control ${errors.currency ? 'is-invalid' : ''}`}
                                value={formData.currency}
                                onChange={handleChange}
                                ref={currencyRef}
                            >
                                <option value="">{errors.currency || "Select Currency"}</option>
                                <option value="AUD">AUD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="USD">USD</option>
                            </select>
                            {errors.currency && <div className="invalid-feedback d-block">{errors.currency}</div>}
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.itemWrap}>
                            <input
                                type="text"
                                id="paymentVia"
                                className="form-control"
                                placeholder="Payment Via"
                                value={formData.paymentVia}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className={Styles.formItem}>
                        <div className={Styles.policyCheck}>
                            <div>
                                <label htmlFor="policyCheck" className={`d-flex align-items-start ${errors.policyCheck ? 'is-invalid' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="policyCheck"
                                        id="policyCheck"
                                        checked={formData.policyCheck}
                                        onChange={handleChange}
                                    />
                                    <p>
                                        I have read and understood the{" "}
                                        <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/privacy-policy/`} target="_blank">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                </label>
                                {errors.policyCheck && <div className="invalid-feedback d-block">{errors.policyCheck}</div>}
                            </div>
                            <div>
                                <label htmlFor="newsletterCheck" className={`d-flex align-items-start ${errors.newsletterCheck ? 'is-invalid' : ''}`}>
                                    <input
                                        type="checkbox"
                                        name="newsletterCheck"
                                        id="newsletterCheck"
                                        checked={formData.newsletterCheck}
                                        onChange={handleChange}
                                    />
                                    <p>Receive newsletters about Eclicksoftwares products and services</p>
                                </label>
                                {errors.newsletterCheck && <div className="invalid-feedback d-block">{errors.newsletterCheck}</div>}
                            </div>
                        </div>
                    </div>
                    <div className={Styles.formItem}>
                        <button type="submit" className={`eclick-btn-submit ${Styles.submitBtn}`} disabled={isSubmit}>
                            <span><FontAwesomeIcon icon={faArrowRight} /></span>
                            <em>Submit Payment Request</em>
                        </button>
                    </div>
                </form>

                {isSubmit && (
                    <Alert variant="warning" className="mt-4">
                        Submitting your payment request...
                    </Alert>
                )}
                {statusMessage && !isSubmit && (
                    <Alert
                        variant={
                            statusMessage.toLowerCase().includes("success") ? "success" :
                            statusMessage.toLowerCase().includes("error") || statusMessage.toLowerCase().includes("wrong") ? "danger" :
                            "warning"
                        }
                        className="mt-4"
                    >
                        {statusMessage}
                    </Alert>
                )}
            </div>
            <PaymentCenterModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                formData={formData}
            />
        </>
    );
};

export default PaymentForm;