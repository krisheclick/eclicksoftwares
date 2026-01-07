import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css';

type DataItem = {
    title?: string;
    content?: string;
    poster?: string;
}
type Props = {
    data?: DataItem;
}
const Banner = ({data} : Props) => {
    const poster = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/banner/${data?.poster}`;
    return (
        <div className={Styles.cmsBanner} style={{background: `url('${poster}') center / cover`}}>
            <Container>
                <Row className='text-white align-items-center'>
                    <Col lg={6}>
                        <div className={Styles.bannerText}>
                            <h1 className={`title ${Styles.bannerTitle}`}>{data?.title}</h1>
                            <p>{data?.content}</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Banner
