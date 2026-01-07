import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
const Banner = () => {
    const poster = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/banner/banner-poster.webp`;
    return (
        <div className={Styles.cmsBanner} style={{background: `url('${poster}') center / cover`}}>
            <Container>
                <Row className='text-white align-items-center'>
                    <Col lg={6}>
                        <div className={Styles.bannerText}>
                            <h1 className={`title ${Styles.bannerTitle}`}>Our Testimonials</h1>
                            <p>Our team designed a user-friendly, mobile-first website with a clean UI and optimized UX. We focused on speed optimization, SEO-friendly structure, and clear call-to-action placement.</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Banner
