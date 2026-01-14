// app/payment-center/failed/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Styles from "./style.module.css";
import Link from "next/link";

const PaymentFailed = () => {
    const router = useRouter();
    const [counter, setCounter] = useState(30); // countdown in seconds

    useEffect(() => {
        // if (hasRun.current) return;
        // hasRun.current = true;

        const allowed = sessionStorage.getItem("paymentFailed");

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
            sessionStorage.removeItem("paymentFailed"); // remove only when redirecting
            router.replace("/");
        }, 30000);

        return () => {
            clearInterval(countdown);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <div className={Styles.failedPage}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={6} className="text-center">
                        <div className={Styles.failedContent}>
                            <div className={Styles.failedIcon}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <h1 className={Styles.failedTitle}>
                                Payment Failed!
                            </h1>
                            <p className={Styles.failedMessage}>
                                Unfortunately, your payment could not be processed. Please try again or contact support.
                                <br />
                                You will be redirected to the homepage in{" "}
                                <strong>{counter} second{counter !== 1 ? "s" : ""}</strong>.
                            </p>

                            <div className={Styles.actionButtons}>
                                <Link
                                    href="/payment-center"
                                    className={`eclick-btn-primary ${Styles.retryBtn}`}
                                >
                                    <em>Try Again</em>
                                </Link>
                                <Link
                                    href="/"
                                    className={`eclick-btn-secondary ${Styles.homeBtn}`}
                                >
                                    <em>Go to Home</em>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PaymentFailed;