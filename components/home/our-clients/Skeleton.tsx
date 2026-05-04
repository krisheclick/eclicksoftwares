import { Col, Row } from "react-bootstrap";
import Styles from './style.module.css';

const SkeletonBox = () => {
    return (
        <Row className="gx-5 rowGap align-items-center">
            <Col md={5} lg={6}>
                <div className={Styles.cardLogo}>
                    {[...Array(6)].map((_, index) => (
                        <div className={Styles.item} key={index}>
                            <div className={`skeleton ${Styles.box}`}></div>
                        </div>
                    ))}
                </div>
            </Col>

            <Col md={7} lg={6}>
                <div className={`${Styles.card} ${Styles.videoPoster}`}>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className="skeleton skeletonText d-sm-none"></div>
                    <div className="skeleton skeletonText d-sm-none"></div>
                    <div className="skeleton skeletonText w-75"></div>
                    <div className="skeleton skeletonText w-50"></div>
                    <div className={`skeleton subtitle w-50 mb-2 ${Styles.title}`}>&nbsp;</div>
                    <div className={`skeleton skeletonText w-25 ${Styles.designation}`}>&nbsp;</div>
                </div>
            </Col>
        </Row>
    )
}

export default SkeletonBox
