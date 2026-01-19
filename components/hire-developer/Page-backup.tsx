"use client";
import { useEffect, useState } from "react";
import { useLetsConnect, useHireModal } from "@/utils/useLetsConnect";
import Banner from "@/components/hire-developer/banner/Banner";
import Content from "./why-hire/Content";
import Styles from "./style.module.css";
import HireModal from "./HireModal";
import HireBannerSkeleton from "./banner/HireBannerSkeleton";
import Developer from "./Developer";
import { Col, Container, Row } from "react-bootstrap";
import Faq from "./faq/Faq";
import Image from "next/image";
import CustomImage from "@/utils/CustomImage";

interface RepeaterData {
    title?: string;
    description?: string;
}
interface TeamData {
    team_feature_image_path?: string;
    team_title?: string;
    team_rating?: string;
    team_designation?: string;
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
type CounterItem = {
    site_counter_number: number;
    site_counter_simbol?: string;
}
interface PageObjectData {
    heading?: string;
    page_feature_image?: string;
    short_description?: string;
    page_title?: string;
    description?: string;
    pages_custom_field?: string;
    page_repeater_data?: RepeaterData[];
    recommend_team?: TeamData[];
    top_pick_team?: TeamData;
    usp_categorys?: UspItem[];
    counter_data?: CounterItem[];
    technologies?: Technology[] | undefined;
    faqs?: FaqItem[];
}
interface BannerData {
    wkx5_heading?: string;
    wkx5_sub_heading?: string;
    wkx5_description?: string;
}
interface Groupdata {
    banner?: BannerData;
}
const Page = () => {
    const { openLetsConnectModal } = useLetsConnect();
    const { showHireModal, setShowHireModal, openHireModal } = useHireModal();

    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<PageObjectData | null>(null);
    const [groupData, setGroupData] = useState<Groupdata | null>(null);
    const [developerData, setDeveloperData] = useState<UspItem | null | undefined>();
    const [designerData, setDesignerData] = useState<UspItem | null | undefined>();
    const [technologySection, setTechnologySection] = useState<TechnologySection | null | undefined>(null);
    const [counterContent, setCounterContent] = useState<CounterData | null>(null);
    const [faqContent, setFaqContent] = useState<FAQContent | null>(null);

    // Api Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/hire-developers`);
            const { response_data } = await response.json();
            setData(response_data);
        } catch (err: unknown) {
            console.log('Hire Developer API is something wrong: ', (err as Error).message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Parse Data 
    useEffect(() => {
        if (data) {
            if (data?.pages_custom_field) {
                try {
                    const customData = JSON.parse(data?.pages_custom_field).group_name;
                    setGroupData(customData);
                    setTechnologySection(customData?.technology);
                    setCounterContent(customData?.counter)
                    setFaqContent(customData?.faq)
                } catch (gropError: unknown) {
                    console.log('Group Data Parse is something : ', (gropError as Error).message)
                }
            }

            setDeveloperData(data.usp_categorys?.[0] ?? null);
            setDesignerData(data.usp_categorys?.[1] ?? null);
        }
    }, [data]);

    const repeaterData: RepeaterData[] = data?.page_repeater_data ? JSON.parse(data.page_repeater_data as unknown as string) : [];

    const counterData: CounterItem[] = Array.isArray(data?.counter_data)
        ? data.counter_data
        : parseToArray(data?.counter_data) as CounterItem[];

    // Generate USP options from developer data
    const uspOptions = developerData?.usps?.map((usp) => ({
        label: usp.usp_title || "",
        value: usp.usp_title || ""
    })) || [];

    const technologies = groupData.technologies ?? [];
    const faqs = data.faqs ?? [];

    return (
        <div className="hire-page">
            {!hasLoading ? (
                <Banner
                    data={groupData?.banner}
                    recommend_team={data?.recommend_team}
                    top_pick_team={data?.top_pick_team}
                    onHireClick={() => openHireModal()}
                />
            ) : (
                <HireBannerSkeleton />
            )}
            <Content hasLoading={hasLoading} data={repeaterData} />
            {developerData && (
                <Developer
                    hasLoading={hasLoading} data={developerData}
                />
            )}
            {technologies.length > 0 && (
                <div className={`${Styles.techSectionsam}`}>
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
                                            <CustomImage
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item?.technology_feature_image_path}`}
                                                alt={item.technology_title}
                                                className={Styles.techcardimg}
                                            />
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
                            <div className={`section-content w-75 ${Styles.counter_content ?? ''}`}>
                                {!loading ? (
                                    <>
                                        <div className={`title ${Styles.title ?? ''}`}
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
                            <Counters hasLoading={loading} counters={counterData} />
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
                                    <button
                                        type="button"
                                        onClick={() => openLetsConnectModal('general_lets_connect')}
                                        className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}
                                    >
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
                                    </button>
                                </div>
                            </Col>

                            <Col lg={7}>
                                <Faq hasLoading={hasLoading} data={faqs} />
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}

            {/* Hire Modal */}
            <HireModal
                show={showHireModal}
                onHide={() => setShowHireModal(false)}
                title="Hire Developers - Get Started"
                uspOptions={uspOptions}
            />
        </div>
    )
}

export default Page
