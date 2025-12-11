import Banner from '@/components/casestudy/banner/Banner';
import Casestudymain from "@/components/casestudy/banner/Casestudylist";
import Styles  from "@/components/casestudy/casestudy.module.css"

const Page = () => {
  return (
    <div className={Styles.caseStudyMain}>
        <Banner />
        <Casestudymain />
    </div>
  )
}

export default Page
