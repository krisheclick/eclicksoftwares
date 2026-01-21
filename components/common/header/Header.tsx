"use client"
import Link from "next/link";
import Styles from "./style.module.css";
import Image from "next/image";
import Navigation from "./Navigation";
import { useThemeContext } from "@/context/ThemeContext";
import { useEffect } from "react";

type MenuItem = {
    id: number;
    url: string;
    label: string;
    type: string;
    children?: MenuItem[];
}

type MenuData = {
    [key: string]: MenuItem;
}

type MenuProps = {
    menuData: MenuItem[];
}
const Header = ({ menuData }: MenuProps) => {
    const { headerExtraClass, setCommonBanner } = useThemeContext();

    useEffect(() => {
        const body = document.body as HTMLElement;
        let previousScroll = 0;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 20) {
                if (currentScroll > previousScroll) {
                    body.classList.remove('sticky');
                } else {
                    body.classList.add('sticky');
                }
            } else if (currentScroll < 20) {
                body.classList.remove('sticky');
                body.classList.add('stickyFixed');
            } else {
                body.classList.add('sticky');
                body.classList.add('stickyFixed');
            }

            previousScroll = currentScroll;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Common Banner
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-setting`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                setCommonBanner(json?.response_data?.filteredSettings?.common_banner ?? null);
            } catch (err) {
                console.error('Site-setting API error:', err);
            }
        };

        fetchData();
    }, [setCommonBanner]);



    return (
        <header role="banner" className={`header_main ${Styles.mainHeader ?? ''} ${headerExtraClass ?? ''}`}>
            <div className="container">
                <div className="header_wrap d-flex align-items-center justify-content-between gap-3">
                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className={Styles.logo}>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/eclick-logo.webp`}
                            alt="Logo"
                            width={274}
                            height={69}
                            priority={true}
                        />
                    </Link>
                    <div className={Styles.navWrapper}>
                        <Navigation />
                        <Link href="tel:+913340044425" className={`eclick-btn-connect ${Styles.headerButton ?? ''}`}>
                            <span>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                    alt="Phone"
                                    width={18} height={18}
                                    loading="lazy"
                                />
                            </span>
                            <em>Connect</em>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;