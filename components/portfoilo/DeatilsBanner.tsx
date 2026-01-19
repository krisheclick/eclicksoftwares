"use client";

import { useEffect, useState } from "react";
import Styles from "./style.module.css";
import CustomImage from "@/utils/CustomImage";

type Props = {
    slug?: string;
};

interface DataItem {
    title?: string;
    portfolio_group_banner_image_path?: string;
}

interface SiteSetting {
    common_banner?: string;
}

const DetailsBanner = ({ slug }: Props) => {
    const [data, setData] = useState<DataItem | null>(null);
    const [siteSetting, setSiteSetting] = useState<SiteSetting | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchBanner = async () => {
            try {
                const [groupRes, settingRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/group/${slug}`, {
                        cache: "no-store",
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-setting`, {
                        cache: "no-store",
                    }),
                ]);

                if (!groupRes.ok) {
                    throw new Error("Failed to fetch banner data");
                }

                const { response_data } = await groupRes.json();
                const { response_data: siteData } = await settingRes.json();

                setData(response_data);
                setSiteSetting(siteData);
            } catch (error) {
                console.error("DetailsBanner error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [slug]);

    if (loading || !data) return null;

    const poster = data.portfolio_group_banner_image_path ? data.portfolio_group_banner_image_path : siteSetting?.common_banner;
    if (!poster) return null;

    return (
        <div className={Styles.bannerSection}>
            <CustomImage
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
                alt={data.title}
                className={Styles.bannerPoster}
            />
        </div>
    );
};

export default DetailsBanner;
