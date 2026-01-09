import { Col } from 'react-bootstrap';
import Styles from './style.module.css';

const Cardskeleton = () => {
    return (
        <Col lg={6}>
            <div className={Styles.cardBox}>
                <div className={Styles.thumbnail}>
                    <figure className='skeleton'></figure>
                </div>
                <div className={Styles.cardData}>
                    <div className={`skeleton ${Styles.subtitle} ${Styles.skeletonTitle}`}></div>
                    <div className="skeleton skeletonText w-100"></div>
                    <div className="skeleton skeletonText w-100"></div>
                    <div className="skeleton skeletonText"></div>
                    <div className={Styles.skeletonButton}>
                        <span className='skeleton'></span>
                        <em className='skeleton w-50'></em>
                    </div>
                </div>
            </div>

        </Col>
    )
}

export default Cardskeleton
