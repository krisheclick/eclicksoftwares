"use client";
import { Row, Col, Form } from "react-bootstrap";
import styles from './ScheduleCall.module.css';
import Select from "react-select";
import { faArrowRight, faBuilding, faChevronDown, faEnvelope, faFileLines, faList, faLock, faPhone, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
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

interface DetailsFormProps {
    formData: FormData;
    errors: {[key: string]: string};
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleDetailsSubmit: () => void;
    handleBack?: () => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    setErrors: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
    validateField: (name: string, value: string) => string;
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
    handleBack,
    setFormData,
    setErrors,
    validateField,
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
            <Form className={`${styles.detailsForm} ${styles.modernDetailsForm}`}>
                <Row className="rowGap gx-3">
                    <Col md={6}>
                        <Form.Group className={styles.modernField}>
                            <Form.Label>Full Name *</Form.Label>
                            <div className={`${styles.modernInputWrap} ${errors.fullName ? styles.invalidField : ""}`}>
                                <FontAwesomeIcon icon={faUser} />
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.fullName}
                                    placeholder="Your full name"
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className={styles.modernField}>
                            <Form.Label>Company *</Form.Label>
                            <div className={`${styles.modernInputWrap} ${errors.company ? styles.invalidField : ""}`}>
                                <FontAwesomeIcon icon={faBuilding} />
                                <Form.Control
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.company}
                                    placeholder="Your company name"
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">{errors.company}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className={styles.modernField}>
                            <Form.Label>Email Address *</Form.Label>
                            <div className={`${styles.modernInputWrap} ${errors.email ? styles.invalidField : ""}`}>
                                <FontAwesomeIcon icon={faEnvelope} />
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.email}
                                    placeholder="your.email@company.com"
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className={styles.modernField}>
                            <Form.Label>Phone Number *</Form.Label>
                            <div className={`${styles.modernInputWrap} ${errors.phone ? styles.invalidField : ""}`}>
                                <FontAwesomeIcon icon={faPhone} />
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.phone}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className={styles.modernField}>
                            <Form.Label>What service are you interested in? *</Form.Label>
                            <div className={`${styles.scheduleSelectWrap} ${errors.service ? styles.invalidField : ""}`}>
                                <FontAwesomeIcon icon={faList} className={styles.scheduleSelectIcon} />
                                <Select
                                    options={serviceOptions}
                                    placeholder="Select a service..."
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
                                    classNamePrefix="schedule-select"
                                    classNames={{
                                        control: () => styles.scheduleSelectControl,
                                        valueContainer: () => styles.scheduleSelectValue,
                                        placeholder: () => styles.scheduleSelectPlaceholder,
                                        singleValue: () => styles.scheduleSelectSingleValue,
                                        indicatorsContainer: () => styles.scheduleSelectIndicators,
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
                            <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group className={styles.modernField}>
                            <Form.Label>Comment *</Form.Label>
                            <div className={`${styles.modernInputWrap} ${styles.modernTextareaWrap} ${errors.requirement ? styles.invalidField : ""}`}>
                                <FontAwesomeIcon icon={faFileLines} />
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="requirement"
                                    placeholder="Tell us briefly about your goals, challenges and timeline..."
                                    value={formData.requirement}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.requirement}
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">{errors.requirement}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {buttonComponent ? (
                buttonComponent
            ) : (
                <div className={styles.modernSubmitArea}>
                    {handleBack && (
                        <button
                            type="button"
                            className={styles.modernBackLink}
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleDetailsSubmit}
                        className={styles.modernScheduleBtn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                                <em>Scheduling...</em>
                            </>
                        ) : (
                            <>
                                <em>{buttonText}</em>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </>
                        )}
                    </button>
                    <p><FontAwesomeIcon icon={faLock} /> Your information is secure.</p>
                </div>
            )}

        </div>
    );
};

export default DetailsForm;
