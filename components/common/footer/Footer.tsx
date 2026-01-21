"use client";
import Link from 'next/link';
import Social from '../social/Social';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Area from './Area';
import { useLetsConnect, useScheduleCall } from '@/utils/useLetsConnect';
import ScheduleCall from '@/components/schedule-a-call/ScheduleCall';
import LetsConnectModal from '@/components/schedule-a-call/LetsConnetModal';
import CustomImageLink from '@/utils/CustomImageLink';
import Styles from './style.module.css';

type RecursiveMenuItem = {
    url: string;
    label: string;
    type: string;
    id: number;
    children?: RecursiveMenuItem[];
};

type SocialItem = {
    site_social_link_name?: string;
    site_social_link_url?: string;
    site_social_icon?: string;
    site_class_name?: string;
}
type ResponseData = {
    response_data?: {
        filteredSettings?: {
            site_title?: string;
            site_footer_email?: string;
            site_footer_phone?: string;
            site_footer_copyright?: string;
            footer_logo?: string;
            footer_iso_logo1?: string;
            footer_iso_logo2?: string;
            social_media?: SocialItem[];
        }
    }
}
type FooterProps = {
    sitedata?: ResponseData;
};
const Footer = ({ sitedata }: FooterProps) => {
    const data = sitedata?.response_data?.filteredSettings;
    const safeParseArray = <Text extends object>(value?: unknown): Text[] => {
        try {
            if (!value) return [];
            return (typeof value === "string" ? JSON.parse(value) : value) as Text[];
        } catch {
            return [];
        }
    };

    const social = safeParseArray<SocialItem>(data?.social_media);

    const [visible, setVisible] = useState(false);
    const { showScheduleModal, setShowScheduleModal, clickFrom } = useScheduleCall();
    const { showLetsConnectModal, setShowLetsConnectModal } = useLetsConnect();
    const [mainFooterMenu, setmainFooterMenu] = useState<RecursiveMenuItem[]>([]);
    const [subFooterMenu, setSubFooterMenu] = useState<RecursiveMenuItem[]>([]);
    const FOOTER_MAIN_MENU = "menu/12f0866d204598df0599";
    const FOOTER_SUB_MENU = "menu/e034c71afbcec6900d7c";

    const fetchFooterMenus = async () => {
        try {
            const [mainRes, subRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/${FOOTER_MAIN_MENU}`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/${FOOTER_SUB_MENU}`)
            ]);

            const mainJson = await mainRes.json();
            const subJson = await subRes.json();

            // API returns object → convert to array
            setmainFooterMenu(Object.values(mainJson.response_data || {}));
            setSubFooterMenu(Object.values(subJson.response_data || {}));

        } catch (error) {
            console.error("Footer menu fetch failed:", error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 200);
        };

        fetchFooterMenus();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const renderMenuColumn = (menu: RecursiveMenuItem) => (
        <div className={Styles.columnBox} key={menu.id}>
            <div className={Styles.navLinkWrapper}>
                <div className={Styles.title}>{menu.label}</div>
                <div className={Styles.navList}>
                    <ul className={Styles.navMenu}>
                        {menu.children?.map(child => (
                            <li className={Styles.navItem} key={child.id}>
                                <Link
                                    href={`${process.env.NEXT_PUBLIC_ENV_URL}/${child.url}`}
                                    className={Styles.navLink}
                                >
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Area />
            <footer role="contentinfo" className={Styles.mainFooter}>
                <div className={Styles.footerTop}>
                    <div className="container">
                        <div className={Styles.row}>
                            <div className={Styles.columnBox}>
                                <div className={Styles.logoColumn}>
                                    <CustomImageLink
                                        link={`${process.env.NEXT_PUBLIC_ENV_URL}`}
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data?.footer_logo}`}
                                        className={Styles.logo}
                                        width={175} height={85}
                                        alt="Logo"
                                        fallBack="/assets/images/logo.webp"
                                    />
                                    <div className={Styles.certified}>
                                        <CustomImageLink
                                            className={Styles.isoBox}
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data?.footer_iso_logo1}`}
                                            alt='ISO Certificate'
                                            width={98} height={86}
                                            fallBack="/assets/images/favicon.png"
                                        />
                                        <CustomImageLink
                                            className={Styles.isoBox}
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${data?.footer_iso_logo2}`}
                                            alt='ISO Certificate'
                                            width={98} height={86}
                                            fallBack="/assets/images/favicon.png"
                                        />
                                    </div>
                                    <div className={Styles.followSocial}>
                                        <span>Follow us</span>
                                        <Social social={social} />
                                    </div>
                                </div>
                            </div>
                            {mainFooterMenu.map(renderMenuColumn)}
                        </div>
                    </div>
                </div>
                <div className={Styles.copyright}>
                    <div className="container">
                        <hr />
                        <div className="d-flex align-items-center justify-content-between gap-2">
                            <p className='mb-0'>Copyright © {new Date().getFullYear()} <Link href={'https://www.eclicksoftwares.com/'} target='_blank'>Eclick Softwares & Solutions Pvt Ltd.</Link></p>
                            <ul className={`${Styles.inlineLink} d-flex flex-wrap`}>
                                {subFooterMenu?.map(child => (
                                    <li key={child.id}>
                                        <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/${child.url}`}>
                                            {child.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <span
                className={Styles.scrollup}
                style={{ display: visible ? "grid" : "none" }}
                onClick={scrollToTop}
            >
                <FontAwesomeIcon icon={faArrowUp} />
            </span>
            <ScheduleCall show={showScheduleModal} action={clickFrom} onHide={() => setShowScheduleModal(false)} />
            <LetsConnectModal show={showLetsConnectModal} action={clickFrom} onHide={() => setShowLetsConnectModal(false)} />
        </>
    )
}

export default Footer;