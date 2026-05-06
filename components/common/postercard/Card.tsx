import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import CustomImage from '@/utils/CustomImage';

type Props = {
    poster?: string;
    subtitle?: string;
    title?: string;
    description?: string;
}
const Card = ({ poster, subtitle, title, description }: Props) => {
    return (
        <Row className={`gx-lg-0 rowGap ${Styles.row ?? ''}`}>
            <Col lg={6}>
                <CustomImage
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${poster}`}
                    alt={title ?? "Card Poster"}
                    className={`h-100 ${Styles.poster}`}
                />
            </Col>
            <Col lg={6} className='align-self-center'>
                <div className={`card_content ${Styles.card_content}`}>
                    {subtitle && (
                        <div className={`small_title ${Styles.subtitle ?? ''}`}>{subtitle}</div>
                    )}
                    <div className={Styles.title}>{title}</div>
                    <div
                        className={Styles.card_description}
                        dangerouslySetInnerHTML={{
                            __html: description ?? "",
                        }}
                    />
                </div>
            </Col>
        </Row>
    )
}

export default Card
