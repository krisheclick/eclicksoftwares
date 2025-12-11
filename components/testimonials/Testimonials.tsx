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
    const [isLoading, hasLoading] = useState(true);

    const APIfunction = async() => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}testimonial`);
            const {response_data} = await response.json();
            setData(response_data);
        }catch(err: unknown){
            console.log('Testimonial API is something wrong: ', (err as Error).message)
        }finally{
            hasLoading(false);
        }
    }
    useEffect(() => {
        APIfunction();
    }, []);

    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container>
                {isLoading ? (
                    <p></p>
                ) : (
                    <>
                        <div className={`section-content text-center ${Styles.section_content ?? ''}`}>
                            <h2 className={`heading ${Styles.heading ?? ''}`}>Testimonials</h2>
                        </div>
                        <div className={Styles.cardList}>
                            <Row className='rowGap'>
                                <Card cardData={data} />
                            </Row>
                        </div>
                    </>
                )}
            </Container>
        </div>
    )
}

export default Testimonials
