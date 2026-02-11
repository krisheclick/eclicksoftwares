import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Styles from './style.module.css';
import Link from 'next/link';
import { faBriefcase, faHeadphones, faMessage, faQuestion } from '@fortawesome/free-solid-svg-icons';
import Video from './Video'

const Information = () => {
    return (
        <div className={Styles.information}>
            <div className="stickyContent">
                <div className={Styles.informationContent}>
                    <ul className="noList">
                        <li>
                            <span className={Styles.icon}><FontAwesomeIcon icon={faBriefcase} /></span>
                            <div className={Styles.subtitle}>Looking for career?</div>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/career`}>Apply for a job </Link>
                        </li>
                        <li>
                            <span className={Styles.icon}><FontAwesomeIcon icon={faQuestion} /></span>
                            <div className={Styles.subtitle}>Have a general question?</div>
                            <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`}>See our FAQs </Link>
                        </li>
                        <li>
                            <span className={Styles.icon}><FontAwesomeIcon icon={faHeadphones} /></span>
                            <div className={Styles.subtitle}>Sales Inquiries</div>
                            <Link href="tel:+618812645243">+61 881264524 3 ECLICK</Link>
                        </li>
                        <li>
                            <span className={Styles.icon}><FontAwesomeIcon icon={faMessage} /></span>
                            <div className={Styles.subtitle}>Customer Support</div>
                            <Link href="mailto:support@eclicksoftwares.com">support@eclicksoftwares.com</Link>
                        </li>
                    </ul>
                </div>
                <div className={Styles.videoSection}>
                    <div className={Styles.subtitle}>So what happens next?</div>
                    <Video />
                </div>
            </div>
        </div>
    )
}

export default Information
