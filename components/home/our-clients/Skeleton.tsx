import { Col, Row } from "react-bootstrap";
import Styles from './skeleton.module.css';

const SkeletonBox = () => {
  return (
    <Row className="gx-5 align-items-center">
      <Col lg={6}>
        <div className={Styles.cardLogo}>
          {[...Array(9)].map((_, index) => (
            <div key={index} className={`skeleton ${Styles.skeletonItem}`}></div>
          ))}
        </div>
      </Col>

      <Col lg={6}>
        <div className={Styles.card}>
          <div className={`skeleton ${Styles.skeletonLogo}`}></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText"></div>
          <div className={`skeleton ${Styles.skeletonsubtitle}`}></div>
        </div>
      </Col>
    </Row>
  )
}

export default SkeletonBox
