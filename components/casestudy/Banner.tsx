"use client"
import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';
import { useThemeContext } from '@/context/ThemeContext';

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
    const {commonBanner} = useThemeContext();
    const bannerImage = data?.proj_main_banne_image_path;
    const poster = bannerImage ? bannerImage : commonBanner;

    const title = data?.proj_main_banner_title;
    return (
        <div className={Styles.cmsBanner} style={{background: `url('${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}') center / cover`}}>
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
