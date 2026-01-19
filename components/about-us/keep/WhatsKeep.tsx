import { Container, Row } from 'react-bootstrap';
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
    data?: DataItem;
}

const WhatsKeep = ({ data }: Props) => {
    return (
        <div className={`sectionArea ${Styles.whatsKeep ?? ''}`}>
            <Container>
                <div className={`section-content text-center full ${Styles.section_content ?? ''}`}>
                    <div className={`title fw-bold text-black ${Styles.title ?? ''}`}
                        dangerouslySetInnerHTML={{ __html: data?.usp_category_description || '' }}
                    />
                </div>
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
            </Container>
        </div>
    )
}

export default WhatsKeep