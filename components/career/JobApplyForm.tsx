"use client";
import { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Styles from "./form.module.css";
import { useRouter } from "next/navigation";
import Select from "react-select";

interface JobApplyFormProps {
    jobTitle: string;
    jobId: string;
    jobLocation?: string;
}

const JobApplyForm = ({ jobTitle, jobId, jobLocation }: JobApplyFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "",
        current_location: "",
        preferred_location: "",
        current_ctc: "",
        message: "",
        cv: null as File | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [locations, setLocations] = useState<string[]>([]);
    const [fileName, setFileName] = useState('');

    // Fetch available job locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers`);
                const { response_data } = await response.json();
                
                const uniqueLocations: string[] = Array.from(
                    new Set(
                        response_data.careers
                            .map((career: { career_location?: string }) =>
                                career.career_location?.trim()
                            )
                            .filter((location: string | undefined): location is string => Boolean(location))
                    )
                );

                setLocations(uniqueLocations);
            } catch (err: unknown) {
                console.error("Failed to fetch locations:", (err as Error).message);
            }
        };

        fetchLocations();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5242880) {
                setErrors(prev => ({ ...prev, cv: 'File size must be less than 5MB.' }));
                setFormData(prev => ({ ...prev, cv: null }));
                setFileName('');
                return;
            }

            setFormData(prev => ({ ...prev, cv: file }));
            setFileName(file.name);
            if (errors.cv) {
                setErrors(prev => ({ ...prev, cv: '' }));
            }
        } else {
            setFormData(prev => ({ ...prev, cv: null }));
            setFileName('');
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required.";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email address is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Phone validation (now required)
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\+?[\d\s\-\(\)]{8,15}$/.test(formData.phone.trim())) {
            newErrors.phone = "Please enter a valid phone number.";
        }

        // Experience validation (now required)
        if (!formData.experience.trim()) {
            newErrors.experience = "Years of experience is required.";
        }

        // Preferred location validation (now required)
        if (!formData.current_location.trim()) {
            newErrors.current_location = "Current location is required.";
        }

        // Preferred location validation (now required)
        if (!formData.preferred_location.trim()) {
            newErrors.preferred_location = "Preferred location is required.";
        }

        if (!formData.current_ctc.trim()) {
            newErrors.current_ctc = "Current CTC is required.";
        }

        // CV validation
        if (!formData.cv) {
            newErrors.cv = "Please upload your CV/Resume.";
        } else if (formData.cv && formData.cv.size > 5242880) {
            newErrors.cv = "File size must be less than 5MB.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('career_id', jobId);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('experience', formData.experience);
            submitData.append('current_location', formData.current_location);
            submitData.append('preferred_location', formData.preferred_location);
            submitData.append('current_ctc', formData.current_ctc);
            submitData.append('message', formData.message);
            if (formData.cv) {
                submitData.append('application_resume_path', formData.cv);
            }

            // Send to API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/career/apply`, {
                method: 'POST',
                body: submitData
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.response_message || "Failed to submit application. Please try again later.");
            }

            const result = await response.json();
            if(result.response_code == false) {
                throw new Error(result.response_message || "Failed to submit application. Please try again later.");
            }
            setStatusMessage("Your application has been submitted successfully! We will contact you soon.");
            setStatusType("success");
            // Set session flag and redirect to thank you page
            sessionStorage.setItem("job_apply_success", "true");
            router.push("/career/thank-you");

        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "An error occurred while submitting your application.");
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={Styles.formContainer}>
            
            <Form onSubmit={handleSubmit} className={Styles.applicationForm}>
                <div className={Styles.formSection}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            isInvalid={!!errors.name}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address *</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email address"
                                    isInvalid={!!errors.email}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number *</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    isInvalid={!!errors.phone}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Years of Experience *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="Enter your years of experience (e.g., 1-2 years)"
                                    isInvalid={!!errors.experience}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{errors.experience}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Current CTC</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="current_ctc"
                                    value={formData.current_ctc}
                                    onChange={handleInputChange}
                                    placeholder="Enter your current CTC (e.g., 200000)"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Current Location</Form.Label>
                                <Select
                                    options={locations.map(location => ({ value: location, label: location }))}
                                    value={formData.current_location ? { value: formData.current_location, label: formData.current_location } : null}
                                    onChange={(selected) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            current_location: selected?.value || ""
                                        }));
                                        // Clear error when user selects
                                        if (errors.current_location) {
                                            setErrors(prev => ({
                                                ...prev,
                                                current_location: ""
                                            }));
                                        }
                                    }}
                                    placeholder="Select your current location"
                                    isSearchable
                                    className={`react-select ${errors.current_location ? 'is-invalid' : ''}`}
                                    classNamePrefix="react-select"
                                    styles={{
                                        menu: base => ({ ...base, zIndex: 9999 }),
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.current_location ? '#dc3545' : base.borderColor,
                                            '&:hover': {
                                                borderColor: errors.current_location ? '#dc3545' : base.borderColor,
                                            },
                                            boxShadow: state.isFocused && errors.current_location ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' : base.boxShadow,
                                        }),
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">{errors.current_location}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Location *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="preferred_location"
                                    value={formData.preferred_location}
                                    onChange={handleInputChange}
                                    placeholder="Enter your preferred work location"
                                    isInvalid={!!errors.preferred_location}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">{errors.preferred_location}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>                   

                    <Form.Group className="mb-3">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us why you're interested in this position..."
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Your CV/Resume *</Form.Label>
                        <div className={Styles.fileUpload}>
                            <Form.Control
                                type="file"
                                id="cv"
                                name="cv"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className={Styles.fileInput}
                                isInvalid={!!errors.cv}
                                required
                            />
                            <label className={`w-100 ${Styles.fileUploadArea} ${!!errors.cv?'is-invalid':''}`} htmlFor="cv">
                                <FontAwesomeIcon icon={faUpload} className={Styles.uploadIcon} />
                                <div className={Styles.uploadText}>
                                    <strong>Choose a file</strong> or drag it here
                                </div>
                                <div className={Styles.uploadHint}>
                                    PDF, DOC, DOCX files only (Max 5MB)
                                </div>
                                {fileName && (
                                    <small className="text-success d-block mt-2">
                                        ✓ File selected: {fileName}
                                    </small>
                                )}
                            </label>
                        </div>
                        {errors.cv && <div className="text-danger mt-2">{errors.cv}</div>}
                    </Form.Group>
                    <Button
                        onClick={handleSubmit}
                        className="eclick-btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span><FontAwesomeIcon icon={faSpinner} spin className="me-2" /></span>
                                <em>Submitting...</em>
                            </>
                        ) : (
                            <>
                                <span><FontAwesomeIcon icon={faUpload} className="me-2" /></span>
                                <em>Submit Application</em>
                            </>
                        )}
                    </Button>
                    <div className="mt-4">
                        {isSubmitting && (
                            <Alert variant="warning" className="mb-4">
                                Submitting your application...
                            </Alert>
                        )}
                        {statusMessage && !isSubmitting && (
                            <Alert
                                variant={
                                    statusType === "success" ? "success" :
                                    statusType === "error" ? "danger" :
                                    "warning"
                                }
                                className="mb-4"
                            >
                                {statusMessage}
                            </Alert>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default JobApplyForm;