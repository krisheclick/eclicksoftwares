"use client";
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import Tabcontainer from './Tabcontainer';
import Styles from './style.module.css';
import Skeleton from './Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

type ProjectItem = {
  proj_feature_image_path?: string;
  proj_name?: string;
  proj_short_desc?: string;
  proj_tools_used?: { name?: string; value?: string }[];
};

type ServiceCategory = {
  service_category_title?: string;
  service_category_slug?: string;
  projects?: ProjectItem[];
};

const Workaction = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<ServiceCategory[]>([]);

    const fetchAPI = async() => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category/with-projects`);
            const {response_data} = await response.json();
            setData(response_data);
        }catch(err: unknown){
            console.log('Case Study API is something Error:', (err as Error).message);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <>
            {!hasLoading ? (
                <div className={`sectionArea ${Styles.sectionArea}`}>
                    <Container className='container-full'>
                        <div className={Styles.section_wrapper}>
                            <div className={`section-content text-white full d-lg-flex align-items-start justify-content-between gap-3 ${Styles.section_content ?? ''}`}>
                                <h2 className={`heading mb-0 ${Styles.heading ?? ''}`}>Our Work in Action</h2>
                                <div className="mt-2 pt-1">
                                    <Link className={`eclick-btn-viewBtn white-btn ${Styles.viewBtn ?? ''}`} href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies`}>
                                        <span className={Styles.icon}>
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                        <em>View Full Case Study</em>
                                    </Link>
                                </div>
                            </div>
                            <Tabcontainer data={data} />
                        </div>
                    </Container>
                </div>
            ) : (
                <Skeleton />
            )}
        </>
        
    )
}

export default Workaction
