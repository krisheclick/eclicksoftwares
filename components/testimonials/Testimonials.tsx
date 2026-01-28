"use client";
import { Container, Row } from 'react-bootstrap'
import Styles from './style.module.css';
import { useEffect, useState } from 'react';
import Card from './card/Card';
import CardSkeleton from './card/CardSkeleton';
import { useRouter, useSearchParams } from 'next/navigation';

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
    const router = useRouter();
    const searchParams = useSearchParams();
    const groupUrl = searchParams.get('group');

    const [data, setData] = useState<TestimonialData[]>([]);
    const [hasLoading, setHasLoading] = useState(true);
    // const [tabActive, setActiveTab] = useState<'videos' | 'text'>('videos');

    const defaultTab = groupUrl === 'text' || groupUrl === 'videos' ? groupUrl : 'videos';
    const [tabActive, setActiveTab] = useState<'videos' | 'text'>(defaultTab);



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

    // const filteredData = data.filter(item => {
    //     if (tabActive === 'videos') {
    //         return item.testimonial_type === 'video';
    //     }
    //     return item.testimonial_type !== 'video';
    // });

    const filteredData = data.filter(item => {
        if (tabActive === 'videos') {
            return item.testimonial_type === 'video';
        }
        return item.testimonial_type !== 'video';
    });


    useEffect(() => {
        if (groupUrl === 'videos' || groupUrl === 'text') {
            setActiveTab(groupUrl);
        }
    }, [groupUrl]);


    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container>
                <div className={Styles.containerWrapper}>
                    <div className={Styles.tabList}>
                        <ul className='noList'>
                            {!hasLoading ? (
                                <>
                                    <li
                                        className={`${Styles.tabItem} ${tabActive === 'videos' ? Styles.active : ''}`}
                                        // onClick={() => 
                                        //     setActiveTab('videos')
                                        //     router.push('?group=videos', { scroll: false });
                                        // }

                                        onClick={() => {
                                            setActiveTab('videos');
                                            router.push('?group=videos', { scroll: false });
                                        }}
                                    >
                                        Videos
                                    </li>

                                    <li
                                        className={`${Styles.tabItem} ${tabActive === 'text' ? Styles.active : ''}`}
                                        onClick={() => {
                                            setActiveTab('text');
                                            router.push('?group=text', { scroll: false });
                                        }}
                                    >
                                        Text
                                    </li>
                                </>
                            ) : (
                                [...Array(2)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`skeleton ${Styles.tabItem}`}
                                    />
                                ))
                            )}
                        </ul>
                    </div>

                    <div className={Styles.cardList}>
                        <Row className='rowGap gx-5'>
                            {!hasLoading ? (
                                <Card cardData={filteredData} />
                            ) : (
                                [...Array(10)].map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            )}
                        </Row>
                    </div>
                    <div className={`section-content max-content text-center ${Styles.info ?? ''}`}>
                        We currently have testimonials available. If you are interested, please feel free to contact us.
                        {/* {tabActive === 'videos' ? (
                            <>We currently have Videos testimonials available. If you are interested, please feel free to contact us.</>
                        ) : (
                            <>We currently have testimonials available. If you are interested, please feel free to contact us.</>
                        )} */}
                    </div>
                </div >
            </Container >
        </div >
    )
}

export default Testimonials
