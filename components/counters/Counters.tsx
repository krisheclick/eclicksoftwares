"use client";
import { Col, Container, Row } from "react-bootstrap";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Styles from "./style.module.css";

type CounterItem = {
    site_counter_number: number;
    site_counter_simbol?: string;
    site_counter_title?: string;
}
type CounterData = {
    dz44_title?: string;
    dz44_heading?: string;
};
type Props = {
    hasLoading?: boolean;
    data?: {
        counter?: CounterData;
    };
    counters?: CounterItem[];
}

const Counters = ({ hasLoading, data, counters }: Props) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const duration = 3;
    return (
        <div className={Styles.counter_section} ref={ref}>
            <Container>
                <div className={`section-content ${Styles.section_content ?? ''}`}>
                    {!hasLoading ? (
                        <>
                            {data?.counter?.dz44_title && (
                                <div className="small_title">{data.counter.dz44_title}</div>
                            )}

                            <div className={`title fw-bold ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{ __html: data?.counter?.dz44_heading || '' }}
                            />
                        </>
                    ) : (
                        <>
                            {data?.counter?.dz44_title && (
                                <div className="skeleton skeletonSmallTitle"></div>
                            )}
                            <div className={Styles.skeletonTitleWrapper}>
                                <div className={`skeleton w-100 mb-2 ${Styles.skeletonTitle}`}></div>
                                <div className={`skeleton w-50 ${Styles.skeletonTitle}`}></div>
                            </div>
                        </>
                    )}
                </div>
                <div className={Styles.counterList}>
                    <Row className="gx-3 rowGap">
                        {counters?.map((item, i) => (
                            <Col lg={3} key={i}>
                                <div className={Styles.counterBox}>
                                    {!hasLoading ? (
                                        <>
                                            <div className={Styles.counterTitle}>
                                                <span className={Styles.count}>
                                                    {inView ? (
                                                        <CountUp
                                                            start={0}
                                                            end={item.site_counter_number ?? 0}
                                                            duration={duration}
                                                            useEasing={false}
                                                        />
                                                    ) : (
                                                        0
                                                    )}
                                                </span>
                                                <em>{item.site_counter_simbol}</em>
                                            </div>
                                            <p
                                                dangerouslySetInnerHTML={{ __html: item.site_counter_title || '' }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className={Styles.counterTitle}>
                                                <span className={`skeleton ${Styles.skeletonCount}`}></span>
                                                <em className={`skeleton ${Styles.skeletonPrefix}`}></em>
                                            </div>
                                            <div className="skeleton skeletonText"></div>
                                        </>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Counters