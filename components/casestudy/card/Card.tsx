import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import Styles from './style.module.css';
import CustomImageLink from '@/utils/CustomImageLink';
type Props = {
    poster?: string;
    slug?: string;
    title?: string;
    proj_short_desc?: string;
    projectName?: string;
}
const Card = ({ poster, slug, title, proj_short_desc}: Props) => {
    return (
        <div className={Styles.cardBox}>
            <div className={Styles.thumbnail}>
                <CustomImageLink
                    link={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${slug}`}
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
                    alt={title}
                    className={`d-block ${Styles.thumbnailPoster}`}
                />
            </div>
            <div className={Styles.cardData}>
                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${slug}`} className={Styles.subtitle}>{title}</Link>
                {/* <div className={Styles.subtitle}>{title}</div> */}
                <div className={`noList ${Styles.text ?? ''}`}
                    dangerouslySetInnerHTML={{__html: proj_short_desc ?? ''}}
                />
                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${slug}`} className={Styles.projectName}>
                    <FontAwesomeIcon icon={faLink} />
                    Read More
                </Link>
            </div>
        </div>
    )
}

export default Card