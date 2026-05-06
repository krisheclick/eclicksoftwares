import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';

const SkeletonCard = () => {
    return (
        <Row className={`gx-lg-0 rowGap ${Styles.row ?? ''}`}>
            <Col lg={6}>
                <figure className={`h-100 ${Styles.poster}`}>
                    <div className='skeleton skeletonFill'></div>
                </figure>
            </Col>
            <Col lg={6} className='align-self-center'>
                <div className={`card_content ${Styles.card_content}`}>
                    <div className={`skeleton small_title w-25 ${Styles.subtitle ?? ''}`}>&nbsp;</div>
                    <div className={`skeleton ${Styles.title ?? ''}`}>&nbsp;</div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText d-sm-none"></div>
                    <div className="skeleton skeletonText d-sm-none"></div>
                    <div className="skeleton skeletonText w-75"></div>
                    <div className="skeleton skeletonText w-50"></div>
                </div>
            </Col>
        </Row>
    )
}

export default SkeletonCard
