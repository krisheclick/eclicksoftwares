import Contact from "@/components/contact-us/Contact";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/contact-us/style.module.css";
import Information from "@/components/contact-us/Information";
import { Metadata } from "next";
import seoData from "@/data/seo.json";
import ContactHero from "@/components/contact-us/ContactHero";

export async function generateMetadata(): Promise<Metadata> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/contact-us/seo`, {
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

const ContactUsPage = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/contact-us`);
    const { response_data } = await response.json();

    const pagesCustomField = typeof response_data.pages_custom_field === 'string' 
        ? JSON.parse(response_data.pages_custom_field)
        : response_data.pages_custom_field;

    const bannerData = pagesCustomField?.group_name?.["banner-section"];

    return (
        <div className="case-study-page">
            <ContactHero
                title={bannerData?.a5w7_banner_title}
                description={
                    bannerData?.a5w7_banner_short_description ||
                    bannerData?.a5w7_banner_description ||
                    response_data?.short_description
                }
                image={bannerData?.a5w7_banner_image}
            />
            <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
                <Container>
                    <Row className="gx-xxl-5 rowGap">
                        <Col lg={6}>
                            <Contact />
                        </Col>
                        <Col lg={6}>
                            <Information />
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};


export default ContactUsPage;
