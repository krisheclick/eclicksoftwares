import Styles from './style.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
type Props = {
    poster?: string;
    slug?: string;
    title?: string;
    projectName?: string;
    proj_short_desc?: string;
}
const Card = ({ poster, slug, title, projectName, proj_short_desc}: Props) => {
    return (
        <div className={Styles.cardBox}>
            <div className={Styles.thumbnail}>
                <figure style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_MEDIA_URL}${poster})`}}></figure>
            </div>
            <div className={Styles.cardData}>
                <div className={Styles.subtitle}>{title}</div>
                <div className={`noList ${Styles.text ?? ''}`}
                    dangerouslySetInnerHTML={{__html: proj_short_desc ?? ''}}
                />
                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${slug}`} className={Styles.projectName}>
                    <FontAwesomeIcon icon={faLink} />
                    {projectName}
                </Link>
            </div>
        </div>
    )
}

export default Card