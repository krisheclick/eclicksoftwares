"use client";
import Banner from "@/components/our-clients/Banner";
import IndustryWiseClients from "@/components/our-clients/IndustryWiseClients";
import { useEffect, useState } from 'react';

type PageData = {
    id: number;
    heading: string;
    page_feature_image: string;
    short_description: string;
    page_title: string;
    description: string;
    pages_custom_field: string;
    page_repeater_data: string;
};

type Banner = {
    name: string;
    is_compoment: string;
    d05d_title: string;
    d05d_description: string;
    d05d_button_name: string;
    d05d_button_link: string;
    d05d_image: string;
};

type PagesCustomField = {
    banner?: Banner;
    slug: string[];
};

const OurClientsPage = () => {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [hasLoading, setLoading] = useState(true);
    const [bannerData, setBannerData] = useState<Banner | null>(null);
    const [pageCustomField, setPageCustomField] = useState<PagesCustomField | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/our-clients`);
            const { response_data } = await response.json();
            console.log('response :>> ', response);
            setPageData(response_data);
        } catch (err: unknown) {
            console.error("Failed to fetch Our Clients Page:", (err as Error).message);
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
                    setBannerData(data.banner);
                    setPageCustomField(data)

                } catch (err: unknown) {
                    console.error("Error parsing custom field data:", (err as Error).message);
                }
            }
        }
    }, [pageData]);
    console.log('bannerData :>> ', bannerData);
    return (
        <div className="our_clients_page">
            {/* ================= CLIENTS-BANNER-STARTS ================= */} 
            {bannerData && (
                <Banner hasLoading={hasLoading} data={bannerData} />
            )}
            {/* ================= CLIENTS-BANNER-ENDS ================= */}

            {/* ================= INDUSTRY-WISE-CLIENTS-STARTS ================= */}
            <IndustryWiseClients />
            {/* ================= INDUSTRY-WISE-CLIENTS-ENDS ================= */}
        </div>
    );
}

export default OurClientsPage
