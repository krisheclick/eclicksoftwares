import { Col } from 'react-bootstrap'
import Styles from './style.module.css'

const CardSkeleton = () => {
    return (
        <Col lg={6} className={Styles.cardItem}>
            <div className={Styles.videoCard}>
                <figure className={Styles.cardPoster}>
                    <div className='skeleton skeletonFill'></div>
                    <em className={`skeleton ${Styles.icon}`}></em>
                </figure>
            </div>
        </Col>
    )
}

export default CardSkeleton
