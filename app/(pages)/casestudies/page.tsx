import Banner from "@/components/casestudy/Banner";
import CasestudyList from "@/components/casestudy/List";
import { Metadata } from "next";
import seoData from "@/data/seo.json";

export async function generateMetadata(): Promise<Metadata> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/casestudies/seo`, {
        cache: "no-store", // or 'force-cache' for static
    });
    if (!res.ok) {
        return seoData;
    }

    const { response_data: seo } = await res.json();

    const description = seo.meta_descriptions
        ?.replace(/<[^>]*>?/gm, "")
        .trim();

    const ogImageUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}${seo.og_image_path}`;
    const robots = (seo.meta_robots || "").toLowerCase();

    return {
        title: seo.meta_title || seoData.title,
        description: description || seoData.description,
        keywords: seo.meta_keywords.split(',') || [],
        robots: {
            index: !robots.includes("noindex"),
            follow: !robots.includes("nofollow"),
        },
        openGraph: {
            type: "website",
            locale: seoData.openGraph.locale,
            siteName: seoData.openGraph.siteName,
            url: seoData.openGraph.url,
            title: seo.meta_title,
            description: description,
            images: [
                {
                    url: ogImageUrl,
                    width: seo.og_image_width || 1200,
                    height: seo.og_image_height || 630,
                    alt: seoData.openGraph.siteName
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: seo.meta_title,
            description: description,
            images: [
                {
                    url: ogImageUrl,
                    width: seo.og_image_width || 1200,
                    height: seo.og_image_height || 630,
                    alt: seoData.openGraph.siteName
                }
            ]
        },
        alternates: {
            canonical: seoData.openGraph.url,
        },
    };
}

const CasestudyPage = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/case-studies`);
    const { response_data } = await response.json();

    const pagesCustomField = typeof response_data.pages_custom_field === 'string' 
        ? JSON.parse(response_data.pages_custom_field)
        : response_data.pages_custom_field;

    const bannerData = pagesCustomField?.group_name?.banner;
    const bannerProps = {
        proj_name: bannerData?.name,
        proj_main_banner_title: bannerData?.ypwm_title,
        proj_main_banner_description: bannerData?.ypwm_description,
        proj_main_banne_image_path: '/uploads/page_image/' + bannerData?.ypwm_image,
    };

    return (
        <div className="case-study-page">
            <Banner data={bannerProps} />
            <CasestudyList />
        </div>
    );
};


export default CasestudyPage;