import { Col } from 'react-bootstrap';
import Styles from './card.module.css';

const SkeletonKeepCard = () => {
    return (
        <Col sm={6} className={Styles.cardItem}>
            <div className={Styles.card}>
                <figure className={`position-relative ${Styles.cardPoster}`}>
                    <div className="skeleton skeletonFill"></div>
                </figure>
                <div className={Styles.card_content}>
                    <div className={`skeleton ${Styles.card_title} ${Styles.skeleton_title}`}></div>
                    <div className="skeleton skeletonText mb-2"></div>
                    <div className="skeleton skeletonText"></div>
                </div>
            </div>
        </Col>
    )
}

export default SkeletonKeepCard;
