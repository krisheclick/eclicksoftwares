import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Banner = () => {
  return (
    <section className={Styles.bannerSection}>
        <Container>
            <Row>
                <Col lg={12}>
                    <article>
                        <h1 className={Styles.pageTitle}>Case study</h1>
                        <aside>
                            <p>
                                Discover innovation in action through our latest case study. Explore in-depth articles, 
                                emerging tech trends, and industry best practices. Join us on a journey to the
                                future of technology—one blog post at a time.
                            </p>
                        </aside>
                        <form action="">
                            <input type="text" name="search" id="search" placeholder="Search here..." />
                            <button><FontAwesomeIcon icon={faSearch} /></button>
                        </form>
                        <div className={Styles.searchList}>
                            <ul>
                                <li><Link href={'/'}>Digital Marketing</Link></li>
                                <li><Link href={'/'}>Website Design</Link></li>
                                <li><Link href={'/'}>Digital Marketing</Link></li>
                                <li><Link href={'/'}>Website Design</Link></li>
                                <li><Link href={'/'}>Digital Marketing</Link></li>
                                <li><Link href={'/'}>Website Design</Link></li>
                            </ul>
                        </div>
                    </article>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default Banner