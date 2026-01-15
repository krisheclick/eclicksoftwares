"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import Link from "next/link";

const HireDeveloperThankYou = () => {
    const router = useRouter();
    const hasRun = useRef(false);
    const [counter, setCounter] = useState(30);

    useEffect(() => {
        const allowed = sessionStorage.getItem("hire_developer_success");

        if (!allowed) {
            router.replace("/");
            return;
        }

        const countdown = setInterval(() => {
            setCounter(prev => prev - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            sessionStorage.removeItem("hire_developer_success");
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
                                Request Submitted Successfully!
                            </h1>

                            <p className={Styles.successMessage}>
                                Thank you for contacting <strong>Eclick Softwares Solutions</strong>.
                                Your request to hire a developer has been successfully submitted.
                                <br />
                                Our expert team will connect with you shortly to discuss your requirements.
                                <br /><br />
                                You will be redirected to the homepage in{" "}
                                <strong>
                                    {counter} second{counter !== 1 ? "s" : ""}
                                </strong>.
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

export default HireDeveloperThankYou;
