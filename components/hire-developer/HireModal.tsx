"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Styles from "./HireModal.module.css";

interface USPOption {
    label: string;
    value: string;
}

interface HireModalFormData {
    name: string;
    email: string;
    phone_no: string;
    company: string;
    usp: string;
    project_description: string;
}

interface HireModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
    uspOptions?: USPOption[];
}

const HireModal: React.FC<HireModalProps> = ({
    show,
    onHide,
    title = "Hire Developers",
    uspOptions = []
}) => {
    const [formData, setFormData] = useState<HireModalFormData>({
        name: '',
        email: '',
        phone_no: '',
        company: '',
        usp: '',
        project_description: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const companyRef = useRef<HTMLInputElement>(null);
    const uspRef = useRef<HTMLSelectElement>(null);
    const projectRef = useRef<HTMLTextAreaElement>(null);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Name Validation
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required.";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Phone Number Validation
        if (!formData.phone_no.trim()) {
            newErrors.phone_no = "Phone number is required.";
        } else if (!/^[0-9+\-\s()]*$/.test(formData.phone_no) || formData.phone_no.trim().length < 7) {
            newErrors.phone_no = "Please enter a valid phone number.";
        }

        // Company Validation
        if (!formData.company.trim()) {
            newErrors.company = "Company name is required.";
        } else if (formData.company.trim().length < 2) {
            newErrors.company = "Company name must be at least 2 characters.";
        }

        // USP Validation
        if (!formData.usp.trim()) {
            newErrors.usp = "Please select a service option.";
        }

        // Project Description Validation
        if (!formData.project_description.trim()) {
            newErrors.project_description = "Project description is required.";
        } else if (formData.project_description.trim().length < 20) {
            newErrors.project_description = "Project description must be at least 20 characters.";
        }

        setErrors(newErrors);

        // Focus on first error field
        if (newErrors.name && nameRef.current) nameRef.current.focus();
        else if (newErrors.email && emailRef.current) emailRef.current.focus();
        else if (newErrors.phone_no && phoneRef.current) phoneRef.current.focus();
        else if (newErrors.company && companyRef.current) companyRef.current.focus();
        else if (newErrors.usp && uspRef.current) uspRef.current.focus();
        else if (newErrors.project_description && projectRef.current) projectRef.current.focus();

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        let cleanedValue = value;

        // Format phone number - allow only digits, spaces, +, -, ()
        if (id === "phone_no") {
            cleanedValue = value.replace(/[^0-9+\-\s()]/g, "");
        }

        setFormData({
            ...formData,
            [id]: cleanedValue,
        });

        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors((prev) => ({
                ...prev,
                [id]: ""
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}hire-developer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatusType("success");
                setStatusMessage(data?.response_message?.msg || "Your hire request has been submitted successfully!");
                
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone_no: '',
                    company: '',
                    usp: '',
                    project_description: ''
                });

                // Close modal after 2 seconds
                setTimeout(() => {
                    onHide();
                }, 2000);
            } else {
                setStatusType("error");
                setStatusMessage(data?.response_message?.msg || "Failed to submit your request. Please try again.");
            }
        } catch (error) {
            setStatusType("error");
            setStatusMessage("An error occurred. Please try again later.");
            console.error("Form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            phone_no: '',
            company: '',
            usp: '',
            project_description: ''
        });
        setErrors({});
        setStatusMessage("");
        setStatusType("");
        onHide();
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

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            backdrop="static"
            keyboard={false}
            className={`${Styles.hireModal} hire-modal-wrapper`}
            scrollable={true}
        >
            <Modal.Body className={`px-4 position-relative ${Styles.hireModalBody}`}>
                <a 
                    className={`${Styles.modalCloseBtn} position-absolute`}
                    onClick={handleClose}
                    style={{ cursor: 'pointer', top: '1rem', right: '1rem', fontSize: '1.5rem' }}
                    aria-label="Close"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </a>

                {/* Header */}
                <div className="text-center mb-4">
                    <h4 className="mb-2 fw-bold" style={{ fontSize: '1.75rem', color: '#2d3436' }}>
                        {title}
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                        Tell us about your project and we&apos;ll get back to you
                    </p>
                </div>

                {statusMessage && (
                    <Alert
                        variant={statusType === "success" ? "success" : "danger"}
                        dismissible
                        onClose={() => setStatusMessage("")}
                        className={Styles.statusAlert}
                    >
                        {statusMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className={Styles.hireForm}>
                    <Row>
                        {/* Name Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Full Name <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={nameRef}
                                    type="text"
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.name}
                                />
                                {errors.name && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Email Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Email Address <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={emailRef}
                                    type="email"
                                    id="email"
                                    placeholder="your.email@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.email}
                                />
                                {errors.email && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Phone Number Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Phone Number <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={phoneRef}
                                    type="tel"
                                    id="phone_no"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phone_no}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.phone_no}
                                />
                                {errors.phone_no && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone_no}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                        {/* Company Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Company Name <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={companyRef}
                                    type="text"
                                    id="company"
                                    placeholder="Enter your company name"
                                    value={formData.company}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.company}
                                />
                                {errors.company && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.company}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Service Type (USP) Select */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            Hire For <span style={{ color: '#e74c3c' }}>*</span>
                        </Form.Label>
                        <Form.Select
                            ref={uspRef}
                            id="usp"
                            value={formData.usp}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            isInvalid={!!errors.usp}
                        >
                            <option value="">Select a service type...</option>
                            {uspOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                        {errors.usp && (
                            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                                {errors.usp}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    {/* Project Description Field */}
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                            Project Description <span style={{ color: '#e74c3c' }}>*</span>
                        </Form.Label>
                        <Form.Control
                            ref={projectRef}
                            as="textarea"
                            id="project_description"
                            placeholder="Describe your project in detail"
                            value={formData.project_description}
                            onChange={handleChange}
                            rows={4}
                            disabled={isSubmitting}
                            isInvalid={!!errors.project_description}
                        />
                        {errors.project_description && (
                            <Form.Control.Feedback type="invalid">
                                {errors.project_description}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center gap-3 mt-5">
                        <Button
                            type="submit"
                            className={Styles.submitBtn}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                                    Submitting...
                                </>
                            ) : (
                                "Send Inquiry"
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className={Styles.cancelBtn}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default HireModal;
