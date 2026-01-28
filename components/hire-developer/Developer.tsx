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
    isButton?: boolean;
    boxClass3?: boolean;
}
const Developer = ({ hasLoading, whiteClass, separateText, data, isButton = true, boxClass3}: Props) => {
    const lg = boxClass3 ? 4 : 3;
    const md = boxClass3 ? 6 : 4;
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
                                <Col lg={lg} md={md} key={index}>
                                    <HireCard
                                        icon={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.usp_feature_image_path}`}
                                        title={item.usp_title}
                                        description={item.usp_description}
                                        button={isButton}
                                    />
                                </Col>
                            ))) : (
                            [...Array(8)].map((_, index) => (
                                <Col lg={lg} md={md} key={index}>
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
