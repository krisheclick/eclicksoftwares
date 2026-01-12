"use client";
// import Clients from "@/components/clients/Clients";
// import Banner from "@/components/common/banner/Banner";
// import Technologies from "@/components/solutions/Technologies";
// import CalltoAction from "@/components/home/CalltoAction";
// import WhoWeAre from "@/components/whoweare/WhoWeAre";
// import WhatWeDo from "@/components/whatwedo/WhatWeDo";
// import Trustownership from "@/components/solutions/Trustownership";
// import Organization from "@/components/organization/Organization";
import { useEffect, useState } from "react";
import Styles from "./style.module.css";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import ScheduleCall from "@/components/schedule-a-call/ScheduleCall";

type PageCustomField = {
    group_name: {
        [key: string]: {
            name: string;
            is_component: string;
            lhfg_title: string;
            lhfg_sub_title: string;
            lhfg_short_description: string;
            lhfg_image: string;
        };
    };
    slug: string;
}

type ResponseData = {
    heading: string;
    page_feature_image: string | null;
    short_description: string;
    description: string;
    pages_custom_field: string;
    custom_fields?: PageCustomField;
}
type ServiceCategory = {
    service_category_feature_image_path: string;
    service_category_icon_path: string;
    service_category_title: string;
    service_category_slug: string;
    service_category_feature_image: string;
    service_category_short_description: string;
    service_category_icon: string;
}
type BannerData = {
  lhfg_title: string;
  lhfg_sub_title: string;
  lhfg_short_description: string;
  lhfg_image: string;
}

export default function Page() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<ServiceCategory[] | null>([]);
    const [cmsdata, setCmsData] = useState<ResponseData | null>(null);
    const [bannerContent, setBannerContent] = useState<BannerData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [action, setaction] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const PAGE_API = `${process.env.NEXT_PUBLIC_API_URL}page/solutions`;
                const pase_response = await fetch(PAGE_API);
                if (!pase_response.ok) {
                    throw new Error("API data is not ok. Please check & fixed...");
                }
                const page_data = await pase_response.json();
                if (page_data.response_code === false) {
                    console.error("API response_code is false");
                    setError("Failed to fetch valid data");
                    return;
                }
                setCmsData(page_data.response_data);

                const API = `${process.env.NEXT_PUBLIC_API_URL}category`;
                const response = await fetch(API);
                if (!response.ok) {
                    throw new Error("API data is not ok. Please check & fixed...");
                }
                const data = await response.json();

                if (data.response_code === false) {
                    console.error("API response_code is false");
                    setError("Failed to fetch valid data");
                    return;
                }
                setData(data.response_data);
            } catch (err) {
                console.error("API error:", (err as Error).message);
                setError("An error occurred while fetching the data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (cmsdata) {
            if (cmsdata.pages_custom_field) {
                try {
                    const custom_field_data = JSON.parse(cmsdata.pages_custom_field).group_name;
                    setBannerContent(custom_field_data['banner-section-management']);
                } catch (err) {
                    console.error('Error parsing custom field data:', err);
                }
            }
        }
    }, [cmsdata]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <>
        <div className={Styles.banner}>
            <Container>
                <Row className={`gx-0 ${Styles.row}`}>
                    <Col lg={5} xxl={4} className="align-self-center">
                        <div className={Styles.bannerText}>
                            <h2 className={Styles.bannerTitle}>{bannerContent?.lhfg_title} <span className="d-block">{bannerContent?.lhfg_sub_title}</span></h2>
                            <div className={Styles.bannerContent} dangerouslySetInnerHTML={{
                                __html: bannerContent?.lhfg_short_description ?? ''
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                            }} />
                            <div className={Styles.btn_wrap}>
                                <button onClick={() => {setShowScheduleModal(true); setaction('general_schedule_a_call');}} className={`eclick-btn-connect ${Styles.bannerBtn ?? ''}`}>
                                    <span className={Styles.phoneIcon}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                            alt="Conversation"
                                            width={22} height={21}
                                            loading="lazy"
                                        />
                                    </span>
                                    <em>Schedule a Call</em>
                                </button>
                            </div>
                        </div>
                    </Col>
                    <Col lg={7} xxl={8}>
                        <figure className={Styles.poster}>
                            <Image
                                className={Styles.posterImg}
                                src={
                                    bannerContent?.lhfg_image
                                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${bannerContent.lhfg_image}`
                                        : '/poster.jpg'
                                }
                                alt={bannerContent?.lhfg_title || 'Service Image'}
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
                    {data?.map((category, index) => (
                    <Row key={index} className={`gx-lg-5  ${Styles.serviceRow} ${index % 2 !== 0 ? Styles.rowReverse : ''}`}>
                        <Col lg={7} xl={7} >
                            <figure className={Styles.servicePoster}>
                                <Image
                                    className="auto-img"
                                    src={
                                        category?.service_category_feature_image_path
                                            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${category.service_category_feature_image_path}`
                                            : '/Rectangle 2.png'
                                    }
                                    alt={category?.service_category_title || 'Service Image'}
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
                                                category?.service_category_icon_path
                                                    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${category.service_category_icon_path}`
                                                    : '/Rectangle 2.png'
                                            }
                                            alt={category?.service_category_title || 'Service Image'}
                                            width={384}
                                            height={255}
                                            priority
                                        />
                                    </figure>
                                    <div className={`subheading ${Styles.subheading}`}>
                                        {category.service_category_title}
                                    </div>
                                    <div className={Styles.content} dangerouslySetInnerHTML={{
                                        __html: category?.service_category_short_description??''
                                        .replace(/Â+/g, "")
                                        .replace(/\s+/g, " ")
                                        .trim(),
                                    }}/>
                                    <Link href={category.service_category_slug} className={`eclick-btn-view ${Styles.viewBtn}`}>Learn More</Link>
                                </div>
                            </div>
                        </Col>                        
                    </Row>
                    ))}
                </div>
            </Container>
        </div>
        <ScheduleCall show={showScheduleModal} action={action} onHide={() => setShowScheduleModal(false)} services={data?.map(cat => cat.service_category_title)} />
        </>
    )
}