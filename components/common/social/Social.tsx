import Link from "next/link";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
type classProps = {
    itemSize: string
}
const Social = ({itemSize} : classProps) => {
    return(
        <div className={`${Styles.social} ${itemSize ?? ''}`}>
            <Link href="https://www.instagram.com/" aria-label="Instagram" target="_blank">
                <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link href="https://www.facebook.com/" aria-label="Facebook" target="_blank">
                <FontAwesomeIcon icon={faFacebookF} />
            </Link>
            <Link href="https://x.com/" aria-label="X Twitter" target="_blank">
                <FontAwesomeIcon icon={faXTwitter} />
            </Link>
            <Link href="www.youtube.com/" aria-label="Youtube" target="_blank">
                <FontAwesomeIcon icon={faYoutube} />
            </Link>
            <Link href="https://in.linkedin.com/" aria-label="Linkedin India" target="_blank">
                <FontAwesomeIcon icon={faLinkedinIn} />
            </Link>
        </div>
    )
}
export default Social;