'use client';
import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const WhoWeAre = () => {
    const { ref, inView } = useInView({
        triggerOnce: true, // run only once
        threshold: 0.3,
    });

    const duration = 3; // total duration (seconds)

    const counters = [
        { id: 1, value: 2285, label: 'Web Development', img: 'web-development.png' },
        { id: 2, value: 480, label: 'Digital Marketing', img: 'digital-marketing.png' },
        { id: 3, value: 37, label: 'Apps Development', img: 'apps-development.png' },
        { id: 4, value: 2483, label: 'Our Clients', img: 'clients.png' },
    ];

    return (
        <div className={Styles.sectionArea} ref={ref}>
            <Container>
                <Row>
                    <Col lg={7}>
                        <div className={`section-content ${Styles.section_content ?? ''}`}>
                            <div className={Styles.subtitle}>WHO WE ARE</div>
                            <h2 className={`title ${Styles.title ?? ''}`}>
                                Excellence and innovation are at the heart of everything we do at Eclick Softwares.
                            </h2>
                            <p>
                                Combining all the essential elements, which include eye-catching website designs, clear website layouts, and optimising
                            </p>
                        </div>
                    </Col>

                    <Col lg={5}>
                        <div className={Styles.counterWrapper}>
                            {counters.map(({ id, value, label, img }) => (
                                <div key={id} className={Styles.countBox}>
                                    <figure className={Styles.icon}>
                                        <Image
                                            className='auto-img'
                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/${img}`}
                                            alt={label}
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
                                                    end={value}
                                                    duration={duration}
                                                    useEasing={false} // linear speed
                                                />
                                            ) : (
                                                0
                                            )}
                                        </span>
                                        <em>+</em>
                                    </div>
                                    <p>{label}</p>
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
