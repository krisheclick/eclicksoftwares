"use client";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Styles from "./style.module.css";
import Card from "./Card";
import SkeletonBox from "./Skeleton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Client = {
    client_logo?: string;
    client_name?: string;
}
type TestimonialItem = {
    testimonial_title?: string;
    testimonial_author_name?: string;
    testimonial_designation?: string;
    testimonial_rating?: string;
    testimonial_description?: string;
    testimonial_feature_image?: string;
    testimonial_type?: string;
    testimonial_video?: string;
    testimonial_video_poster_image?: string;
    client?: Client;
}
const Clients = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<TestimonialItem[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const fetchAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}testimonial?is_home=1`);
            const { response_data } = await response.json();
            setData(response_data);
        } catch (err: unknown) {
            console.log('Testimonials API is something wrong!', (err as Error).message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        if (data.length > 0 && !activeTab) {
            setActiveTab(data[0]?.testimonial_title ?? null);
        }
    }, [data, activeTab]);

    // const activeData = data.find(item => item?.testimonial_title === activeTab);

    return (
        <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
            <Container>
                <div className={`section-content d-lg-flex align-items-center justify-content-between gap-3 ${Styles.section_content ?? ''}`}>
                    {!hasLoading ? (
                        <>
                            <h2 className="heading mb-0">Our Clients Speak</h2>
                            <div className="d-none d-lg-block">
                                <Link className={`eclick-btn-viewBtn ${Styles.viewBtn ?? ''}`} href={`${process.env.NEXT_PUBLIC_ENV_URL}/our-testimonials`}>
                                    <span className={Styles.icon}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </span>
                                    <em>View All Client</em>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-75">
                                <div className={`heading mb-0 skeleton`}>&nbsp;</div>
                            </div>
                            <div className="d-none d-lg-block">
                                <span className={`skeleton eclick-btn-viewBtn ${Styles.viewBtn ?? ''}`}>&nbsp;</span>
                            </div>
                        </>
                    )}
                </div>
                <div className={Styles.cardWrapper}>
                    <hr />
                    {!hasLoading ? <Card data={data} /> : <SkeletonBox />}
                </div>
                {!hasLoading ? (
                    <div className="btn_center d-lg-none pt-md-3">
                        <Link className={`eclick-btn-viewBtn ${Styles.viewBtn ?? ''}`} href={`${process.env.NEXT_PUBLIC_ENV_URL}/our-testimonials`}>
                            <span className={Styles.icon}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                            <em>View All Client</em>
                        </Link>
                    </div>
                ) : (
                    <div className="btn_center d-lg-none">
                        <span className={`skeleton eclick-btn-viewBtn ${Styles.viewBtn ?? ''}`}>&nbsp;</span>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Clients
