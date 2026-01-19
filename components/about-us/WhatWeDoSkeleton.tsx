import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';

const WhatWeDoSkeleton = () => {
    return (
        <div className={`sectionArea ${Styles.whatwedo}`}>
            <Container>
                <div className={`section-content full ${Styles.section_content ?? ''}`}>
                    <div className="skeleton mb-3" style={{ width: 150, height: 30 }} />
                    <div className="skeleton" />
                </div>
                <Row className={`gx-0 ${Styles.row}`}>
                    {[...Array(8)].map((_, index) => (
                        <Col lg={3} className={Styles.item} key={index}>
                            <div className={Styles.box}>
                                <div className={Styles.contentBox}>
                                    <figure className={`skeleton ${Styles.icon}`} />
                                    <div className={Styles.content}>
                                        <div className="skeleton mb-2" style={{ height: 24 }} />
                                        <div className="skeleton skeletonText mb-1" />
                                        <div className={`skeleton skeletonText ${Styles.boxtitle}`} />
                                        <div className="skeleton skeletonText" />
                                    </div>
                                </div>
                            </div>
                            <div className={Styles.box}>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default WhatWeDoSkeleton;
