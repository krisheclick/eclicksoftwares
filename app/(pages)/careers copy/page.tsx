import Comeingsoon from '@/components/common/Comeingsoon'
import { Metadata } from "next";
import seoData from "@/data/seo.json";

export async function generateMetadata(): Promise<Metadata> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/careers/seo`, {
        cache: "no-store", // or 'force-cache' for static
    });
    if (!res.ok) {
        return seoData;
    }

    const {response_data:seo} = await res.json();

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
const Careers = () => {
  return <Comeingsoon />
}

export default Careers
