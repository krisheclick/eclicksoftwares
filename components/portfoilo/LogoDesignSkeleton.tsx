import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";

const LogoDesignSkeleton = () => {
    return (
        <Row className='rowGap gx-2 gx-sm-3 gx-xxl-4'>
            {[...Array(8)].map((_, index) => (
                <Col xl={3} md={4} xs={6} key={index}>
                    <div className={`skeleton ${Styles.logoBox}`}></div>
                </Col>
            ))}
        </Row>
    );
};

export default LogoDesignSkeleton;