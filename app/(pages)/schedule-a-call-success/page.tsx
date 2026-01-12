import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCalendarAlt, faClock, faUser, faEnvelope, faPhone, faBuilding, faGlobe } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Call Scheduled Successfully | Eclick Softwares",
    description: "Your call has been successfully scheduled with Eclick Softwares Solutions. Check your appointment details and confirmation.",
};

interface SuccessPageProps {
    searchParams?: {
        date?: string;
        time?: string;
        name?: string;
        email?: string;
        phone?: string;
        company?: string;
        service?: string;
        timezone?: string;
        requirement?: string;
    };
}

const ScheduleCallSuccess = ({ searchParams }: SuccessPageProps) => {
    const {
        date,
        time,
        name,
        email,
        phone,
        company,
        service,
        timezone,
        requirement
    } = searchParams || {};

    return (
        <div className={Styles.successPage}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <div className={Styles.successContent}>
                            {/* Success Header */}
                            <div className={Styles.successHeader}>
                                <div className={Styles.successIcon}>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <h1 className={Styles.successTitle}>Call Scheduled Successfully!</h1>
                                <p className={Styles.successSubtitle}>
                                    Thank you for choosing Eclick Softwares Solutions. Your call has been scheduled and you will receive a confirmation email shortly.
                                </p>
                            </div>

                            {/* Booking Details Card */}
                            <Card className={Styles.bookingCard}>
                                <Card.Body>
                                    <h3 className={Styles.cardTitle}>
                                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                        Your Appointment Details
                                    </h3>

                                    <div className={Styles.detailsGrid}>
                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                            <div>
                                                <strong>Date</strong>
                                                <p>{date ? new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faClock} />
                                            <div>
                                                <strong>Time</strong>
                                                <p>{time || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faGlobe} />
                                            <div>
                                                <strong>Timezone</strong>
                                                <p>{timezone || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faUser} />
                                            <div>
                                                <strong>Name</strong>
                                                <p>{name || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            <div>
                                                <strong>Email</strong>
                                                <p>{email || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faPhone} />
                                            <div>
                                                <strong>Phone</strong>
                                                <p>{phone || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faBuilding} />
                                            <div>
                                                <strong>Company</strong>
                                                <p>{company || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className={Styles.detailItem}>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            <div>
                                                <strong>Service</strong>
                                                <p>{service || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {requirement && (
                                        <div className={Styles.requirements}>
                                            <h4>Project Details</h4>
                                            <p>{requirement}</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Action Buttons */}
                            <div className={Styles.actionButtons}>
                                <Link href="/" className={`eclick-btn-primary ${Styles.homeBtn}`}>
                                    <em>Back to Home</em>
                                </Link>

                                <Link href="/contact-us" className={`eclick-btn-schedule ${Styles.contactBtn}`}>
                                    <span>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                            alt="Contact"
                                            width={21} height={21}
                                            priority={true}
                                        />
                                    </span>
                                    <em>Contact Us</em>
                                </Link>
                            </div>

                            {/* Additional Info */}
                            <div className={Styles.additionalInfo}>
                                <p>
                                    <strong>What happens next?</strong><br />
                                    Our team will review your request and contact you within 24 hours to confirm the appointment details.
                                    If you need to make any changes, please don't hesitate to reach out to us.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ScheduleCallSuccess;