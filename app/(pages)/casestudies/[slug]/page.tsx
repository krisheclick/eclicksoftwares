import Banner from '@/components/casestudy/Banner';
import Challenges from '@/components/casestudy/banner/Challenges';
import Requirements from '@/components/casestudy/banner/Requirements';
import Styles from '@/components/casestudy/style.module.css';
import Testimonial from "@/components/casestudy/banner/Testimonial";
import MySlider from '@/components/casestudy/banner/Casestudyslider';
import Technologies from '@/components/casestudy/Technologies';
import CalltoAction from '@/components/casestudy/CalltoAction';
import Singlebanner from '@/components/casestudy/banner/Singlebanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong } from '@fortawesome/free-solid-svg-icons/faArrowDownLong';
const data = {
    title: "Luxury Watch Ecommerce Platform",
    content: "Our team designed a user-friendly, mobile-first website with a clean UI and optimized UX. We focused on speed optimization, SEO-friendly structure, and clear call-to-action placement.",
    poster: "details-poster.png"
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;
const CasestudyDeatils = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
    const response = await fetch(`${APIURL}project/${slug}`);
    const { response_data } = await response.json();
    return (
        <div className={Styles.singlePage}>
            <div className={Styles.singlePageBanner}>
                {slug == 'perth-blinds' ? (
                    <>
                        <Singlebanner data={response_data} />
                        <span className={Styles.bannerArrow}>
                            <FontAwesomeIcon icon={faArrowDownLong} />
                        </span>
                    </>
                ) : (
                    <Banner data={data} />
                )}
            </div>
            <Requirements data={response_data} />
            <Technologies
                title={slug == 'perth-blinds' ? 'Marketing Automation' : 'Use Technologies'}
                technologies={response_data?.technologies}
            />
            <Challenges data={response_data} />
            <MySlider />
            <Testimonial />
            <CalltoAction />
        </div>
    )
}

export default CasestudyDeatils