import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Card from './Card';
import SpecialCard from './SpecialCard';

type services = {
    wcp_title: string;
    wcp_slug: string;
    wcp_short_description: string;
    wcp_icon_path: string;
    wcp_icon: string;
}
type WWDData = {
    related_solutions_title?: string;
    related_solutions_heading?: string;
}
type props = {
    isLoading: boolean;
    services: services[];
    data: WWDData;
    title?: string;
}

const WhatWeDo = ({ isLoading, data, title, services }: props) => {
    const serviceCount = services.length;
    let col = 3;
    if (serviceCount % 4 === 2) {
        col = 6;
    } else if (serviceCount % 4 === 1) {
        col = 9;
    }

    return (
        <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
            <Container>
                <div className={`section-content max-content ${Styles.section_content ?? ''}`}>
                    {!isLoading ? (
                        <>
                            <div className={Styles.subtitle}>{data?.related_solutions_title || 'Subtitle'}</div>
                            <div className={`title ${Styles.title ?? ''}`}>
                                {data?.related_solutions_heading || title}
                            </div>
                        </>

                    ) : (
                        <>
                            <div className="skeleton mb-3" style={{ width: "150px", height: 30 }}></div>
                            <div className="skeleton skeletonTitle"></div>
                        </>

                    )}
                </div>

                <Row className={`gx-0 ${Styles.row}`}>
                    {!isLoading ? (
                        <>
                            {services && services.length > 0 && services.map((item: services, index: number) => (
                                <Card
                                    key={index}
                                    icon={item.wcp_icon_path}
                                    title={item.wcp_title}
                                    description={item.wcp_short_description}
                                />
                            ))}

                            <SpecialCard col={col} />
                        </>
                    ) : (
                        <>
                            {[...Array(8)].map((_, index) => (
                                <Col lg={3} className={Styles.item} key={index}>
                                    <div className={Styles.box}>
                                        <figure className={`skeleton ${Styles.icon}`}></figure>
                                        <div className="skeleton mb-2" style={{ height: 24 }}></div>
                                        <div className="skeleton skeletonText mb-1"></div>
                                        <div className="skeleton skeletonText"></div>
                                    </div>
                                </Col>
                            ))}
                        </>
                    )}
                </Row>
                {/* <ModalForm title={title} /> */}
            </Container>
        </div>
    )
}

export default WhatWeDo
