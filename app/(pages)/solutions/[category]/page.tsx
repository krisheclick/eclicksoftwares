"use client";

import { useEffect, useState } from "react";
import Styles from "./style.module.css";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";


type ServiceItem = {
    service_feature_image_path: string | null;
    service_title: string;
    service_slug: string;
    service_short_description: string | null;
    service_feature_image: string | null;    
    service_icon: string;
    service_icon_path: string;
}

type Pagination = {
    total: number;
    per_page: string;
    current_page: number;
    totalPages: number;
    has_next: boolean;
    has_prev: boolean;
}

type ServiceCategory = {
    service_category_title: string;
    service_category_slug: string;
    service_category_short_description: string;
    service_category_description: string;
    service_category_feature_image: string;
    service_category_feature_image_path: string;
    service_category_banner: string;
    service_category_banner_path: string;
    services: ServiceItem[];
}


export default function Page({ params }: { params: Promise<{ category: string }> }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<ServiceCategory | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { category } = await params;
                const API = `${process.env.NEXT_PUBLIC_API_URL}/services?category=${category}&limit=20`;
                const response = await fetch(API);
                if (!response.ok) {
                    throw new Error("API data is not ok. Please check & fixed...");
                }
                const data = await response.json();

                // if (data.response_code === false) {
                //     console.error("API response_code is false");
                //     setError("Failed to fetch valid data");
                //     return;
                // }
                setData(data.response_data);
            } catch (err) {
                console.error("API error:", (err as Error).message);
                setError("An error occurred while fetching the data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params])

    return (
        <>
            <div className={Styles.banner}>
                <Container>
                    <Row className={`gx-0 ${Styles.row}`}>
                        <Col lg={5} xxl={4} className="align-self-center">
                            <div className={Styles.bannerText}>
                                <h2 className={Styles.bannerTitle}>Services We Provide <span className="d-block">{data?.service_category_title}</span></h2>
                                <div className={Styles.bannerContent} dangerouslySetInnerHTML={{
                                    __html: data?.service_category_short_description??''
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }}/>
                                <div className={Styles.btn_wrap}>
                                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}`} className={`eclick-btn-connect ${Styles.bannerBtn ?? ''}`}>
                                        <span className={Styles.phoneIcon}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                alt="Conversation"
                                                width={22} height={21}
                                                loading="lazy"
                                            />
                                        </span>
                                        <em>Schedule a Call</em>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                        <Col lg={7} xxl={8}>
                            <figure className={Styles.poster}>
                                <Image
                                    className={Styles.posterImg}
                                    src={
                                        data?.service_category_banner_path
                                            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${data.service_category_banner_path}`
                                            : '/poster.jpg'
                                    }
                                    alt={data?.service_category_title || 'Service Image'}
                                    fill
                                    priority
                                />
                                <Image
                                    className={Styles.brandLogo}
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/brand-logo.png`}
                                    alt={'Service Image'}
                                    width={126}
                                    height={126}
                                    priority
                                />
                            </figure>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={Styles.sectionArea}>
                <Container>
                    <div className={Styles.serviceContent}>
                        <div>
                            <h1 className={`title ${Styles.title ?? ''}`}>Technology challenges</h1>
                            <p>With a team of 100+ and 16 years experience</p>
                        </div>
                        <div className={Styles.contentBtn}>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}`} className={`eclick-btn-work transparent-btn ${Styles.actionBtn ?? ''}`}>Let’s Work Together</Link>
                        </div>
                    </div>
                    <div className={Styles.serviceList}>
                        {data?.services.map((service, index) => (
                        <Row key={index} className={`gx-lg-5  ${Styles.serviceRow} ${index % 2 !== 0 ? Styles.rowReverse : ''}`}>
                            <Col lg={7} xl={7} >
                                <figure className={Styles.servicePoster}>
                                    <Image
                                        className="auto-img"
                                        src={
                                            service?.service_feature_image_path
                                                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${service.service_feature_image_path}`
                                                : '/Rectangle 2.png'
                                        }
                                        alt={service?.service_title || 'Service Image'}
                                        fill
                                        priority
                                    />
                                </figure>
                            </Col>                
                            <Col lg={5} xl={5} className="align-self-center" >
                                <div className={`${Styles.box} ${index === 1 ? Styles.active : ''}`}>
                                    <div className={Styles.boxText}>
                                        <figure className={Styles.serviceIcon}>
                                            <Image
                                                className="auto-img"
                                                src={
                                                    service?.service_icon_path
                                                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${service.service_icon_path}`
                                                        : '/Rectangle 2.png'
                                                }
                                                alt={service?.service_title || 'Service Image'}
                                                width={384}
                                                height={255}
                                                priority
                                            />
                                        </figure>
                                        <div className={`subheading ${Styles.subheading}`}>
                                            {service.service_title}
                                        </div>
                                        <div className={Styles.content} dangerouslySetInnerHTML={{
                                            __html: service?.service_short_description??''
                                            .replace(/Â+/g, "")
                                            .replace(/\s+/g, " ")
                                            .trim(),
                                        }}/>
                                        <Link href={`/solutions/${data.service_category_slug}/${service.service_slug}`} className={`eclick-btn-view ${Styles.viewBtn}`}>Learn More</Link>
                                    </div>
                                    
                                </div>
                            </Col>                        
                        </Row>
                        ))}
                    </div>
                </Container>
            </div>
        </>
    )
}
