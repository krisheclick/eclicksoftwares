"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import Link from "next/link";

const ReferralThankYou = () => {
    const router = useRouter();
    const hasRun = useRef(false);
    const [counter, setCounter] = useState(30);

    useEffect(() => {
        const allowed = sessionStorage.getItem("refer_friend_success");

        if (!allowed) {
            router.replace("/career");
            return;
        }

        const countdown = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            sessionStorage.removeItem("refer_friend_success");
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
                                Referral Submitted Successfully!
                            </h1>

                            <p className={Styles.successMessage}>
                                Thank you for referring a candidate to <strong>Eclick Softwares Solutions</strong>.
                                <br />
                                Our hiring team will review the profile and reach out if there’s a suitable match.
                                <br /><br />
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

export default ReferralThankYou;
