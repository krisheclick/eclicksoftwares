import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css'
import Card from './Card';
type UspItem = {
    usp_feature_image_path: string;
    usp_title: string;
    usp_short_description: string;
    usp_description: string;
    usp_feature_image: string;
}
type DataItem = {
    usp_category_title?: string;
    usp_category_description?: string;
    usps?: UspItem[];
}
type Props = {
    hasLoading?: boolean;
    data?: DataItem;
}

const WhatsKeep = ({ hasLoading, data }: Props) => {
    return (
        <div className={`sectionArea ${Styles.whatsKeep ?? ''}`}>
            <Container>
                <div className={`section-content text-center full ${Styles.section_content ?? ''}`}>
                    {!hasLoading ? (
                        <>
                            <div className={`title fw-bold text-black ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{ __html: data?.usp_category_description || '' }}
                            />
                        </>
                    ) : (
                        <>
                            <div className="skeleton skeletonTitle" />
                        </>
                    )}
                    <div className={Styles.cardList}>
                        <Row className={`gx-0 ${Styles.cardRow ?? ''}`}>
                            {data?.usps?.slice(0, 4)?.map((value, index) => (
                                <Card
                                    key={index}
                                    poster={value?.usp_feature_image_path}
                                    title={value?.usp_title}
                                    description={value?.usp_description}
                                />
                            ))}
                        </Row>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default WhatsKeep