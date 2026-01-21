"use client";
import { Col, Row } from "react-bootstrap";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Styles from "./style.module.css";

type CounterItem = {
    site_counter_number: number;
    site_counter_simbol?: string;
    site_counter_title?: string;
    site_counter_icon?: string;
}
type Props = {
    hasLoading?: boolean;
    counters?: CounterItem[];
}

const Counters = ({ hasLoading, counters }: Props) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const duration = 3;
    return (
        <div className={Styles.counterList} ref={ref}>
            <Row className="gx-3 rowGap">
                {!hasLoading ? (
                    counters?.map((item, index) => (
                        <Col lg={3} key={index}>
                            <div className={Styles.counterBox}>
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
                            </div>
                        </Col>
                    ))
                ) : (
                    [...Array(8)].map((_, index) => (
                        <Col lg={3} key={index}>
                            <div className={Styles.counterBox}>
                                <div className={Styles.counterTitle}>
                                    <span className={`skeleton ${Styles.skeletonCount}`}></span>
                                    <em className={`skeleton ${Styles.skeletonPrefix}`}></em>
                                </div>
                                <div className="skeleton skeletonText"></div>
                            </div>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    )
}

export default Counters