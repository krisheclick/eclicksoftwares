import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';

const SkeletonCard = () => {
    return (
        <Row className={`align-items-center gx-0 ${Styles.row ?? ''}`}>
            <Col lg={6}>
                <figure className={Styles.poster}>
                    <div className='skeleton skeletonFill'></div>
                </figure>
            </Col>
            <Col lg={6}>
                <div className={`card_content ${Styles.card_content}`}>
                    <div className="skeleton skeletonSmallTitle"></div>
                    <div className={`skeleton mb-2 ${Styles.skeletonTitle}`}></div>
                    <div className={`skeleton w-75 ${Styles.skeletonTitle}`}></div>
                    <div className="skeleton skeletonText w-100"></div>
                    <div className="skeleton skeletonText w-100"></div>
                    <div className="skeleton skeletonText w-75"></div>
                    <div className="skeleton skeletonText w-50"></div>
                </div>
            </Col>
        </Row>
    )
}

export default SkeletonCard
