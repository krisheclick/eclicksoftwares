import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';
import Link from 'next/link';

type services = {
    wcp_title: string;
    wcp_slug: string;
    wcp_short_description: string;
    wcp_icon_path: string;
    wcp_icon: string;
}
type props = {
    isLoading: boolean;
    services: services[];
}

const WhatWeDo = ({ isLoading, services }: props) => {
    const serviceCount = services.length;
    let col = 3;
    if (serviceCount % 4 === 2) {
        col = 6;
    } else if (serviceCount % 4 === 1) {
        col = 9;
    }

    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container>
                <div className={`section-content full ${Styles.section_content ?? ''}`}>
                    {!isLoading ? (
                        <>
                            <div className={Styles.subtitle}>What we do</div>
                            <div className={`title ${Styles.title ?? ''}`}>More custom software solutions we provide</div>
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
                        services && services.length > 0 && services.map((item: services, index: number) => (
                            <Col lg={3} className={Styles.item} key={index}>
                                <div className={Styles.box}>
                                    <div className={Styles.contentBox}>
                                        <figure className={Styles.icon}>
                                            <Image
                                                className='auto-img'
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.wcp_icon_path}`}
                                                alt={`${item.wcp_title}`}
                                                fill
                                                priority
                                            />
                                        </figure>
                                        <div className={Styles.content}>
                                            <div className={Styles.boxtitle}>{item.wcp_title}</div>
                                            <span dangerouslySetInnerHTML={{
                                                __html: item.wcp_short_description ?? ''
                                                    .replace(/Â+/g, "")
                                                    .replace(/\s+/g, " ")
                                                    .trim(),
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))) : (
                        [...Array(7)].map((_, index) => (
                            <Col lg={3} className={Styles.item} key={index}>
                                <div className={Styles.box}>
                                    <figure className={`skeleton ${Styles.icon}`}></figure>
                                    <div className="skeleton mb-2" style={{ height: 24 }}></div>
                                    <div className="skeleton skeletonText mb-1"></div>
                                    <div className="skeleton skeletonText"></div>
                                </div>
                            </Col>
                        ))
                    )}
                    {!isLoading ? (
                        <Col lg={col} className={`${Styles.item} ${Styles.specialBox}`}>
                            <div className={Styles.box}>
                                <div className={Styles.smallTitle}>Special Offers</div>
                                <div className={Styles.boldTitle}>Let’s connect!</div>
                                {/* <p>Development & Digital marketing company committed to assisting brands</p> */}
                                <Link href="javascript:void(0);" className={`eclick-btn-connect sm mt-2 ${Styles.button}`}>Let’s Connect</Link>
                            </div>
                        </Col>

                    ) : (
                        <Col lg={3} className={Styles.item}>
                            <div className={Styles.box}>
                                <figure className={`skeleton ${Styles.icon}`}></figure>
                                <div className="skeleton mb-2" style={{ height: 24 }}></div>
                                <div className="skeleton skeletonText mb-1"></div>
                                <div className="skeleton skeletonText"></div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}

export default WhatWeDo
