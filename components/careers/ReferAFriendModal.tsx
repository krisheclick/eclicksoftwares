"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner, faUpload } from "@fortawesome/free-solid-svg-icons";
import Styles from "./ReferAFriendModal.module.css";
import { useRouter } from "next/navigation";

interface ReferFormData {
    candidate_name: string;
    candidate_email: string;
    about_the_candidate: string;
    referrer_name: string;
    referrer_email: string;
    refer_resume_path: File | null;
}

interface ReferAFriendModalProps {
    show: boolean;
    onHide: () => void;
    title?: string;
}

const ReferAFriendModal: React.FC<ReferAFriendModalProps> = ({
    show,
    onHide,
    title = "Refer a Friend"
}) => {    
    const router = useRouter();
    const [formData, setFormData] = useState<ReferFormData>({
        candidate_name: '',
        candidate_email: '',
        about_the_candidate: '',
        referrer_name: '',
        referrer_email: '',
        refer_resume_path: null
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState('');

    const candidateNameRef = useRef<HTMLInputElement>(null);
    const candidateEmailRef = useRef<HTMLInputElement>(null);
    const aboutCandidateRef = useRef<HTMLTextAreaElement>(null);
    const referrerNameRef = useRef<HTMLInputElement>(null);
    const referrerEmailRef = useRef<HTMLInputElement>(null);
    const resumeRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Candidate Name Validation
        if (!formData.candidate_name.trim()) {
            newErrors.candidate_name = "Candidate name is required.";
        } else if (formData.candidate_name.trim().length < 2) {
            newErrors.candidate_name = "Candidate name must be at least 2 characters.";
        }

        // Candidate Email Validation
        if (!formData.candidate_email.trim()) {
            newErrors.candidate_email = "Candidate email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.candidate_email)) {
            newErrors.candidate_email = "Please enter a valid email address.";
        }

        // About Candidate Validation
        if (!formData.about_the_candidate.trim()) {
            newErrors.about_the_candidate = "About the candidate is required.";
        } else if (formData.about_the_candidate.trim().length < 20) {
            newErrors.about_the_candidate = "Please provide at least 20 characters about the candidate.";
        }

        // Referrer Name Validation
        if (!formData.referrer_name.trim()) {
            newErrors.referrer_name = "Your name is required.";
        } else if (formData.referrer_name.trim().length < 2) {
            newErrors.referrer_name = "Name must be at least 2 characters.";
        }

        // Referrer Email Validation
        if (!formData.referrer_email.trim()) {
            newErrors.referrer_email = "Your email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.referrer_email)) {
            newErrors.referrer_email = "Please enter a valid email address.";
        }

        // Resume Validation
        if (!formData.refer_resume_path) {
            newErrors.refer_resume_path = "Please upload a resume/CV.";
        } else if (formData.refer_resume_path.size > 5242880) { // 5MB
            newErrors.refer_resume_path = "File size must be less than 5MB.";
        }

        setErrors(newErrors);

        // Focus on first error field
        if (newErrors.candidate_name && candidateNameRef.current) candidateNameRef.current.focus();
        else if (newErrors.candidate_email && candidateEmailRef.current) candidateEmailRef.current.focus();
        else if (newErrors.about_the_candidate && aboutCandidateRef.current) aboutCandidateRef.current.focus();
        else if (newErrors.referrer_name && referrerNameRef.current) referrerNameRef.current.focus();
        else if (newErrors.referrer_email && referrerEmailRef.current) referrerEmailRef.current.focus();
        else if (newErrors.refer_resume_path && resumeRef.current) resumeRef.current.focus();

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors((prev) => ({
                ...prev,
                [id]: ""
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setFileName(file.name);
            setFormData({
                ...formData,
                refer_resume_path: file
            });
            // Clear error for this field
            if (errors.refer_resume_path) {
                setErrors((prev) => ({
                    ...prev,
                    refer_resume_path: ""
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('candidate_name', formData.candidate_name);
            formDataToSend.append('candidate_email', formData.candidate_email);
            formDataToSend.append('about_the_candidate', formData.about_the_candidate);
            formDataToSend.append('referrer_name', formData.referrer_name);
            formDataToSend.append('referrer_email', formData.referrer_email);
            if (formData.refer_resume_path) {
                formDataToSend.append('refer_resume_path', formData.refer_resume_path);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}careers/refer-apply`, {
                method: "POST",
                body: formDataToSend
            });

            const data = await response.json();

            if (response.ok) {
                setStatusType("success");
                setStatusMessage(data?.response_message?.msg || "Thank you for the referral! We'll review the candidate shortly.");
                
                // Reset form
                setFormData({
                    candidate_name: '',
                    candidate_email: '',
                    about_the_candidate: '',
                    referrer_name: '',
                    referrer_email: '',
                    refer_resume_path: null
                });
                setFileName('');
                sessionStorage.setItem("refer_friend_success", "true");
                router.push("/career/refer/thank-you");
                // Close modal after 2 seconds
                setTimeout(() => {
                    onHide();
                }, 2000);
            } else {
                setStatusType("error");
                setStatusMessage(data?.response_message?.msg || "Failed to submit referral. Please try again.");
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
            candidate_name: '',
            candidate_email: '',
            about_the_candidate: '',
            referrer_name: '',
            referrer_email: '',
            refer_resume_path: null
        });
        setFileName('');
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
            className={`${Styles.referModal} refer-modal-wrapper`}
            scrollable={true}
        >
            <Modal.Body className={`px-4 position-relative ${Styles.referModalBody}`}>
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
                        Know someone great? Help us find our next team member
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

                <form className={Styles.referForm}>
                    {/* Candidate Section */}
                    <Row className="mb-1">
                        {/* Candidate Name Field */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold">
                                    Candidate Name <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={candidateNameRef}
                                    type="text"
                                    id="candidate_name"
                                    placeholder="Enter candidate's full name"
                                    value={formData.candidate_name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.candidate_name}
                                />
                                {errors.candidate_name && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.candidate_name}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Candidate Email Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Candidate Email <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={candidateEmailRef}
                                    type="email"
                                    id="candidate_email"
                                    placeholder="candidate@email.com"
                                    value={formData.candidate_email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.candidate_email}
                                />
                                {errors.candidate_email && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.candidate_email}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* About Candidate Field */}
                    <Form.Group className="mb-1">
                        <Form.Label className="fw-bold">
                            About the Candidate <span style={{ color: '#e74c3c' }}>*</span>
                        </Form.Label>
                        <Form.Control
                            ref={aboutCandidateRef}
                            as="textarea"
                            id="about_the_candidate"
                            placeholder="Tell us about this candidate - their skills, experience, and why they'd be a great fit"
                            value={formData.about_the_candidate}
                            onChange={handleChange}
                            rows={3}
                            disabled={isSubmitting}
                            isInvalid={!!errors.about_the_candidate}
                        />
                        {errors.about_the_candidate && (
                            <Form.Control.Feedback type="invalid">
                                {errors.about_the_candidate}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label className="fw-bold">Your CV/Resume *</Form.Label>
                        <div className={Styles.fileUpload}>
                            <Form.Control
                                type="file"
                                id="refer_resume_path"
                                name="refer_resume_path"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className={Styles.fileInput}
                                isInvalid={!!errors.refer_resume_path}
                                required
                            />
                            <label className={`w-100 ${Styles.fileUploadArea} ${!!errors.refer_resume_path?'is-invalid':''}`} htmlFor="refer_resume_path">
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
                        {errors.refer_resume_path && <div className="text-danger mt-2">{errors.refer_resume_path}</div>}
                    </Form.Group>
                    <Row>
                        {/* Referrer Name Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Referer Name <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={referrerNameRef}
                                    type="text"
                                    id="referrer_name"
                                    placeholder="Enter your full name"
                                    value={formData.referrer_name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.referrer_name}
                                />
                                {errors.referrer_name && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.referrer_name}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Referrer Email Field */}
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                    Referer Email <span style={{ color: '#e74c3c' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    ref={referrerEmailRef}
                                    type="email"
                                    id="referrer_email"
                                    placeholder="your@email.com"
                                    value={formData.referrer_email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    isInvalid={!!errors.referrer_email}
                                />
                                {errors.referrer_email && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.referrer_email}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-center gap-3">                        
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className={`${Styles.cancelBtn} eclick-btn-primary`}
                        >
                            Cancel
                        </Button>
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
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default ReferAFriendModal;
