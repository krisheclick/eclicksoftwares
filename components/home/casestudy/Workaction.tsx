"use client";
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import Tabcontainer from './Tabcontainer';
import Styles from './style.module.css';
import Skeleton from '@/components/common/Skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Tabskeleton from './Tabskeleton';

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

    const fetchAPI = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category/with-projects`);
            const { response_data } = await response.json();
            setData(response_data);
        } catch (err: unknown) {
            console.log('Case Study API is something Error:', (err as Error).message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <div className={`sectionArea ${Styles.sectionArea}`}>
            <Container className='container-full'>
                <div className={Styles.section_wrapper}>
                    <div className={`section-content text-white full d-lg-flex align-items-start justify-content-between gap-3 ${Styles.section_content ?? ''}`}>
                        {!hasLoading ? (
                            <>
                                <h2 className={`heading mb-0 ${Styles.heading ?? ''}`}>Our Work in Action</h2>
                                <div className="mt-2 pt-1">
                                    <Link className={`eclick-btn-viewBtn white-btn ${Styles.viewBtn ?? ''}`} href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies`}>
                                        <span className={Styles.icon}>
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </span>
                                        <em>View Full Case Study</em>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Skeleton />
                                <div className="skeleton p-1" style={{ width: 220 }}>
                                    <span className="skeleton" style={{ width: 40, height: 40 }}></span>
                                    <em className="skeleton"></em>
                                </div>
                            </>
                        )}
                    </div>
                    {!hasLoading ? (
                        <Tabcontainer data={data} />
                    ) : (
                        <Tabskeleton />
                    )}
                </div>
            </Container>
        </div>

    )
}

export default Workaction
