import BlogBanner from "@/components/blog/banner";
import BlogList from "@/components/blog/List";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/blog/style.module.css";
import Blogcategory from "@/components/blog/category/View";
import PopularPost from "@/components/blog/popular-post/Post";
import SearchBox from "@/components/blog/Search";

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
