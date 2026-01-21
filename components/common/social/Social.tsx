"use client";

import Link from "next/link";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebookF,
    faInstagram,
    faLinkedinIn,
    faXTwitter,
    faYoutube,
    IconDefinition,
} from "@fortawesome/free-brands-svg-icons";

/* ================= TYPES ================= */

export type SocialItem = {
    site_social_link_name?: string;
    site_social_link_url?: string;
    site_social_icon?: string;
    site_class_name?: string;
};

type Props = {
    itemSize?: string;
    social?: SocialItem[];
};

/* ================= COMPONENT ================= */

const Social = ({ itemSize, social }: Props) => {
    /* -------- Icon Map -------- */
    const iconMap: Record<string, IconDefinition> = {
        "fa-facebook-f": faFacebookF,
        "fa-instagram": faInstagram,
        "fa-linkedin-in": faLinkedinIn,
        "fa-x-twitter": faXTwitter,
        "fa-youtube": faYoutube,
    };

    /* -------- Extract LAST fa-* class -------- */
    const getIconKey = (icon?: string): string => {
        if (!icon) return "";
        const matches = icon.match(/fa-[a-z0-9-]+/gi);
        return matches ? matches[matches.length - 1] : "";
    };

    if (!social?.length) return null;

    return (
        <div className={`${Styles.social} ${itemSize ? Styles[itemSize] : ""}`}>
            {social.map((item, index) => {
                const iconKey = getIconKey(item.site_social_icon);
                const Icon = iconMap[iconKey] ?? faYoutube;

                return (
                    <Link
                        key={index}
                        href={item.site_social_link_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.site_social_link_name}
                        className={`${Styles.iconLink} ${
                            item.site_class_name ? Styles[item.site_class_name] : ""
                        }`}
                    >
                        <FontAwesomeIcon icon={Icon} />
                    </Link>
                );
            })}
        </div>
    );
};

export default Social;
