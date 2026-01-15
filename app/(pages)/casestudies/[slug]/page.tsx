import Banner from '@/components/casestudy/Banner';
import Challenges from '@/components/casestudy/banner/Challenges';
import Styles from '@/components/casestudy/style.module.css';
import Requirements from '@/components/casestudy/requirements/Requirements';
import Testimonial from "@/components/casestudy/banner/Testimonial";
import MySlider from '@/components/casestudy/banner/Casestudyslider';
import Technologies from '@/components/casestudy/Technologies';
import CalltoAction from '@/components/casestudy/CalltoAction';
import Singlebanner from '@/components/casestudy/banner/Singlebanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons/faArrowDownLong';
import ProjectInfo from '@/components/casestudy/seo-info/ProjectInfo';

import { Metadata } from "next";
import seoData from "@/data/seo.json";


const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({params}: {params: {slug: string}}): Promise<Metadata> {
    const {slug} = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/casestudies/${slug}/seo`, {
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

const CasestudyDeatils = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
    const response = await fetch(`${APIURL}project/${slug}`);
    const { response_data } = await response.json();
    const dataType = response_data?.Group?.project_group_layout == 2;
    return (
        <div className={Styles.singlePage}>
            <div className={Styles.singlePageBanner}>
                {dataType ? (
                    <Singlebanner data={response_data} />
                ) : (
                    <Banner data={response_data} />
                )}
                <span className={Styles.bannerArrow}>
                    <FontAwesomeIcon icon={faArrowDownLong} />
                </span>
            </div>
            <ProjectInfo
                business_data={response_data?.proj_business_objectives}
                initial_challenges={response_data?.proj_initial_challenges}
            />
            <Requirements
                data={response_data}
                projectType={dataType}
            />
            {!dataType && (
                <Technologies
                    title={dataType ? 'Marketing Automation' : 'Use Technologies'}
                    technologies={response_data?.technologies}
                />
            )}
            <Challenges data={response_data} />
            <MySlider data={response_data?.projects} />
            <Testimonial />
            <CalltoAction data={response_data?.proj_call_to_action} />
        </div>
    )
}

export default CasestudyDeatils