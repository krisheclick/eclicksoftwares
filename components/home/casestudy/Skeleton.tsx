import { Col, Container, Row } from 'react-bootstrap';
import Styles from './skeleton.module.css';

const Skeleton = () => {
    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container className='container-full'>
                <div className={"section-content text-white full d-lg-flex align-items-start justify-content-between gap-3"}>
                    <div>
                        <div className={`skeleton ${Styles.skeletonTitle}`}></div>
                        <div className="skeleton skeletonDot">
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className={`skeleton ${Styles.skeletonButton}`}></div>
                </div>
                <div className={Styles.tabs}>
                    <ul className="noList">
                        {[...Array(6)].map((_, index) => (
                            <li key={index} className='skeleton'></li>
                        ))}
                    </ul>
                </div>
                <div className={Styles.gap}>
                    <Row className="rowGap">
                        {[...Array(4)].map((_, index) => (
                            <Col lg={6} key={index}>
                                <aside className="skeleton">
                                    <Row className='align-items-center'>
                                        <Col sm={6}>
                                            <div className={`skeleton ${Styles.poster}`}></div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className={`skeleton ${Styles.posterTitle}`}></div>
                                            <div className={`skeleton skeletonText`}></div>
                                            <div className={`skeleton skeletonText`}></div>
                                            <div className={`skeleton skeletonText`}></div>
                                            <div className={`skeleton skeletonText`}></div>
                                            <div className={`skeleton mt-4 ${Styles.skeletonButton}`}></div>
                                        </Col>
                                    </Row>
                                </aside>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Skeleton
