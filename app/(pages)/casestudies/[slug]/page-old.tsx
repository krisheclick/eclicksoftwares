import Styles  from "@/components/casestudy/casestudy.module.css"
import Singlebanner from "@/components/casestudy/banner/Singlebanner";
import Serviceslist from "@/components/casestudy/banner/Serviceslist";
import Requirements from "@/components/casestudy/banner/Requirements";
import Challenges from "@/components/casestudy/banner/Challenges";
import MySlider from "@/components/casestudy/banner/Casestudyslider";
import Testimonial from "@/components/casestudy/banner/Testimonial";
import NotFound from "@/app/not-found";

const allCaseStudies = ['linda-jewellers', 'cable-grommet', 'buy-wines'];
const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  return allCaseStudies.map((slug) => ({ slug }));
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const response = await fetch(`${APIURL}project/${slug}`);
  const {response_data} = await response.json();

  // const caseStudy = allCaseStudies.find((c) => c === slug);

  // if (!caseStudy) return <NotFound />;

  return (
    <div className={Styles.singleSection}>
        <div className={Styles.singleTop}>
          <Singlebanner data={response_data} />
        </div>
        <div className={Styles.singleServiceList}>
          <Serviceslist data={response_data} />
        </div>
        <div className={Styles.requirementsSection}>
          <Requirements data={response_data} />
        </div>
        <div className={Styles.challengesPart}>
          <Challenges data={response_data} />
        </div>
        <div className={Styles.TestimonialSection}>
          <Testimonial />
        </div>
        <div className={Styles.MySlider}>
          <MySlider />
        </div>
    </div>
  )
}

export default Page;
