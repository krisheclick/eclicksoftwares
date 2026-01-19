"use client";
import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";

const SkeletonCounter = () => {
    return (
        <div className={Styles.counterList}>
            <Row className="gx-3 rowGap">
                {[...Array(8)]?.map((_, i) => (
                    <Col lg={3} key={i}>
                        <div className={Styles.counterBox}>
                            <div className={Styles.counterTitle}>
                                <span className={`skeleton ${Styles.skeletonCount}`}></span>
                                <em className={`skeleton ${Styles.skeletonPrefix}`}></em>
                            </div>
                            <div className="skeleton skeletonText"></div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default SkeletonCounter;
