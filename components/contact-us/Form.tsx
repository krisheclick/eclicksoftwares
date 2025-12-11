"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Styles from "./form.module.css";
import { Alert } from "react-bootstrap";

interface FormData {
    name: string;
    email: string;
    phone_number: string;
    budget: string;
    message: string;
    policyCheck: boolean;
    newsletterCheck: boolean;
}

const Form = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone_number: '',
        budget: '',
        message: '',
        policyCheck: false,
        newsletterCheck: false
    });

    const [errors, setErrors] = useState<{[key: string] : string}>({});
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const budgetRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        // Name Validate
        if(!formData.name.trim()) newErrors.name = "Name is Required.";

        // Email Validation
        if(!formData.email.trim()){
            newErrors.email = "Email is Required"
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter valid email address."
        }

        // Phone Number Valid
        if(!formData.phone_number.trim()) newErrors.phone_number = "Phone Number is Required.";

        if(!formData.budget.trim()) newErrors.budget = "Budget Amount is Required.";

        if(!formData.message.trim()) newErrors.message = "Message is Required.";

        if (!formData.policyCheck) newErrors.policyCheck = "You must accept the Privacy Policy.";
        if (!formData.newsletterCheck) newErrors.newsletterCheck = "You must accept the Newsletter.";

        setErrors(newErrors);

        if(newErrors.name && nameRef.current) nameRef.current.focus();
        else if(newErrors.email && emailRef.current) emailRef.current.focus();
        else if(newErrors.phone_number && phoneRef.current) phoneRef.current.focus();
        else if(newErrors.budget && budgetRef.current) budgetRef.current.focus();
        else if(newErrors.message && messageRef.current) messageRef.current.focus();

        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const target = e.target;
        const { id, value } = target;
        let cleanedValue = value;

        if (id === "phone_number") {
            cleanedValue = value.replace(/(?!^\+)[^0-9]/g, "");
        }

        if (id === "budget") {
            cleanedValue = value.replace(/[^0-9]/g, "");
        }

        // Use type narrowing here
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setFormData({
                ...formData,
                [id]: target.checked,
            });
        } else {
            setFormData({
                ...formData,
                [id]: cleanedValue,
            });
        }
       

        if(errors[id]) setErrors((prev) => ({...prev, [id]: ""}));
    };


    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmit(true);
        setStatusMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}contact-us`, {
                method: "POST",
                headers: { "Content-Type": "application/json","Accept": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Request failed");

            const data = await res.json();
            setStatusMessage(data?.response_message?.msg || "Message sent successfully.");
        } catch (err) {
            setStatusMessage("Something went wrong. Please try again later.");
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className={Styles.contactForm}>
            <form method="post" onSubmit={handleSubmit}>
                <div className={`d-none d-xl-block ${Styles.formItem}`}>
                    <div className={Styles.inquiryOption}>
                        {[
                            "Talent Hiring",
                            "Enterprise Solutions",
                            "Creative Design",
                            "Careers",
                            "Partners & Investors",
                            "Design & Development",
                            "App Development",
                            "Digital Marketing",
                            "Branding",
                            "Others",
                        ].map((label) => (
                            <label key={label} htmlFor={label.toLowerCase().replace(/[^a-z]/g, "_")}>
                                <input
                                    type="radio"
                                    name="inquiryOption"
                                    id={label.toLowerCase().replace(/[^a-z]/g, "_")}
                                />
                                <em>{label}</em>
                            </label>
                        ))}
                    </div>
                </div>

                <div className={`d-xl-none ${Styles.service}`}>
                    <select name="service" id="service3" className="form-control">
                        <option value="">Select Service</option>
                        <option value="Design & Development">Design & Development</option>
                        <option value="App Development">App Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Talent Hiring">Talent Hiring</option>
                        <option value="Enterprise Solutions">Enterprise Solutions</option>
                        <option value="Creative Design">Creative Design</option>
                        <option value="Careers">Careers</option>
                        <option value="Partners & Investors">Partners & Investors</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div className={Styles.formItem}>
                    <div className={Styles.itemWrap}>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Full Name"
                            aria-required="true"
                            ref={nameRef}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
                </div>

                <div className={Styles.formItem}>
                    <div className={Styles.itemWrap}>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email Address"
                            aria-required="true"
                            ref={emailRef}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                </div>

                <div className={Styles.formItem}>
                    <div className={Styles.itemWrap}>
                        <input
                            type="tel"
                            id="phone_number"
                            className="form-control"
                            placeholder="Phone No."
                            aria-required="true"
                            minLength={8}
                            maxLength={15}
                            ref={phoneRef}
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                        {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}
                    </div>
                </div>

                <div className={Styles.formItem}>
                    <div className={Styles.itemWrap}>
                        <input
                            type="number"
                            id="budget"
                            className="form-control"
                            placeholder="Do you know your budget?"
                            aria-required="true"
                            ref={budgetRef}
                            value={formData.budget}
                            onChange={handleChange}
                        />
                        {errors.budget && <div className="text-danger">{errors.budget}</div>}
                    </div>
                </div>

                <div className={Styles.formItem}>
                    <div className={Styles.itemWrap}>
                        <textarea
                            name="message"
                            id="message"
                            className="form-control"
                            rows={5}
                            placeholder="Message"
                            value={formData.message}
                            ref={messageRef}
                            onChange={handleChange}
                        ></textarea>
                        {errors.message && <div className="text-danger">{errors.message}</div>}
                    </div>
                </div>

                <div className={Styles.formItem}>
                    <div className={Styles.policyCheck}>
                        <div>
                            <label htmlFor="policyCheck" className="d-flex align-items-start">
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
                            {errors.policyCheck && <div className="text-danger">{errors.policyCheck}</div>}
                        </div>
                        <div>
                            <label htmlFor="newsletterCheck" className="d-flex align-items-start">
                                <input
                                    type="checkbox"
                                    name="newsletterCheck"
                                    id="newsletterCheck"
                                    checked={formData.newsletterCheck}
                                    onChange={handleChange}
                                />
                                <p>Receive newsletters about Eclicksoftwares products and services</p>
                            </label>
                            {errors.newsletterCheck && <div className="text-danger">{errors.newsletterCheck}</div>}
                        </div>
                    </div>
                </div>
                <div className={Styles.formItem}>
                    <button type="submit" className={`eclick-btn-submit ${Styles.submitBtn}`} disabled={isSubmit}>
                        <span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </span>{" "}
                        Send Message
                    </button>
                </div>
            </form>

            {isSubmit && (
                <Alert variant="warning" className="mt-4">
                Submitting your message...
                </Alert>
            )}
            {statusMessage && !isSubmit && (
                <Alert
                variant={
                    statusMessage.toLowerCase().includes("success") ? "success" :
                    statusMessage.toLowerCase().includes("error") || statusMessage.toLowerCase().includes("network") ? "danger" :
                    "warning"
                }
                className="mt-4"
                >
                {statusMessage}
                </Alert>
            )}
        </div>
    );
};

export default Form;
