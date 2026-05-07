"use client";
import Banner from "@/components/our-partner/Banner";
import { useEffect, useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import List from "@/components/organization/List";
import Developer from "@/components/hire-developer/Developer";
import Faq from "@/components/hire-developer/faq/Faq";
import { useScheduleCall } from "@/utils/useLetsConnect";
import CustomImage from "@/utils/CustomImage";
import Styles from "./style.module.css";

type PageData = {
    id: number;
    heading: string;
    page_feature_image: string;
    short_description: string;
    page_title: string;
    description: string;
    pages_custom_field: string; // JSON string
    page_repeater_data: string;
    usp_categorys: UspCategory[];
    faqs: Faq[];
    counter_data: string; // JSON string
};

type UspCategory = {
    usp_category_title: string;
    usp_category_description: string;
    usps: Usp[];
};

type Usp = {
    usp_feature_image_path: string;
    usp_title: string;
    usp_short_description: string;
    usp_description: string;
    usp_feature_image: string;
};

type Faq = {
    faq_title: string;
    faq_description: string;
};


type PagesCustomField = {
    banner?: Banner;
    program?: Program;
    faq: CustomFaq;
    slug: string[];
};

type Banner = {
    name: string;
    is_compoment: string;
    z6hd_title: string;
    z6hd_short_description: string;
    z6hd_button_name: string;
    z6hd_button_link: string;
    z6hd_image: string;
};

type Program = {
    name: string;
    is_compoment: string;
    nplh_title_1: string;
    nplh_heading_1: string;
    nplh_description_1: string;
    nplh_title_2: string;
    nplh_heading_2: string;
    nplh_description_2: string;
};

type CustomFaq = {
    name: string;
    is_compoment: string;
    khft_title: string;
    khft_description: string;
    khft_button_name: string;
    khft_button_link: string;
};

const Partnerships = () => {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [hasLoading, setLoading] = useState(true);
    const [bannerData, setBannerData] = useState<Banner | null>(null);
    const [pageCustomField, setPageCustomField] = useState<PagesCustomField | null>(null);
    const [processData, setProcessData] = useState<UspCategory | null>(null);
    const { openScheduleModal } = useScheduleCall();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/our-partners`);
            const { response_data } = await response.json();

            setPageData(response_data);
        } catch (err: unknown) {
            console.error("Failed to fetch About Page:", (err as Error).message);
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (pageData) {
            if (pageData?.pages_custom_field) {
                try {
                    const customResponse = JSON.parse(pageData?.pages_custom_field ?? "{}");
                    const data = customResponse?.group_name;
                    setBannerData(data?.banner);
                    setProcessData(pageData?.usp_categorys[0])
                    setPageCustomField(data)

                } catch (err: unknown) {
                    console.error("Error parsing custom field data:", (err as Error).message);
                }
            }
        }
    }, [pageData]);

    return (


        <div className="partner_page">
            <Banner hasLoading={hasLoading} data={bannerData} />
            
            <div className={`sectionArea pt-xxl-2 ${Styles.about_section ?? ''}`}>
                <Container>
                    <Row className="rowGap gx-xl-5 justify-content-center">
                        <Col lg={6}>
                            {!hasLoading ? (
                                <CustomImage
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${pageData?.page_feature_image}`}
                                    alt={pageData?.page_title ?? "Card Poster"}
                                    className={Styles.aboutPoster}
                                />
                            ) : (
                                <div className={`skeleton ${Styles.aboutPoster}`}></div>
                            )}
                        </Col>
                        <Col lg={6} className="align-self-center">
                            <div className={`${Styles.about_content}`}>
                                {!hasLoading ? (
                                    <>
                                        {pageData?.short_description && <div className="small_title">{pageData?.short_description}</div>}
                                        <h2 className={`title fw-bold ${Styles.page_title ?? ''}`}>{pageData?.page_title}</h2>
                                        <div
                                            className="editorText"
                                            dangerouslySetInnerHTML={{ __html: pageData?.description || "" }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className={"small_title skeleton w-25"}>&nbsp;</div>
                                        <div className={`title skeleton ${Styles.page_title}`}>&nbsp;</div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText"></div>
                                        <div className="skeleton skeletonText w-75"></div>
                                        <div className="skeleton skeletonText w-50"></div>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className={`sectionArea ${Styles.processSection ?? ''}`}>
                <Container>
                    <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
                        {!hasLoading ? (
                            <h3 className={`title fw-normal ${Styles.title ?? ''}`}
                                dangerouslySetInnerHTML={{ __html: processData?.usp_category_title ?? '' }}
                            />
                        ) : (
                            <div className={`title fw-normal ${Styles.title ?? ''}`}>&nbsp;</div>
                        )}
                    </div>
                    <List isLoading={hasLoading} process_steps={processData?.usps.map((item) => ({
                        name: item.usp_title ?? '',
                        title: item.usp_title ?? '',
                        description: item.usp_description ?? '',
                        filename: item.usp_feature_image_path ?? ''
                    })) ?? []
                    } />
                </Container>
            </div>


            <div className={`sectionArea ${Styles.referralSectionsam ?? ''}`}>
                <Container className={Styles.reselmarketsec}>
                    {pageCustomField?.program && (
                        <Row className="gx-xl-5 justify-content-center align-items-center">
                            <Col lg={6}>
                                <div className={`text-white ${Styles.referralContent} ${Styles.referralContentWhite}`}>
                                    <div className={Styles.referralContentInner}>
                                        <div className={`small_title fw-semibold ${Styles.small_title}`}>{pageCustomField?.program.nplh_title_1}</div>
                                        <div className={`title fw-bold ${Styles.sectionTitle}`}>{pageCustomField?.program.nplh_heading_1}</div>
                                        <div dangerouslySetInnerHTML={{__html:pageCustomField?.program.nplh_description_1}} className="editorText" />
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6}>    
                                <div className={Styles.referralContent}>
                                    <div className={Styles.referralContentInner}>                     
                                        <div className={`small_title ${Styles.small_title}`}>{pageCustomField?.program.nplh_title_2}</div>
                                        <div className={`title fw-bold ${Styles.sectionTitle}`}>{pageCustomField?.program.nplh_heading_2}</div>
                                        <div dangerouslySetInnerHTML={{__html:pageCustomField?.program.nplh_description_2}} className="editorText" />
                                    </div>   
                                </div>   
                            </Col>
                        </Row>   
                    )}
                    
                </Container>
            </div>

            {pageData && (
                <Developer 
                    hasLoading={hasLoading} 
                    data={pageData?.usp_categorys[1]} 
                    separateText={true}
                    isButton={false}
                    boxClass3={true}
                />
            )}

            {pageData && pageData?.faqs?.length > 0 && (
                <div className={`sectionArea ${Styles.faqSectionsam ?? ''}`}>
                    <Container>
                        <Row className={`rowGap ${Styles.row ?? ''}`}>
                            <Col lg={5}>
                                <div className={`section-content ${Styles.hmfaq_tpbx ?? ''}`}>
                                    <h2 className={`title ${Styles.hwdtilte}`}>{pageCustomField?.faq?.khft_title}</h2>
                                    <div className={Styles.hwdtiltepara}
                                        dangerouslySetInnerHTML={{ __html: pageCustomField?.faq?.khft_description || '' }}
                                    />
                                    <div className="btn_left">
                                        <button
                                            type="button"
                                            onClick={() => openScheduleModal('general_schedule_a_call')}
                                            className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}
                                        >
                                            <span>
                                                <Image
                                                    className="auto-img"
                                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                                    alt={"Schedule a Call"}
                                                    width={21} height={21}
                                                    priority={true}
                                                />
                                            </span>
                                            <em>Schedule a Call</em>
                                        </button>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={7}>
                                <Faq hasLoading={hasLoading} data={pageData?.faqs} />
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </div>
    )
}

export default Partnerships
