import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import Image from 'next/image';
const Banner = () => {
    return (
        <div className={Styles.cmsBanner}>
            <Container>
                <Row className='align-items-center'>
                    <Col lg={6}>
                        <div className={Styles.bannerText}>
                            <h1 className="heading">We Love what you say…</h1>
                            <p>Trusted across the Globe, we VALUE your Business Emotions </p>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <figure className={Styles.poster}>
                            <Image
                                className="auto-img"
                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/spanempoweringspan-collaborative-efforts-to-establ.webp`}
                                alt="Eclick Member"
                                width={400}
                                height={450}
                                priority={true}
                            />
                        </figure>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Banner
