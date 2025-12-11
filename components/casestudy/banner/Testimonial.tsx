"use client";
import React, { useRef, useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
import CalltoAction from '@/components/home/CalltoAction';
import Image from "next/image";

const Testimonial = () => {

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTogglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    return (
        <section>
            <section className={Styles.TestimonialContainer}>
                <Container>
                    <Row>
                        <Col lg={6}>
                            <div className={Styles.videoSection}>
                                <figure className={Styles.videoGraphi}></figure>
                                <section className="video-section">
                                    <section className={Styles.videoWrapper}>
                                        <div className={Styles.videoContainer} onClick={handleTogglePlay}>
                                            {!isPlaying && (
                                                <>
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/video-preview.jpg`}
                                                        alt="Video Poster"
                                                        fill
                                                        className={Styles.poster}
                                                    />
                                                    <button className={Styles.playButton}>▶</button>
                                                </>
                                            )}
                                            <video
                                                ref={videoRef}
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/diamond-video.mp4`}
                                                className={Styles.video}
                                                muted
                                                playsInline
                                            />
                                        </div>
                                    </section>
                                </section>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <article className={Styles.feedBackText}>
                                <h4>Linda Jewellers</h4>
                                <p>unding freemium technology focus equity bootstrapping usernce niche market.
                                    Seed round agile development growth hacking retur on investment alpha investor advisor marketing pitch gen scrum.</p>
                                <h6>-Adam Joiner / Associate Director</h6>
                                <div className={Styles.myCustomers}>
                                    Our Customers
                                </div>
                            </article>
                        </Col>
                    </Row>
                </Container>
            </section>
            {/* <CalltoAction spaceClass='callToAction' /> */}
        </section>
    );
}
export default Testimonial