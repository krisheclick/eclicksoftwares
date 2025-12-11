import { Container } from 'react-bootstrap';
import Styles from './Styles.module.css';
type dataType = {    
    bannerTitle: string;
    updateDate: string;
}

type Props = {
    data?: dataType;
}
const Banner = ({data} : Props) => {
    return (
        <div className={Styles.cmsBanner}>
            <Container>
                <div className={Styles.bannerText}>
                    <h1 className="heading">{data?.bannerTitle}</h1>
                    <div className={Styles.updateDate}>Last updated {data?.updateDate}</div>
                </div>
            </Container>
        </div>
    )
}

export default Banner
