"use client";
import Link from 'next/link';
import Styles from './style.module.css';
import Image from 'next/image';
import Social from '../social/Social';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Area from './Area';
import { useLetsConnect, useScheduleCall } from '@/utils/useLetsConnect';
import ScheduleCall from '@/components/schedule-a-call/ScheduleCall';
import LetsConnectModal from '@/components/schedule-a-call/LetsConnetModal';

type RecursiveMenuItem = {
    url: string;
    label: string;
    type: string;
    id: number;
    children?: RecursiveMenuItem[];
};
const Footer = () => {
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
                                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}`} className={Styles.logo}>
                                        <Image
                                            className="dark:invert"
                                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/logo.webp`}
                                            alt="Logo"
                                            width={160}
                                            height={80}
                                            priority={true}
                                        />
                                    </Link>
                                    <div className={Styles.certified}>
                                        <div className={Styles.isoBox}>
                                            <Image
                                                className='auto-img'
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/iso.png`}
                                                alt='ISO Certificate'
                                                width={98} height={86}
                                                loading='lazy'
                                            />
                                        </div>
                                        <div className={Styles.isoBox}>
                                            <Image
                                                className='auto-img'
                                                src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/iso-2.png`}
                                                alt='ISO Certificate'
                                                width={98} height={86}
                                                loading='lazy'
                                            />
                                        </div>
                                    </div>
                                    <div className={Styles.followSocial}>
                                        <span>Follow us</span>
                                        <Social itemSize="" />
                                    </div>
                                </div>
                            </div>
                            {mainFooterMenu.map(renderMenuColumn)}
                            {/* <div className={Styles.columnBox}>
                                <div className={Styles.navLinkWrapper}>
                                    <div className={Styles.title}>Global</div>
                                    <div className={Styles.navList}>
                                        <ul className={Styles.navMenu}>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/casestudies`} className={Styles.navLink}>Case Studies</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/our-testimonials`} className={Styles.navLink}>Testimonials</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/about-us`} className={Styles.navLink}>About Us</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/career`} className={Styles.navLink}>Careers</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/blog`} className={Styles.navLink}>Blog</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/our-partners`} className={Styles.navLink}>Partnerships</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/news`} className={Styles.navLink}>News</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/newsletter`} className={Styles.navLink}>Newsletter</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={Styles.columnBox}>
                                <div className={Styles.navLinkWrapper}>
                                    <div className={Styles.title}>Services</div>
                                    <div className={Styles.navList}>
                                        <ul className={Styles.navMenu}>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Product Scope</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>AI Development & Enablement</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>MVP Builder</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Custom Software Development</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>UX/UI</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Dedicated Teams  </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={Styles.columnBox}>
                                <div className={Styles.navLinkWrapper}>
                                    <div className={Styles.title}>Technology</div>
                                    <div className={Styles.navList}>
                                        <ul className={Styles.navMenu}>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Tech</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Open Source</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>AI Manifesto</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className={Styles.columnBox}>
                                <div className={Styles.navLinkWrapper}>
                                    <div className={Styles.title}>Talent In-Demand</div>
                                    <div className={Styles.navList}>
                                        <ul className={Styles.navMenu}>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>React Developers</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Node.js Developers</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Java Developers</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>QA Experts</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>iOS / iPadOS Developers</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>Android Developers</Link>
                                            </li>
                                            <li className={Styles.navItem}>
                                                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.navLink}>AWS Experts</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className={Styles.columnBox}>
                                <div className={Styles.addressBox}>
                                    <div className={Styles.title}>Find Us</div>
                                    <div className={Styles.areaBox}>
                                        <ul className={Styles.areaList}>
                                            <li className={Styles.areaItem}>
                                                <span className={Styles.flag}>
                                                    <Image 
                                                        className='auto-img'
                                                        src="/india.png"
                                                        alt='India Flag'
                                                        width={35} height={24}
                                                        priority={true}
                                                    />
                                                </span>
                                                <address>Godrej Genesis, 12 Floor, Unit - 1207, Sector V, Salt Lake, Kolkata -700091</address>
                                            </li>
                                            <li className={Styles.areaItem}>
                                                <span className={Styles.flag}>
                                                    <Image 
                                                        className='auto-img'
                                                        src="/uk.png"
                                                        alt='United Kingdom Flag'
                                                        width={35} height={24}
                                                        priority={true}
                                                    />
                                                </span>
                                                <address>Blenheim Court, Peppercorn Close, Peterborough. PE1 2DU</address>
                                            </li>
                                            <li className={Styles.areaItem}>
                                                <span className={Styles.areaIcon}>
                                                    <Image 
                                                        className='auto-img'
                                                        src="/phone.webp"
                                                        alt='Phone'
                                                        width={22} height={21}
                                                        priority={true}
                                                    />
                                                </span>
                                                <div>
                                                    <Link href="tel:+913340044425">+91 33 4004 4425</Link>
                                                    <Link href="tel:+442037696859">+44 203 769 6859</Link>
                                                </div>
                                            </li>
                                            <li className={Styles.areaItem}>
                                                <span className={Styles.areaIcon}>
                                                    <Image 
                                                        className='auto-img'
                                                        src="/location.png"
                                                        alt='Phone'
                                                        width={18} height={18}
                                                        priority={true}
                                                    />
                                                </span>
                                                <Link href="mailto:info@eclicksoftwares.com" style={{pointerEvents: 'none'}}>info@eclicksoftwares.com</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className={Styles.copyright}>
                    <div className="container">
                        <hr />
                        <div className="d-flex align-items-center justify-content-between gap-2">
                            <p className='mb-0'>Copyright © 2025 <Link href={'https://www.eclicksoftwares.com/'} target='_blank'>Eclick Softwares & Solutions Pvt Ltd.</Link></p>
                            <ul className={`${Styles.inlineLink} d-flex flex-wrap`}>
                                {subFooterMenu?.map(child => (
                                    <li key={child.id}>
                                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/${child.url}`}>
                                        {child.label}
                                    </Link>
                                    </li>
                                ))}
                                {/* <li><Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/privacy-policy`}>Privacy Policy</Link></li>
                                <li><Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/refund-policy`}>Refund Policy</Link></li> */}
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