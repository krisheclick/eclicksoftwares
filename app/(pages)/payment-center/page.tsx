"use client";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "@/components/common/banner/Banner";
import PaymentContact from "@/components/payment-center/PaymentContact";
import PaymentInformation from "@/components/payment-center/PaymentInformation";
import Styles from "@/components/payment-center/style.module.css";

export default function PaymentCenter() {
    return (
        <>
            <Banner
                isLoading={false}
                title="Payment Center"
                subtitle="Trust Begins With Easy Payment<br />Pay Any Time – Your Payment is Secured"
                image="/upload/banner_images/payment-center.jpg"
                short_description=""
            />
            <div className={`sectionArea ${Styles.sectionArea}`}>
                <Container>
                    <Row className="gx-xl-5">
                        <Col lg={6}>
                            <PaymentContact />
                        </Col>
                        <Col lg={6}>
                            <PaymentInformation />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}