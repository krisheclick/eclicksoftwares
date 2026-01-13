"use client";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "@/components/common/banner/Banner";
import PaymentContact from "@/components/payment-center/PaymentContact";
import PaymentInformation from "@/components/payment-center/PaymentInformation";
import Styles from "@/components/payment-center/style.module.css";
import seoData from "@/data/seo.json";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/payment-center/seo`, {
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

export default function PaymentCenter() {
    return (
        <>
            <Banner
                isLoading={false}
                title="Payment Center"
                subtitle="Trust Begins With Easy Payment<br />Pay Any Time – Your Payment is Secured"
                image="/upload/banner_images/payment-center.jpg"
                short_description=""
            />
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