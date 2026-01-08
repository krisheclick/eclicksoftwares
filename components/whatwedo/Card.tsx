import { Col } from 'react-bootstrap';
import Styles from './card.module.css';
import Image from 'next/image';

type Props = {
    icon?: string;
    title?: string;
    description?: string;
}
const Card = ({icon, title, description }: Props) => {
    return (
        <Col lg={3} className={Styles.item} >
            <div className={Styles.box}>
                <div className={Styles.contentBox}>
                    <figure className={Styles.icon}>
                        <Image
                            className='auto-img'
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${icon}`}
                            alt={title || 'Icon Title'}
                            fill
                            priority
                            style={{ objectFit: "contain" }}
                        />
                    </figure>
                    <div className={Styles.content}>
                        <div className={Styles.boxtitle}>{title}</div>
                        <span dangerouslySetInnerHTML={{
                            __html: description ?? ''
                                .replace(/Â+/g, "")
                                .replace(/\s+/g, " ")
                                .trim(),
                        }} />
                    </div>
                </div>
            </div>
        </Col >
    )
}

export default Card
