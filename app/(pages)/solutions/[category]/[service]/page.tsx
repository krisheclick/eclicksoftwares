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
import Process from "@/components/organization/Process";
import Styles from "./style.module.css";
import NotFound from "@/app/not-found";

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
    related_solutions_title?: string;
    related_solutions_heading?: string;
}
interface WhoWeAreData {
    name?: string;
    q2jf_title?: string;
    q2jf_short_description?: string;
}

interface WhatWeDoData {
    name?: string;
    oitk_title?: string;
    oitk_heading?: string;
}

interface CounterItem {
    site_counter_number: number;
    site_counter_simbol?: string;
    site_counter_title?: string;
    site_counter_icon?: string;
}
interface DataItem {
    "who-we-are"?: WhoWeAreData;
    "what-we-do"?: WhatWeDoData;
    counter_data?: CounterItem[];
    pages_custom_field?: DataItem;
}

const parseToArray = (value: unknown): unknown[] => {
    try {
        if (value == null) return [];

        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [parsed];

    } catch {
        return [];
    }
};
export default function Page({ params }: { params: Promise<{ category: string, service: string }> }) {
    const [isLoading, setLoading] = useState(true);
    const [pageFound, setPageFound] = useState(false);
    const [data, setData] = useState<Service | null>(null);
    const [commonData, setCommonData] = useState<DataItem | null | undefined>(null);
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
                const {response_code, response_data} = await response.json();

                if (response_code === false) {
                    setPageFound(true)
                    console.log("API response_code is false");
                }
                setData(response_data);
            } catch (err: unknown) {
                console.log("API error:", (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/service-details`);
                const { response_data } = await response.json();
                setCommonData(response_data);
            } catch (err: unknown) {
                console.log('Common Data is something wrong: ', (err as Error).message)
            }
        }

        fetchData();
        fetchDetails();
    }, [params]);

    const pageCustomField = commonData?.pages_custom_field
        ? JSON.parse(commonData.pages_custom_field as string)
        : null;

    const groupName = pageCustomField?.group_name;


    const counterData: CounterItem[] = Array.isArray(commonData?.counter_data)
        ? commonData.counter_data
        : parseToArray(commonData?.counter_data) as CounterItem[];

    return (
        pageFound ? (
            <NotFound />
        ) : (
            <div>
                <Banner isLoading={isLoading} title={data?.service_title} subtitle={data?.service_sub_title} image={data?.service_banner_image_path} short_description={data?.service_short_description} />

                <div className={`sectionArea ${Styles.aboutArea ?? ''}`}>
                    <Container>
                        <Row className="gx-xl-5">
                            <Col lg={6}>
                                {!isLoading ? (
                                    <figure className={Styles.aboutPoster}>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data?.service_details_image_path ?? ''}`}
                                            alt="About Poster"
                                            width={915} height={684}
                                            priority={true}
                                        />
                                    </figure>
                                ) : (
                                    <div className={`skeleton ${Styles.aboutPoster}`}></div>
                                )}
                            </Col>
                            <Col lg={6} className="align-self-center">
                                <div className="ps-xl-4">
                                    <div className={Styles.about_content}>
                                        {!isLoading ? (
                                            <div className={Styles.content}>
                                                <h1 className={`title ${Styles.title ?? ''}`} dangerouslySetInnerHTML={{
                                                    __html: data?.service_details_title ?? ''
                                                        .replace(/Â+/g, "")
                                                        .replace(/\s+/g, " ")
                                                        .trim(),
                                                }} />
                                                <div className={`editorText ${Styles.editorText ?? ''}`} dangerouslySetInnerHTML={{
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
                {data?.wcp && data.wcp.length > 0 && <WhatWeDo isLoading={isLoading} data={data} title={data?.service_title} services={data.wcp} />}
                <CalltoAction spaceClass='callToAction' content={{ 'tpdc_title': data?.service_tagline }} isLoading={isLoading} />
                <Process
                    isLoading={isLoading}
                    process_title={data?.heading_process_step ?? ''}
                    process_steps={data?.process_steps ?? []}
                />
                {groupName && (
                    <WhoWeAre data={groupName["who-we-are"]} counterData={counterData} />
                )}
                <Clients classValue="fullBox" />
            </div>
        )
    );
}
