import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';
import { useScheduleCall } from '@/utils/useLetsConnect';

type ServiceCta = {
    cta_title: string;
    cta_description: string;
    cta_image: string;
    isLoading: boolean;
}
const Trustownership = ({ isLoading, cta_title, cta_description, cta_image }: ServiceCta) => {
    const { openScheduleModal} = useScheduleCall();
    return (
        <div className={Styles.callToAction}>
            <div className={Styles.innerSection}>
                <Container>
                    <Row className='align-items-center'>
                        <Col lg={6}>
                            <div className={`section-content ${Styles.ctaContent}`}>
                                {!isLoading ? (
                                    <>
                                        <div className={Styles.smallTitle} dangerouslySetInnerHTML={{
                                            __html: cta_title
                                                .replace(/Â+/g, "")
                                                .replace(/\s+/g, " ")
                                                .trim(),
                                        }} />
                                        <div className={`title ${Styles.actionTitle}`} dangerouslySetInnerHTML={{
                                            __html: cta_description
                                                .replace(/Â+/g, "")
                                                .replace(/\s+/g, " ")
                                                .trim(),
                                        }} />
                                        <div className="btn_left">
                                            <button type="button" onClick={() => openScheduleModal('general_schedule_a_call')} className={`eclick-btn-connect ${Styles.bannerBtn ?? ''}`}>
                                                <span className={Styles.phoneIcon}>
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                        alt="Conversation"
                                                        width={22} height={21}
                                                        loading="lazy"
                                                    />
                                                </span>
                                                <em>Schedule a Call</em>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="skeleton w-50 mb-4" style={{ height: 30 }}></div>
                                        <div className="skeleton skeletonTitle mb-3" style={{ height: 40 }}></div>
                                        <div className="skeleton w-75 skeletonTitle" style={{ height: 40 }}></div>
                                        <div className="skeleton w-50 skeletonTitle" style={{ height: 40 }}></div>
                                        <div className="skeleton p-1 mt-4" style={{ width: 180 }}>
                                            <span className="skeleton" style={{ width: 40, height: 40 }}></span>
                                            <em className="skeleton"></em>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Col>
                        <Col lg={6}>
                            {!isLoading ? (
                                <figure className={Styles.poster}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${cta_image}`}
                                        alt={cta_title || "Poster Title"}
                                        fill
                                        loading="lazy"
                                    />
                                </figure>

                            ) : (
                                <div className={`skeleton ${Styles.poster}`}></div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Trustownership
