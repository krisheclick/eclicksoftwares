import { Col } from 'react-bootstrap';
import Styles from './card.module.css';
import { useLetsConnect } from '@/utils/useLetsConnect';
interface SpecialCardProps {
  col: number;
}
const SpecialCard = ({col}: SpecialCardProps) => {
    const { openLetsConnectModal} = useLetsConnect();
    return (
        <Col lg={col} className={`${Styles.item} ${Styles.specialBox}`}>
            <div className={Styles.box}>
                <div className={Styles.smallTitle}>Special Offers</div>
                <div className={Styles.boldTitle}>Let’s connect!</div>
                {/* <p>Development & Digital marketing company committed to assisting brands</p> */}
                <span
                    role='button' onClick={()=>openLetsConnectModal('general_lets_connect')} 
                    className={`eclick-btn-connect sm mt-2 ${Styles.button}`}
                >
                    Let’s Connect
                </span>
            </div>
        </Col>
    )
}

export default SpecialCard
