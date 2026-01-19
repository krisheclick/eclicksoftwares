import { Col } from 'react-bootstrap';
import Styles from './card.module.css';
import CustomImage from '@/utils/CustomImage';

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
                    <CustomImage
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${icon}`}
                        alt={title || 'Icon Title'}
                        className={Styles.icon}
                        fallBack="/assets/images/default-icon.webp"
                        style={{objectFit: "scale-down"}}
                    />
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
