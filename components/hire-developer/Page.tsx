"use client";
import { useEffect, useState } from "react";
import Banner from "@/components/hire-developer/banner/Banner";
import HireBannerSkeleton from "./banner/HireBannerSkeleton";
import { useHireModal, useLetsConnect } from "@/utils/useLetsConnect";
import Content from "./why-hire/Content";
import HireModal from "./HireModal";
import Developer from "./Developer";
import { Col, Container, Row } from "react-bootstrap";
import TechCard from "./card/TechCard";
import TechCardSkeleton from "./card/TechCardSkeleton";
import Counters from "../counters/Counters";
import Image from "next/image";
import Faq from "./faq/Faq";
import Styles from "./style.module.css";

type BannerItem = {
    wkx5_heading?: string;
    wkx5_sub_heading?: string;
    wkx5_description?: string;
    wkx5_button_name?: string;
    wkx5_button_link?: string;
    wkx5_image?: string;
}
type GroupData = {
    banner?: BannerItem;
    technology?: {
        "1ej0_heading"?: string;
        "1ej0_description"?: string;
    };
    counter?: {
        "8xix_heading"?: string;
        "8xix_description"?: string;
    };
    faq?: {
        "yt43_heading"?: string;
        "yt43_description"?: string;        
    }
}
type CustomFieldData = {
    group_name?: GroupData;
}
type TeamData = {
    team_feature_image_path?: string;
    team_title?: string;
    team_designation?: string;
    team_rating?: string;
}
type RepeaterData = {
    title?: string;
    description?: string;
}
type CounterItem = {
    site_counter_number: number;
    site_counter_simbol?: string;
    site_counter_title?: string;
    site_counter_icon?: string;
}
type UspItem = {
    usp_feature_image_path?: string;
    usp_title?: string;
    usp_description?: string;
}
type USPCategory = {
    usp_category_title?: string;
    usp_category_description?: string;
    usps?: UspItem[];
}
type RootData = {
    heading?: string;
    page_feature_image?: string;
    short_description?: string;
    page_title?: string;
    description?: string;
    common_banner?: string;
    pages_custom_field?: CustomFieldData;
    recommend_team?: TeamData[];
    top_pick_team?: TeamData;
    page_repeater_data?: RepeaterData[];
    counter_data?: CounterItem[];
    usp_categorys?: USPCategory[];
    technologies?: {
        technology_feature_image_path?: string;
        technology_title?: string;
    }[];
    faqs?: {
        faq_title?: string;
        faq_description?: string;
    }[];
    
}
const Page = () => {
    const { openLetsConnectModal } = useLetsConnect();
    const { showHireModal, setShowHireModal, openHireModal } = useHireModal();

    const [isLoading, setHasLoading] = useState(true);
    const [data, setData] = useState<RootData | null>(null);

    const dataFetch = async () => {
        try {
            setHasLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/hire-developers`);
            const { response_data } = await response.json();
            setData(response_data);

        } catch (err: unknown) {
            console.log('Hire Page api is something wrong: ', (err as Error).message);
        } finally {
            setHasLoading(false);
        }
    }

    useEffect(() => {
        dataFetch();
    }, []);

    /* =========== Array Data Parse Custom Field =========== */
    const parseToArray = <Text extends object>(value: unknown): Text[] => {
        try {
            if (!value) return [];

            const parseData = typeof value === "string" ? JSON.parse(value) : value;
            return (Array.isArray(parseData) ? parseData : [parseData]) as Text[];

        } catch (parseErr: unknown) {
            console.log('Data Perse is: ', (parseErr as Error).message);
            return [];
        }
    }

    /* =========== Custom Field Data Parse Custom Field =========== */
    const safeParse = <Text extends object>(value: unknown): Text | null => {
        try {
            if (!value) return null;

            return (typeof value === "string" ? JSON.parse(value) : value) as Text;
        } catch (parseErr: unknown) {
            console.log('Data Perse is: ', (parseErr as Error).message);
            return null;
        }
    }

    // Custom Data
    const customData = safeParse<CustomFieldData>(data?.pages_custom_field);
    const repeateData = parseToArray<RepeaterData>(data?.page_repeater_data);
    const uspData = parseToArray<USPCategory>(data?.usp_categorys);
    const technologySection = customData?.group_name?.technology;
    const counterContent = customData?.group_name?.counter;
    const counterData: CounterItem[] = parseToArray<CounterItem>(data?.counter_data);
    const faqContent = customData?.group_name?.faq;

    const uspOptions = uspData[0]?.usps?.map((usp) => ({
        label: usp.usp_title || "",
        value: usp.usp_title || ""
    })) || [];

    return (
        <div className={`hire-page ${Styles.hire_page}`}>
            {!isLoading ? (
                <Banner
                    data={customData?.group_name?.banner ?? undefined}
                    recommend_team={data?.recommend_team}
                    top_pick_team={data?.top_pick_team}
                    onHireClick={() => openHireModal()}
                />
            ) : (
                <HireBannerSkeleton />
            )}
            <Content
                hasLoading={isLoading}
                data={repeateData ?? undefined}
            />

            <Developer
                hasLoading={isLoading}
                data={uspData[0]}
            />

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
                        <Row className={`rowGap ${Styles.techRow ?? ''}`}>
                            {!isLoading ? (
                                <TechCard
                                    data={data?.technologies}
                                />
                            ) : (
                                <TechCardSkeleton />
                            )}
                        </Row>
                    </div>
                </Container>
            </div>

            <div className={Styles.counter_section}>
                <Container>
                    <div className={`section-content w-75 ${Styles.counter_content ?? ''}`}>
                        {!isLoading ? (
                            <>
                                <div className={`title ${Styles.title ?? ''}`}
                                    dangerouslySetInnerHTML={{ __html: counterContent?.["8xix_heading"] || '' }}
                                />
                                <div
                                    dangerouslySetInnerHTML={{ __html: counterContent?.["8xix_description"] || '' }}
                                />
                            </>
                        ) : (
                            <>
                                <div className="skeleton skeletonSmallTitle"></div>
                                <div className={Styles.skeletonTitleWrapper}>
                                    <div className={`skeleton w-100 mb-2 ${Styles.skeletonTitle}`}></div>
                                    <div className={`skeleton w-50 ${Styles.skeletonTitle}`}></div>
                                </div>
                            </>
                        )}
                    </div>
                    <Counters hasLoading={isLoading} counters={counterData} />
                </Container>
            </div>

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
                            <Faq hasLoading={isLoading} data={data?.faqs} />
                        </Col>
                    </Row>
                </Container>
            </div>

            <HireModal
                show={showHireModal}
                onHide={() => setShowHireModal(false)}
                title="Hire Developers - Get Started"
                uspOptions={uspOptions}
            />
        </div>
    )
}

export default Page;