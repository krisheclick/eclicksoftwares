import NotFound from "@/app/not-found";
import BlogBanner from "@/components/blog/banner";
import Blogcategory from "@/components/blog/category/View";
import BlogList from "@/components/blog/List";
import PopularPost from "@/components/blog/popular-post/Post";
import SearchBox from "@/components/blog/Search";
import BlogDetails from "@/components/blog/blog-details";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/blog/style.module.css";

const getCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}blogs/category`,
    { cache: "no-store" } 
  );

  const data = await res.json();
  return data.response_data.allCategory;
};

const popularPost = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}blogs`,
    { cache: "no-store" } 
  );

  const data = await res.json();
  return data.response_data.blogData;
};

type Props = {
    params: { slug?: string[] }
}
const Blogpage = async({ params }: Props) => {
    const categories = await getCategories();
    const recentPost = await popularPost();
    let {slug} = await params;
    if (!slug) slug = [];
    const isListing = slug.length <= 1;
    const isDetails = slug.length === 2;

    if (slug.length > 2) return <NotFound />;

    return (
        <>
            {isListing && <BlogBanner />}

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
                                <PopularPost post={recentPost} />
                            </aside>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}
export default Blogpage;