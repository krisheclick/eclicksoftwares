import Link from "next/link";
import Styles from "./navigation.module.css";

type MenuItem = {
    id: number;
    url: string;
    label: string;
    type: string;
    children?: MenuItem[];
};

type MenuProps = {
    menuData: MenuItem[];
};

const Navigation = ({ menuData }: MenuProps) => {
    const renderMenuItems = (items: MenuItem[], parentSlug:string='', menu_label: number = 0) => {
        if (!Array.isArray(menuData)) {
            items = Object.values(items);
        }
        const newMenuLabel = menu_label + 1;
        return items.map((item) => {
            let fullUrl = '';

            if (item.url.startsWith('/')) {
                fullUrl = parentSlug + item.url;
            }

            else if (item.url === '#') {
                fullUrl = 'javascript:void(0);';
            }
            else {
                fullUrl = parentSlug + '/' + item.url;
            }
            const submenu = item.children && item.children.length > 0;
            return (
                <li className={`${Styles.navItem}${submenu ? ` ${Styles.childrenMenu}` : ''}`} key={item.id}>
                    <Link href={fullUrl} className={Styles.navLink} id={`menu-item-${item.id}`}>
                        {item.label}
                    </Link>

                    {item.children && item.children.length > 0 && (
                        <ul className={Styles.submenu}>
                            {renderMenuItems(item.children, fullUrl, newMenuLabel)}
                        </ul>
                    )}
                </li>
            )
        });
    };

    return (
        <>
        <nav className={Styles.navMenu}>
            <ul className={Styles.menu_wrapper}>
                {renderMenuItems(menuData)}
            </ul>
        </nav>
        {/* <nav className={Styles.navMenu}>
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
        </nav> */}
        </>
    );
};

export default Navigation;
