"use client";
import { Container, Row } from 'react-bootstrap'
import Styles from './style.module.css'
import Card from './Card'
import { useEffect, useState } from 'react';

type Client = {
    client_logo?: string;
    client_name?: string;
}
type TestimonialData = {
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
const Testimonials = () => {
    const [data, setData] = useState<TestimonialData[]>([]);
    const [hasLoading, setHasLoading] = useState(true);
    const [tabActive, setActiveTab] = useState<'videos' | 'written'>('videos');


    const APIfunction = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}testimonial`);
            const { response_data } = await response.json();
            setData(response_data);
        } catch (err: unknown) {
            console.log('Testimonial API is something wrong: ', (err as Error).message)
        } finally {
            setHasLoading(false);
        }
    }
    useEffect(() => {
        APIfunction();
    }, []);

    const filteredData = data.filter(item => {
        if (tabActive === 'videos') {
            return item.testimonial_type === 'video';
        }
        return item.testimonial_type !== 'video';
    });

    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container>
                {!hasLoading ? (
                    <>
                        <div className={Styles.tabList}>
                            <ul className='noList'>
                                <li
                                    className={`${Styles.tabItem} ${tabActive === 'videos' ? Styles.active : ''}`}
                                    onClick={() => setActiveTab('videos')}
                                >
                                    Videos
                                </li>

                                <li
                                    className={`${Styles.tabItem} ${tabActive === 'written' ? Styles.active : ''}`}
                                    onClick={() => setActiveTab('written')}
                                >
                                    Written
                                </li>
                            </ul>
                        </div>

                        <div className={Styles.cardList}>
                            <Row className='rowGap'>
                                <Card cardData={filteredData} />
                            </Row>
                        </div>

                    </>
                ) : (
                    <p></p>
                )}
            </Container>
        </div>
    )
}

export default Testimonials
