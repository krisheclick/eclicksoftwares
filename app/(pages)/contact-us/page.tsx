import Contact from "@/components/contact-us/Contact";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/contact-us/style.module.css";
import Information from "@/components/contact-us/Information";
import Area from "@/components/common/footer/Area";

const page = () => {
    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container>
                <Row className="gx-xl-5">
                    <Col lg={6}>
                        <Contact />
                    </Col>
                    <Col lg={6}>
                        <Information />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default page
