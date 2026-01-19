import Styles from './style.module.css'
import CustomImage from '@/utils/CustomImage';
interface Props {
    poster?: string;
    name?: string;
    designation?: string;
}
const Card = ({ poster, name, designation }: Props) => {
    return (
        <div className={Styles.card}>
            <CustomImage
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
                alt={name || "Member Name"}
                className={Styles.memberImage}
            />
            <div className={Styles.name}>{name}</div>
            <em className={Styles.designation}>{designation}</em>
        </div>
    )
}

export default Card
