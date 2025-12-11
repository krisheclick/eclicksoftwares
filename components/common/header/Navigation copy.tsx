import Link from "next/link";
import Styles from "./navigation.module.css";
const Navigation = () => {
    return(
        <nav className={Styles.navMenu}>
            <ul className={Styles.menu_wrapper}>
                <li className={Styles.navItem}>
                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Behind the Brand +</Link>
                </li>
                <li className={Styles.navItem}>
                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/solutions`} className={Styles.navLink}>Solutions +</Link>
                </li>
                <li className={Styles.navItem}>
                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Portfolio</Link>
                </li>
                <li className={Styles.navItem}>
                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies`} className={Styles.navLink}>Case Studies</Link>
                </li>
                <li className={Styles.navItem}>
                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/contact-us`} className={Styles.navLink}>Contact Us</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation;