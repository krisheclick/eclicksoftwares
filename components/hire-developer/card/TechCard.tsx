import { Col } from 'react-bootstrap';
import Styles from './style.module.css';
import CustomImage from '@/utils/CustomImage';
type TechItem = {
    technology_feature_image_path?: string;
    technology_title?: string;
}
type Props = {
    data?: TechItem[]
}
const TechCard = ({data}: Props) => {
    return (
        data?.map((item, index) => (
            <Col key={index} lg={3} md={4} xs={6}>
                <div className={Styles.techCardsbx}>
                    <CustomImage
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item?.technology_feature_image_path}`}
                        alt={item.technology_title}
                        className={Styles.techcardimg}
                    />
                    <div className={Styles.techstitle}>{item.technology_title}</div>
                </div>
            </Col>
        ))
    )
}

export default TechCard
