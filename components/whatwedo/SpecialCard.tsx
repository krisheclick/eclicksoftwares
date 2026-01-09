import { Col } from 'react-bootstrap';
import Styles from './card.module.css';
interface SpecialCardProps {
  col: number;
}
const SpecialCard = ({col}: SpecialCardProps) => {
    return (
        <Col lg={col} className={`${Styles.item} ${Styles.specialBox}`}>
            <div className={Styles.box}>
                <div className={Styles.smallTitle}>Special Offers</div>
                <div className={Styles.boldTitle}>Let’s connect!</div>
                {/* <p>Development & Digital marketing company committed to assisting brands</p> */}
                <span
                    role='button'
                    className={`eclick-btn-connect sm mt-2 ${Styles.button}`}
                >
                    Let’s Connect
                </span>
            </div>
        </Col>
    )
}

export default SpecialCard
