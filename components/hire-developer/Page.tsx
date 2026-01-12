"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Counters from "@/components/counters/Counters";
import Banner from "@/components/hire-developer/banner/Banner";
import Content from "./why-hire/Content";
import Developer from "./Developer";
import Image from "next/image";
import Link from "next/link";
import Faq from "./faq/Faq";
import Styles from "./style.module.css";


interface BannerData {
    wkx5_heading?: string;
    wkx5_sub_heading?: string;
    wkx5_description?: string;
    wkx5_button_name?: string;
    wkx5_button_link?: string;
    wkx5_image?: string;
}
interface UspData {
    usp_feature_image_path?: string;
    usp_title?: string;
    usp_short_description?: string;
    usp_description?: string;
}
interface UspItem {
    usp_category_title?: string;
    usp_category_description?: string;
    usps?: UspData[] | undefined;
}
interface Technology {
    technology_feature_image_path?: string;
    technology_title?: string;
}
interface FaqItem {
    faq_title?: string;
    faq_description?: string;
}
interface FAQContent {
    yt43_heading?: string;
    yt43_description?: string;
}
interface TeamData {
    team_feature_image_path?: string;
    team_title?: string;
    team_rating?: string;
    team_designation?: string;
}
interface RepeaterItem {
    title?: string;
    description?: string;
}
interface TechnologySection {
    "1ej0_heading"?: string;
    "1ej0_description"?: string;
}
interface CounterData {
    "8xix_heading"?: string;
    "8xix_description"?: string;
}
interface DataItem {
    heading?: string;
    pages_custom_field?: string;
    usp_categorys?: UspItem[];
    page_repeater_data?: unknown;
    counter_data?: unknown;
    technologies?: Technology[] | undefined;
    faqs?: FaqItem[];
    recommend_team?: TeamData[];
    top_pick_team?: TeamData;
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


const Hiredata = () => {
    const [data, setData] = useState<DataItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [banner, setBanner] = useState<BannerData>();
    const [developerData, setDeveloperData] = useState<UspItem | null | undefined>();
    const [designerData, setDesignerData] = useState<UspItem | null | undefined>();
    const [technologySection, setTechnologySection] = useState<TechnologySection | null | undefined>(null);
    const [counterContent, setCounterContent] = useState<CounterData | null>(null);
    const [faqContent, setFaqContent] = useState<FAQContent | null>(null);


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/hire-developers`)
            .then((res) => res.json())
            .then((json) => setData(json.response_data))
            .finally(() => setLoading(false));
    }, []);


    useEffect(() => {
        if (!data) return;
        if (data?.pages_custom_field) {
            try {
                const customResponse = JSON.parse(data?.pages_custom_field ?? "{}");
                const response = customResponse.group_name;
                
                setBanner(response.banner);
                setTechnologySection(response?.technology);
                setCounterContent(response?.counter)
                setFaqContent(response?.faq)

            } catch (err: unknown) {
                console.log('Custom fields data is something wrong: ', (err as Error).message);
            }
        }

        setDeveloperData(data.usp_categorys?.[0] ?? null);
        setDesignerData(data.usp_categorys?.[1] ?? null);

    }, [data]);

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    if (!data) return null;
    
        console.log('response', counterContent)

    /* ---------- PARSED DATA ---------- */
    const repeaterData = parseToArray(data.page_repeater_data);
    const counterData = parseToArray(data.counter_data);
    const technologies = data.technologies ?? [];

    const faqs = data.faqs ?? [];

    console.log(counterContent);
    return (
        <div className={Styles.papasudipda}>
            <Banner
                hasLoading={loading}
                data={banner}
                recommend_team={data?.recommend_team}
                top_pick_team={data?.top_pick_team}
            />

            {repeaterData.length > 0 && (
                <Content hasLoading={loading} data={repeaterData} />
            )}

            {developerData && (
                <Developer
                    hasLoading={loading} data={developerData}
                />
            )}

            {designerData && (
                <Developer
                    hasLoading={loading} data={designerData}
                    whiteClass={true} separateText={true}
                />
            )}

            {technologies.length > 0 && (
                <div className={Styles.techSectionsam}>
                    <Container>
                        <div className={Styles.hwdfulltextbox}>
                            <div className={Styles.hwdfulltextbox}>
                                <h2 className={`${Styles.hwdtilte} ${Styles.hwdtectilte}`}>
                                    {technologySection?.["1ej0_heading"]}
                                </h2>

                                <div
                                    className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}
                                    dangerouslySetInnerHTML={{
                                        __html: technologySection?.["1ej0_description"] || ""
                                    }}
                                />

                            </div>
                        </div>
                        <div className={Styles.techcmb}>
                            <Row className={Styles.row}>
                                {technologies.map((item, index) => (
                                    <Col key={index} lg={3} md={4} xs={6}>
                                        <div className={Styles.techCardsbx}>
                                            <figure className={Styles.techcardimg}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item?.technology_feature_image_path}`}
                                                    alt={item.technology_title || ""}
                                                    fill
                                                    priority
                                                />
                                            </figure>
                                            <div className={Styles.techstitle}>{item.technology_title}</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Container>
                </div>
            )}

            {
                counterContent && (
                <div className={Styles.counter_section}>
                    <Container>
                        <div className={`section-content ${Styles.section_content ?? ''}`}>
                            {!loading ? (
                                <>
                                    <div className={`title fw-bold ${Styles.title ?? ''}`}
                                        dangerouslySetInnerHTML={{ __html: counterContent["8xix_heading"] || '' }}
                                    />
                                    <div
                                        dangerouslySetInnerHTML={{ __html: counterContent["8xix_description"] || '' }}
                                    />
                                </>
                            ) : (
                                <>
                                    {counterContent['8xix_heading'] && (
                                        <div className="skeleton skeletonSmallTitle"></div>
                                    )}
                                    <div className={Styles.skeletonTitleWrapper}>
                                        <div className={`skeleton w-100 mb-2 ${Styles.skeletonTitle}`}></div>
                                        <div className={`skeleton w-50 ${Styles.skeletonTitle}`}></div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* <Counters hasLoading={loading} counters={counterData} /> */}
                    </Container>
                </div>

                )
            }

            {/* ================= FAQ ================= */}
            {faqs?.length > 0 && (
                <div className={`sectionArea ${Styles.faqSectionsam ?? ''}`}>
                    <Container>
                        <Row className={Styles.row}>
                            <Col lg={5}>
                                <div className={Styles.hmfaq_tpbx}>
                                    <h2 className={Styles.hwdtilte}>{faqContent?.yt43_heading}</h2>
                                    <div className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}
                                        dangerouslySetInnerHTML={{ __html: faqContent?.yt43_description || '' }}
                                    />
                                    <Link href="#" className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}>
                                        <span>
                                            <Image
                                                className="auto-img"
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                alt="Schedule a Call"
                                                width={21} height={21}
                                                priority={true}
                                            />
                                        </span>
                                        <em>Schedule a Call</em>
                                    </Link>
                                </div>
                            </Col>

                            <Col lg={7}>
                                <Faq hasLoading={loading} data={faqs} />
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </div>
    );
};

export default Hiredata;