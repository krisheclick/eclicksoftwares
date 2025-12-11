// import NotFound from "@/app/not-found";
// import BlogDetails from "@/components/blog/blog-details";

// const singlePage = [
//     'how-to-optimize-your-landing-page-to-grab-more-leads',
//     'most-effective-digital-marketing-strategies-for-real-estate',
//     'why-does-your-business-require-custom-websites-over-templates',
// ];

// export async function generateStaticParams(){
//     return singlePage.map((slug) => ({slug}));
// }
// const Detailspage = async ({ params }: { params: { slug: string } }) => {
//     const { slug } = await params;
//     const blogDetails = singlePage.find((isValue) => isValue === slug);

//     if(!blogDetails) return <NotFound />
//     return (
//         <div>
//             <BlogDetails />
//         </div>
//     )
// }

// export default Detailspage
import BlogBanner from "@/components/blog/banner";
import BlogList from "@/components/blog/List";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/blog/style.module.css";
import Blogcategory from "@/components/blog/category/View";
import SearchBox from "@/components/blog/Search";
import PopularPost from "@/components/blog/popular-post/Post";

const page = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
    console.log('first', slug)
    return (
        <>
            <BlogBanner />
            <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
                <Container>
                    <Row>
                        <Col xl={9} lg={8}>
                            <article className={`stickyContent ${Styles.blogList ?? ''}`}>
                                <BlogList />
                            </article>
                        </Col>
                        <Col xl={3} lg={4}>
                            <aside className={`stickyContent ${Styles.sidebar}`}>
                                <SearchBox />
                                <Blogcategory />
                                <PopularPost />
                            </aside>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default page

