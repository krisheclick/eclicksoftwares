import Banner from "@/components/casestudy/Banner";
import CasestudyList from "@/components/casestudy/List";

const data = {
    title: "Case Study",
    content: "Our team designed a user-friendly, mobile-first website with a clean UI and optimized UX. We focused on speed optimization, SEO-friendly structure, and clear call-to-action placement.",
    poster: "banner-poster.webp"
}
const CasestudyPage = () => {
    return (
        <div className="case-study-page">
            <Banner data={data} />
            <CasestudyList />
        </div>
    )
}

export default CasestudyPage;