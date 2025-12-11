import { Col } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';

type ValuePoint = {
    title: string;
    filename: string;
}

type props = {
    value_points: ValuePoint[];
}

const Card = ({ value_points }: props) => {
    return (
        value_points && value_points.length > 0 && value_points.map((item: ValuePoint, index: number) => (
            <Col lg={3} key={index} className={Styles.columnBox}>
                <div className={Styles.box}>
                    <figure className={Styles.icon}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.filename}`}
                            alt={item.title || 'Productivity & Efficiency'}
                            fill
                            priority={true}
                            style={{objectFit: "contain"}}
                        />
                    </figure>
                    <div className={Styles.boxtitle}>{item.title}</div>
                </div>
            </Col>
        ))
    )
}

export default Card
