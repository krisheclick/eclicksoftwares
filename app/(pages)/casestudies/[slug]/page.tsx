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
const APIURL = process.env.NEXT_PUBLIC_API_URL;
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