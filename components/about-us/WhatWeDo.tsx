import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Card from '@/components/whatwedo/Card';
import SpecialCard from '@/components/whatwedo/SpecialCard';

type ServiceItem = {
    wcp_title: string;
    wcp_slug: string;
    wcp_short_description: string;
    wcp_icon_path: string;
    wcp_icon: string;
};

type Props = {
    isLoading: boolean;
    services: ServiceItem[];
    data: {
        usp_category_title?: string;
        usp_category_description?: string;
    }
};

const WhatWeDo = ({ isLoading, data, services }: Props) => {
    const serviceCount = services?.length ?? 0;

    let col = 3;
    if (serviceCount % 4 === 2) {
        col = 6;
    } else if (serviceCount % 4 === 1) {
        col = 9;
    }

    return (
        <div className={`sectionArea ${Styles.whatwedo}`}>
            <Container>
                <div className={`section-content full ${Styles.section_content ?? ''}`}>
                    {!isLoading ? (
                        <>
                            {data?.usp_category_title && (<div className="small_title">{data?.usp_category_title}</div>)}
                            <div className={`title fw-bold ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{__html: data?.usp_category_description || ''}}
                             />
                        </>
                    ) : (
                        <>
                            <div className="skeleton mb-3" style={{ width: 150, height: 30 }} />
                            <div className="skeleton skeletonTitle" />
                        </>
                    )}
                </div>

                <Row className={`gx-0 ${Styles.row}`}>
                    {!isLoading ? (
                        <>
                            {services?.map((item, index) => (
                                <Card
                                    key={index}
                                    icon={item.wcp_icon_path}
                                    title={item.wcp_title}
                                    description={item.wcp_short_description}
                                />
                            ))}

                            {serviceCount > 0 && <SpecialCard col={col} />}
                        </>
                    ) : (
                        <>
                            {[...Array(8)].map((_, index) => (
                                <Col lg={3} className={Styles.item} key={index}>
                                    <div className={Styles.box}>
                                        <figure className={`skeleton ${Styles.icon}`} />
                                        <div className="skeleton mb-2" style={{ height: 24 }} />
                                        <div className="skeleton skeletonText mb-1" />
                                        <div className="skeleton skeletonText" />
                                    </div>
                                </Col>
                            ))}
                        </>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default WhatWeDo;
