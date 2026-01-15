"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import Link from "next/link";

const JobApplyThankYou = () => {
    const router = useRouter();
    const hasRun = useRef(false);
    const [counter, setCounter] = useState(30); // countdown in seconds

    useEffect(() => {
        // if (hasRun.current) return;
        // hasRun.current = true;

        const allowed = sessionStorage.getItem("job_apply_success");

        if (!allowed) {
            router.replace("/career");
            return;
        }

        // countdown timer
        const countdown = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);

        // redirect after 30 seconds
        const redirectTimer = setTimeout(() => {
            sessionStorage.removeItem("job_apply_success"); // remove only when redirecting
            router.replace("/career");
        }, 30000);

        return () => {
            clearInterval(countdown);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <div className={Styles.successPage}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={6} className="text-center">
                        <div className={Styles.successContent}>
                            <div className={Styles.successIcon}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                            <h1 className={Styles.successTitle}>
                                Application Submitted Successfully!
                            </h1>
                            <p className={Styles.successMessage}>
                                Thank you for applying to Eclick Softwares Solutions. We have received your application and our HR team will review it shortly.
                                <br />
                                You will be redirected to the careers page in{" "}
                                <strong>{counter} second{counter !== 1 ? "s" : ""}</strong>.
                            </p>

                            <div className={Styles.actionButtons}>
                                <Link
                                    href="/career"
                                    className={`eclick-btn-primary ${Styles.homeBtn}`}
                                >
                                    <em>Back to Careers</em>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default JobApplyThankYou;