"use client";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "@/components/common/banner/Banner";
import PaymentContact from "@/components/payment-center/PaymentContact";
import PaymentInformation from "@/components/payment-center/PaymentInformation";
import Styles from "@/components/payment-center/style.module.css";
import { useEffect, useState } from "react";

type PageData = {
    id: number;
    heading: string;
    page_feature_image: string;
    short_description: string;
    page_title: string;
    description: string;
    pages_custom_field: string; // JSON string
    page_repeater_data: string;
    counter_data: string; // JSON string
};

type PagesCustomField = {
    banner?: Banner;
};

type Banner = {
    name: string;
    is_compoment: string;
    k8vz_title: string;
    k8vz_description: string;
    k8vz_image: string;
};
export default function PaymentCenter() {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [hasLoading, setLoading] = useState(true);
    const [bannerData, setBannerData] = useState<Banner | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/payment-center`);
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
                } catch (err: unknown) {
                    console.error("Error parsing custom field data:", (err as Error).message);
                }
            }
        }
    }, [pageData]);


    return (
        <>
        {bannerData && (
            <Banner
                isLoading={false}
                title={bannerData?.k8vz_title}
                subtitle={bannerData?.k8vz_description}
                image={`/uploads/page_image/${bannerData?.k8vz_image}`}
                short_description=""
            />
        )}
            <div className={`sectionArea ${Styles.sectionArea}`}>
                <Container>
                    <Row className="gx-xl-5">
                        <Col lg={6}>
                            <PaymentContact />
                        </Col>
                        <Col lg={6}>
                            <PaymentInformation />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}