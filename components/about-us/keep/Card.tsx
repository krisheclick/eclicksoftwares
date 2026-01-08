import { Col } from 'react-bootstrap';
import Styles from './card.module.css';
import Image from 'next/image';
type Props = {
    poster?: string;
    title?: string;
    description?: string;
}
const Card = ({ poster, title, description }: Props) => {
    return (
        <Col lg={3} sm={6}>
            <div className={Styles.card}>
                <figure>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
                        alt={title || "Card Title"}
                        fill
                        priority
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                        }}
                    />
                </figure>
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
