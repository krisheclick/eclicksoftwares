'use client';
import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface CounterItem {
    site_counter_number: number;
    site_counter_simbol?: string;
    site_counter_title?: string;
    site_counter_icon?: string;
}
interface WhoWeAreData {
    name?: string;
    q2jf_title?: string;
    q2jf_short_description?: string;
}
interface Props {
    counterData?: CounterItem[];
    data?: WhoWeAreData;
}
const WhoWeAre = ({data, counterData}: Props) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // run only once
        threshold: 0.3,
    });

    const duration = 3;

    return (
        <div className={Styles.sectionArea} ref={ref}>
            <Container>
                <Row>
                    <Col lg={7}>
                        <div className={`section-content ${Styles.section_content ?? ''}`}>
                            <div className={Styles.subtitle}>{data?.name ?? 'WHO WE ARE'}</div>
                            <h2 className={`title ${Styles.title ?? ''}`}>
                                {data?.q2jf_title ?? 'Eclick Softwares.'}
                            </h2>
                            <p
                                dangerouslySetInnerHTML={{__html: data?.q2jf_short_description || 'Please Change Content'}}
                            />
                        </div>
                    </Col>

                    <Col lg={5}>
                        <div className={Styles.counterWrapper}>
                            {counterData?.map((value, index) => (
                                <div key={index} className={Styles.countBox}>
                                    <figure className={Styles.icon}>
                                        <Image
                                            className='auto-img'
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value?.site_counter_icon}`}
                                            alt={value?.site_counter_title || "Counter Title"}
                                            width={50}
                                            height={50}
                                            priority={true}
                                        />
                                    </figure>
                                    <div className={Styles.countWrap}>
                                        <span className={Styles.count}>
                                            {inView ? (
                                                <CountUp
                                                    start={0}
                                                    end={value?.site_counter_number}
                                                    duration={duration}
                                                    useEasing={false} // linear speed
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                        {value?.site_counter_simbol && (
                                            <em>{value.site_counter_simbol}</em>
                                        )}
                                    </div>
                                    <p>{value?.site_counter_title}</p>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default WhoWeAre
