import { Col } from 'react-bootstrap';
import Styles from './card.module.css';
import CustomImage from '@/utils/CustomImage';
type Props = {
    poster?: string;
    title?: string;
    description?: string;
}
const Card = ({ poster, title, description }: Props) => {
    return (
        <Col sm={6} className={Styles.cardItem}>
            <div className={Styles.card}>
                <CustomImage
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
                    alt={title || "Card Title"}
                    className={Styles.cardPoster}
                />
                <div className={Styles.card_content}>
                    <div className={Styles.card_title}
                        dangerouslySetInnerHTML={{ __html: title ?? '' }}
                    />
                    <div className={Styles.card_description}
                        dangerouslySetInnerHTML={{ __html: description ?? '' }}
                    />
                </div>
            </div>
        </Col>
    )
}

export default Card
