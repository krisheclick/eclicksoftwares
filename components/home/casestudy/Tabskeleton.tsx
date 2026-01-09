import { Col, Row } from 'react-bootstrap';
import Cardskeleton from "@/components/casestudy/card/Cardskeleton";
import Styles from './style.module.css';

const Tabskeleton = () => {
    return (
        <>
            <div className={Styles.tabs}>
                <ul className="noList">
                    {[...Array(6)].map((_, index) => (
                        <li key={index} className='skeleton'></li>
                    ))}
                </ul>
            </div>
            <div className={Styles.gap}>
                <Row className="rowGap">
                    {[...Array(4)].map((_, index) => (
                        <Cardskeleton key={index} />
                    ))}
                </Row>
            </div>
        </>
    )
}

export default Tabskeleton
