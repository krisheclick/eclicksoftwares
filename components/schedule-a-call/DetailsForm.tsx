"use client";
import { useEffect, useState } from "react";
import { Row, Col, Form, Image } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import Select from "react-select";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

interface ServiceOption {
    label: string;
    options: {
        value: string;
        label: string;
    }[];
}

interface ServiceCategory {
    service_category_slug: string;
    service_category_title: string;
    services: {
        service_slug: string;
        service_title: string;
    }[];
}

interface DetailsFormProps {
    formData: FormData;
    errors: {[key: string]: string};
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleDetailsSubmit: () => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    serviceOptions: ServiceOption[];
    heading?: React.ReactNode;
    buttonComponent?: React.ReactNode;
    buttonText?: string;    
    isSubmitting?: boolean;
}

const DetailsForm = ({
    formData,
    errors,
    handleInputChange,
    handleDetailsSubmit,
    setFormData,
    serviceOptions,
    heading = (
        <div className="text-center mb-4">
            <h4 className="mb-2">Enter Details</h4>
            <p className="text-muted">Tell us about your project and contact information</p>
        </div>
    ),
    buttonComponent,
    buttonText = "Schedule a Call",
    isSubmitting = false
}: DetailsFormProps) => {
    return (
        <div className={styles.detailsView}>
            {heading}
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
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">What service are you interested in? *</Form.Label>
                    <Select
                        options={serviceOptions}
                        placeholder="Select a service..."
                        isSearchable
                        onChange={(selected) =>
                            setFormData(prev => ({
                                ...prev,
                                service: selected?.value || "",
                            }))
                        }
                        value={serviceOptions
                            .flatMap(group => group.options)
                            .find(opt => opt.value === formData.service)}
                        className={`react-select ${errors.service ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                        styles={{
                            menu: base => ({ ...base, zIndex: 9999 }),
                            control: (base, state) => ({
                                ...base,
                                borderColor: errors.service ? '#dc3545' : base.borderColor,
                                '&:hover': {
                                    borderColor: errors.service ? '#dc3545' : base.borderColor,
                                },
                                boxShadow: state.isFocused && errors.service ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : base.boxShadow,
                            }),
                        }}
                        />
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

            {buttonComponent ? (
                buttonComponent
            ) : (
                <div className="d-flex justify-content-between">
                    <button
                        onClick={handleDetailsSubmit}
                        className={`eclick-btn-connect ${styles.bannerBtn ?? ''}`}
                        disabled={isSubmitting}
                    >
                        <span className={styles.phoneIcon}>
                            {isSubmitting ? (
                                <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                            ) : (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                    alt="Conversation"
                                    width={22} height={21}
                                    loading="lazy"
                                />
                            )}
                        </span>
                        <em>{isSubmitting ? 'Submitting...' : buttonText}</em>
                    </button>
                </div>
            )}
        </div>
    );
};

export default DetailsForm;