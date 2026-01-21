import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import HireCard from './hire-card/Card';
import HireCardSkeleton from './hire-card/CardSkeleton';
interface UspData {
    usp_feature_image_path?: string;
    usp_title?: string;
    usp_short_description?: string;
    usp_description?: string;
}
interface UspItem {
    usp_category_title?: string;
    usp_category_description?: string;
    usps?: UspData[] | undefined;
}

interface Props {
    hasLoading: boolean;
    data?: UspItem;
    whiteClass?: boolean;
    separateText?: boolean;
}
const Developer = ({ hasLoading, whiteClass, separateText, data }: Props) => {
    return (
        <div className={`${Styles.hwbsec}${whiteClass ? ' bg-white' : ''}`}>
            <Container>
                <div className={`${Styles.hwdfulltextbox}${separateText ? ` ${Styles.separateText}` : ''}`}>
                    {!hasLoading ? (
                        <>
                            <h2 className={Styles.hwdtilte}>{data?.usp_category_title}</h2>
                            {data?.usp_category_description && (
                                <div className={Styles.hwdtiltepara}
                                    dangerouslySetInnerHTML={{ __html: data.usp_category_description }}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <div className={`skeleton skeletonRegularTitle w-50 ${Styles.hwdtilte}`}></div>
                            <div className={Styles.hwdtiltepara}>
                                <div className="skeleton skeletonText mb-2"></div>
                                <div className="skeleton skeletonText mb-2"></div>
                                <div className="skeleton skeletonText mb-2"></div>
                                <div className="skeleton skeletonText mb-2"></div>
                                <div className="skeleton skeletonText mb"></div>
                            </div>
                        </>
                    )}
                </div>
                <div className={Styles.hwdsboxes}>
                    <Row className="rowGap">
                        {!hasLoading ? (
                            data?.usps?.map((item, index) => (
                                <Col lg={3} md={4} key={index}>
                                    <HireCard
                                        icon={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.usp_feature_image_path}`}
                                        title={item.usp_title}
                                        description={item.usp_description}
                                    />
                                </Col>
                            ))) : (
                            [...Array(8)].map((_, index) => (
                                <Col lg={3} md={4} key={index}>
                                    <HireCardSkeleton />
                                </Col>
                            )))}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Developer
