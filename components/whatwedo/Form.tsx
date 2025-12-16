"use client";
import { Col, Form, FormControl, Row } from "react-bootstrap";
import Styles from "./form.module.css";
import { useRef } from "react";

type Props = {
    title: string;
}
const ModalForm = ({title} : Props) => {

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const messageRef = useRef(null);
    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return(
        <div className={Styles.ModalForm}>
            <Form method="POST" onSubmit={formSubmit}>
                <Row className="gx-3 rowGap">
                    <Col sm={6}>
                        <div className={Styles.controllerWrap}>
                            <FormControl
                                type="text"
                                name="full_name"
                                ref={fullNameRef}
                                placeholder="Full Name"
                            />
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className={Styles.controllerWrap}>
                            <FormControl
                                type="email"
                                name="email_id"
                                ref={emailRef}
                                placeholder="Email Address"
                            />
                        </div>
                    </Col>
                    <Col sm={12}>
                        <div className={Styles.controllerWrap}>
                            <FormControl
                                type="text"
                                name="phone_number"
                                ref={phoneNumberRef}
                                placeholder="Phone Number"
                            />
                        </div>
                    </Col>
                    <Col sm={12}>
                        <div className={Styles.controllerWrap}>
                            <FormControl
                                type="text"
                                name="phone_number"
                                ref={phoneNumberRef}
                                placeholder="Service Name"
                                value={title}
                                readOnly
                            />
                        </div>
                    </Col>
                    <Col sm={12}>
                        <div className={Styles.controllerWrap}>
                            <FormControl
                                as="textarea"
                                name="message"
                                ref={messageRef}
                                rows={6}
                                placeholder="Enter Message"
                            />
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default ModalForm;