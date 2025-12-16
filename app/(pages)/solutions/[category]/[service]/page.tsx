"use client";
import Clients from "@/components/clients/Clients";
import Banner from "@/components/common/banner/Banner";
import Technologies from "@/components/solutions/Technologies";
import CalltoAction from "@/components/home/CalltoAction";
import WhoWeAre from "@/components/whoweare/WhoWeAre";
import WhatWeDo from "@/components/whatwedo/WhatWeDo";
import Trustownership from "@/components/solutions/Trustownership";
import Organization from "@/components/organization/Organization";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import { useThemeContext } from "@/context/ThemeContext";
import Styles from "./style.module.css";
import Process from "@/components/organization/Process";

type ServiceCta = {
    cta_title: string;
    cta_description: string;
    cta_image: string;
}

type ValuePoint = {
    title: string;
    filename: string;
}

type ProcessStep = {
    filename: string;
    name: string;
    title: string;
    description: string;
}

type Technology = {
    technology_feature_image_path: string;
    technology_title: string;
    technology_feature_image: string;
}

type ServiceSeo = {
    og_image_path: string;
    meta_title: string;
    meta_keywords: string;
    meta_descriptions: string;
    meta_robots: string;
    og_image: string;
}

type Category = {
    service_category_title: string;
    service_category_slug: string;
}
type services = {
    wcp_title: string;
    wcp_slug: string;
    wcp_short_description: string;
    wcp_icon_path: string;
    wcp_icon: string;
}

type Project = {
    proj_feature_image_path: string;
    proj_responsive_image_1_path?: string;
    proj_responsive_image_2_path?: string;
    proj_name: string;
    proj_slug: string;
    proj_short_desc: string;
    proj_tools_used: string
}
type Usp = {
    service_usp_feature_image_path: string;
    service_usp_title?: string;
}
type Service = {
    service_title: string;
    service_sub_title: string;
    service_slug: string;
    service_short_description: string;
    service_tagline: string;
    service_details_title: string;
    service_description: string;
    service_feature_image_path: string;
    service_banner_image_path: string;
    service_details_image_path: string;
    service_cta: ServiceCta;
    value_points: ValuePoint[];
    heading_proposition: string;
    process_steps: ProcessStep[];
    heading_process_step: string;
    wcp: services[];
    Category: Category;
    heading_technology: string;
    technologies: Technology[];
    ServiceSeo: ServiceSeo;
    ParentService: { service_title: string; service_slug: string; } | null;
    heading_portfolio: string;
    projects: Project[];
    usp: Usp[] | undefined;
}
export default function Page({ params }: { params: Promise<{ category: string, service: string }> }) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState<Service | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { setHeaderExtraClass } = useThemeContext();
    useEffect(() => {
        // Apply the header class ONLY for this page
        setHeaderExtraClass("");

        // Optional: cleanup when leaving this page
        return () => setHeaderExtraClass(null);
    }, [setHeaderExtraClass]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { service } = await params;
                const API = `${process.env.NEXT_PUBLIC_API_URL}services/${service}`;
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
    }, [params]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Banner isLoading={isLoading} title={data?.service_title} subtitle={data?.service_sub_title} image={data?.service_banner_image_path} short_description={data?.service_short_description} />

            <div className={`sectionArea ${Styles.aboutArea ?? ''}`}>
                <Container>
                    <Row>
                        <Col lg={6}>
                            <div className="stickyContent">
                                {!isLoading ? (
                                    <figure className={Styles.aboutPoster}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data?.service_details_image_path ?? ''}`}
                                            alt="About Poster"
                                            fill
                                            priority={true}
                                        />
                                    </figure>
                                ) : (
                                    <div className={`skeleton ${Styles.aboutPoster}`}></div>
                                )}
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="stickyContent">
                                <div className={Styles.about_content}>
                                    {!isLoading ? (
                                        <div className={Styles.content}>
                                            <h1 className={`title ${Styles.title ?? ''}`} dangerouslySetInnerHTML={{
                                                __html: data?.service_details_title ?? ''
                                                    .replace(/Â+/g, "")
                                                    .replace(/\s+/g, " ")
                                                    .trim(),
                                            }} />
                                            <div className={`editorText ${Styles.editorText}`} dangerouslySetInnerHTML={{
                                                __html: data?.service_description ?? ''
                                                    .replace(/Â+/g, "")
                                                    .replace(/\s+/g, " ")
                                                    .trim(),
                                            }} />

                                            {data?.usp && data.usp.length > 0 && (
                                                <div className={Styles.usp}>
                                                    {data.usp.map((item, index) => (
                                                        <div key={index} className={Styles.uspItem}>
                                                            <figure className={Styles.uspIcon}>
                                                                <Image
                                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.service_usp_feature_image_path}`}
                                                                    alt={item.service_usp_title ?? "USP image"}
                                                                    fill
                                                                    priority
                                                                />
                                                            </figure>
                                                            <div className={Styles.uspTitle}>{item.service_usp_title}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        </div>
                                    ) : (
                                        <>
                                            <div className="skeleton w-100 mb-2" style={{ height: 32 }}></div>
                                            <div className="skeleton w-75 mb-2" style={{ height: 32 }}></div>
                                            <div className="skeleton w-50 mb-4" style={{ height: 32 }}></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-50 mb-3"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-25 mb-3"></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Organization
                isLoading={isLoading}
                values_title={data?.heading_proposition ?? ''}
                value_points={data?.value_points ?? []}
            />
            {/* <Portfolio isLoading={isLoading} title={data?.heading_portfolio ?? ''} projects={data?.projects} /> */}
            <Technologies isLoading={isLoading} title={data?.heading_technology ?? ''} technologies={data?.technologies ?? []} />
            <Trustownership isLoading={isLoading} {...(data?.service_cta ?? { cta_title: '', cta_description: '', cta_image: '' })} />
            {data?.wcp && data.wcp.length > 0 && <WhatWeDo isLoading={isLoading} services={data.wcp} title={data?.service_title} />}
            <CalltoAction spaceClass='callToAction' content={{ 'tpdc_title': data?.service_tagline }} isLoading={isLoading} />
            <Process
                isLoading={isLoading}
                process_title={data?.heading_process_step ?? ''}
                process_steps={data?.process_steps ?? []}
            />
            <WhoWeAre />
            <Clients classValue="fullBox" />
        </div>
    );
}
