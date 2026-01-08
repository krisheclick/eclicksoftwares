import { Col, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';

type Props = {
    hasLoading?: boolean;
    poster?: string;
    subtitle?: string;
    title?: string;
    description?: string;
}
const Card = ({ hasLoading, poster, subtitle, title, description }: Props) => {
    return (
        <Row className={`align-items-center gx-0 ${Styles.row ?? ''}`}>
            <Col lg={6}>
                <figure className={Styles.poster}>
                    {!hasLoading ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${poster}`}
                            alt={title ?? "Card Poster"}
                            fill
                            priority
                        />
                    ) : (
                        <div className='skeleton skeletonFill'></div>
                    )}
                </figure>
            </Col>
            <Col lg={6}>
                {!hasLoading ? (
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
                ) : (
                    <div className={`card_content ${Styles.card_content}`}>
                        {subtitle && (
                            <div className="skeleton skeletonSmallTitle"></div>

                        )}
                        <div className={`skeleton mb-2 ${Styles.skeletonTitle}`}></div>
                        <div className={`skeleton w-75 ${Styles.skeletonTitle}`}></div>
                        <div className="skeleton skeletonText w-100"></div>
                        <div className="skeleton skeletonText w-100"></div>
                        <div className="skeleton skeletonText w-75"></div>
                        <div className="skeleton skeletonText w-50"></div>
                    </div>
                )}

            </Col>
        </Row>
    )
}

export default Card
