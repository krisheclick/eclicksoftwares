"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import Link from "next/link";

const LetsConnectSuccess = () => {
    const router = useRouter();
    const hasRun = useRef(false);
    const [counter, setCounter] = useState(30); // countdown in seconds

    useEffect(() => {
        // if (hasRun.current) return;
        // hasRun.current = true;

        const allowed = sessionStorage.getItem("lets_connect_success");

        if (!allowed) {
            router.replace("/");
            return;
        }

        // countdown timer
        const countdown = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);

        // redirect after 30 seconds
        const redirectTimer = setTimeout(() => {
            sessionStorage.removeItem("lets_connect_success"); // remove only when redirecting
            router.replace("/");
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
                                Message Sent Successfully!
                            </h1>
                            <p className={Styles.successMessage}>
                                Thank you for reaching out to Eclick Softwares Solutions. Our team will contact you shortly.
                                <br />
                                You will be redirected to the homepage in{" "}
                                <strong>{counter} second{counter !== 1 ? "s" : ""}</strong>.
                            </p>

                            <div className={Styles.actionButtons}>
                                <Link
                                    href="/"
                                    className={`eclick-btn-primary ${Styles.homeBtn}`}
                                >
                                    <em>Go to Home Now</em>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LetsConnectSuccess;