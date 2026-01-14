"use client";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Styles from "./form.module.css";

interface JobApplyFormProps {
    jobTitle: string;
    jobId: string;
}

const JobApplyForm = ({ jobTitle, jobId }: JobApplyFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        cv: null as File | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            cv: file
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage("");
        setStatusType("");

        try {
            // Validate required fields
            if (!formData.name || !formData.email || !formData.cv) {
                throw new Error("Please fill in all required fields and upload your CV.");
            }

            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('coverLetter', formData.coverLetter);
            submitData.append('jobTitle', jobTitle);
            submitData.append('jobId', jobId);
            submitData.append('cv', formData.cv);

            // Here you would typically send to your API
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

            setStatusMessage("Your application has been submitted successfully! We will contact you soon.");
            setStatusType("success");

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                coverLetter: "",
                cv: null
            });

            // Reset file input
            const fileInput = document.getElementById('cv') as HTMLInputElement;
            if (fileInput) fileInput.value = "";

        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "An error occurred while submitting your application.");
            setStatusType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={Styles.formContainer}>
            {statusMessage && (
                <Alert variant={statusType === "success" ? "success" : "danger"} className="mb-4">
                    {statusMessage}
                </Alert>
            )}

            <Form onSubmit={handleSubmit} className={Styles.applicationForm}>
                <div className={Styles.formSection}>
                    <h3 className={Styles.sectionTitle}>Personal Information</h3>

                    <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                        />
                    </Form.Group>
                </div>

                <div className={Styles.formSection}>
                    <h3 className={Styles.sectionTitle}>Application Details</h3>

                    <Form.Group className="mb-3">
                        <Form.Label>Cover Letter</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="coverLetter"
                            value={formData.coverLetter}
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
                                required
                            />
                            <div className={Styles.fileUploadArea}>
                                <FontAwesomeIcon icon={faUpload} className={Styles.uploadIcon} />
                                <div className={Styles.uploadText}>
                                    <strong>Choose a file</strong> or drag it here
                                </div>
                                <div className={Styles.uploadHint}>
                                    PDF, DOC, DOCX files only (Max 5MB)
                                </div>
                                {formData.cv && (
                                    <div className={Styles.selectedFile}>
                                        Selected: {formData.cv.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form.Group>
                </div>

                <div className={Styles.formActions}>
                    <Button
                        type="submit"
                        className="eclick-btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faUpload} className="me-2" />
                                Submit Application
                            </>
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default JobApplyForm;