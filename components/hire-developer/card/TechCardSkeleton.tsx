import { Col } from 'react-bootstrap';
import Styles from './style.module.css';
const TechCardSkeleton = () => {
    return (
        [...Array(12)]?.map((_, index) => (
            <Col key={index} lg={3} md={4} xs={6}>
                <div className={Styles.techCardsbx}>
                    <div className={`skeleton ${Styles.techcardimg}`} />
                    <div className="skeleton skeletonText mx-auto"></div>
                </div>
            </Col>
        ))
    )
}

export default TechCardSkeleton
