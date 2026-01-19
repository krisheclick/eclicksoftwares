import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import CardStyle from '@/components/whatwedo/card.module.css';

const WhatWeDoSkeleton = () => {
    return (
        <div className={`sectionArea ${Styles.whatwedo}`}>
            <Container>
                <div className={`section-content full ${Styles.section_content ?? ''}`}>
                    <div className="skeleton skeletonSmallTitle"></div>
                    <div className="skeleton skeletonRegularTitle w-50 mb-2" />
                    <div className="skeleton skeletonRegularTitle w-50" />
                </div>
                <Row className={`gx-0 ${CardStyle.row}`}>
                    {[...Array(8)].map((_, index) => (
                        <Col lg={3} className={CardStyle.item} key={index}>
                            <div className={CardStyle.box}>
                                <div className={CardStyle.contentBox}>
                                    <div className={`skeleton ${CardStyle.icon}`} />
                                    <div className={CardStyle.content}>
                                        <div className="skeleton mb-2" style={{ height: 24 }} />
                                        <div className="skeleton skeletonText mb-1" />
                                        <div className={`skeleton skeletonText ${CardStyle.boxtitle}`} />
                                        <div className="skeleton skeletonText" />
                                    </div>
                                </div>
                            </div>
                            <div className={CardStyle.box}>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default WhatWeDoSkeleton;
