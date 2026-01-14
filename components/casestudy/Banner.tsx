import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';

type Data = {
    proj_name?: string;
    proj_title?: string;
    proj_main_banner_title?: string;
    proj_main_banner_description?: string;
    proj_main_banne_image_path?: string;
}
type Props = {
    data?: Data;
}
const Banner = ({data} : Props) => {
    const bannerImage = data?.proj_main_banne_image_path;
    const poster = bannerImage ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${bannerImage}`
                : `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/banner/details-poster.png`;

    const title = data?.proj_main_banner_title;
    return (
        <div className={Styles.cmsBanner} style={{background: `url('${poster}') center / cover`}}>
            <Container>
                <Row className='text-white align-items-center'>
                    <Col lg={6}>
                        <div className={Styles.bannerText}>
                            <h1 className={`title ${Styles.bannerTitle}`}>{title ? title : data?.proj_name}</h1>
                            <div dangerouslySetInnerHTML={{__html: data?.proj_main_banner_description ?? ''}}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Banner
