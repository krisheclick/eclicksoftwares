import Styles from './style.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
type Props = {
    title?: string;
    projectName?: string;
    slug?: string;
    poster?: string;
}
const Card = ({title, projectName, slug, poster}: Props) => {
    return (
        <div className={Styles.cardBox}>
            <div className={Styles.thumbnail}>
                <figure style={{backgroundImage: `url(${process.env.NEXT_PUBLIC_MEDIA_URL}${poster})`}}></figure>
            </div>
            <div className={Styles.cardData}>
                <div className={Styles.subtitle}>{title}</div>
                <div className={Styles.text}>
                    <ul className='noList'>
                        <li>Custom-built responsive layout</li>
                        <li>Optimized code for fast performance</li>
                        <li>SEO-friendly structure</li>
                    </ul>
                </div>
                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies/${slug}`} className={Styles.projectName}>
                    <FontAwesomeIcon icon={faLink} />
                    {projectName}
                </Link>
            </div>
        </div>
    )
}

export default Card