import NotFound from "@/app/not-found";
import BlogBanner from "@/components/blog/banner";
import Blogcategory from "@/components/blog/category/View";
import BlogList from "@/components/blog/List";
import PopularPost from "@/components/blog/popular-post/Post";
import SearchBox from "@/components/blog/Search";
import BlogDetails from "@/components/blog/details/Details";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/blog/style.module.css";
import DetailsBanner from "@/components/blog/details/Banner";
export const dynamic = "force-dynamic";
export const revalidate = 60;

type Props = {
    params: { slug?: string[] }
}

const getCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}blogs/category`,
    { next: { revalidate: 60} } 
  );

  const data = await res.json();
  return data.response_data.allCategory;
};
const Blogpage = async({ params }: Props) => {

    let {slug} = await params;
    if (!slug) slug = [];
    if (slug.length > 2) return <NotFound />;

    const categories = await getCategories();
    
    const isListing = slug.length <= 1;
    const isDetails = slug.length === 2;

    return (
        <>
            { isListing && <BlogBanner />}
            { isDetails && <DetailsBanner />}
            
            <div className={`sectionArea ${Styles.sectionArea}`}>
                <Container>
                    <Row>
                        <Col xl={9} lg={8}>
                            <article className={`stickyContent ${Styles.stickyContent ?? ''}`}>
                                {isListing && <BlogList slug={slug} />}
                                {isDetails && <BlogDetails slug={slug} />}
                            </article>
                        </Col>

                        <Col xl={3} lg={4}>
                            <aside className={`stickyContent ${Styles.sidebar}`}>
                                <SearchBox />
                                <Blogcategory categories={categories} />
                                <PopularPost />
                            </aside>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}
export default Blogpage;