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
                src={poster}
                alt={name || "Member Name"}
                priority
            />
            <div className={Styles.name}>{name}</div>
            <em className={Styles.designation}>{designation}</em>
        </div>
    )
}

export default Card
