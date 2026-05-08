"use client";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Offcanvas, Stack } from "react-bootstrap";
import { usePathname } from "next/navigation";
import "./responsiveHeader.css";
import Social from "../social/Social";
import MenuLink from "@/utils/custom_link";
const menuMaps = {
    menu: [
        {
            title: "Behind the Brand",
            slug: "#",
            megaMenuBlocks: [
                {
                    children: [
                        { title: "Our Clients", slug: "/our-clients" },
                        { title: "Client Testimonials", slug: "/our-testimonials" },
                        { title: "Our Partners", slug: "/our-partners" },
                        { title: "About the Company", slug: "/about-us" },
                        { title: "Blog", slug: "/blog" },
                    ],
                },
            ],
        },
        {
            title: "Solutions",
            slug: "#",
            megaMenu: {
                tabs: [
                    {
                        title: "AI Automations",
                        icon: "/assets/images/navigation/ms.png",
                        slug: "#",
                        // slug: "ai-automations",
                        submenu: [
                            { title: "Gen AI & Agentic AI", slug: "/solutions/ai-automations/gen-ai-agentic-ai" },
                            { title: "AI Chatbots", slug: "/solutions/ai-automations/ai-chatbots" },
                            { title: "AI Virtual Assistants", slug: "/solutions/ai-automations/ai-virtual-assistants" },
                            { title: "Custom AI Models", slug: "/solutions/ai-automations/custom-ai-models" },
                        ],
                        poster: "/assets/images/navigation/ai-agents.jpg",
                    },
                    {
                        title: "Web Design & Development",
                        icon: "/assets/images/navigation/wdd.png",
                        slug: "#",
                        // slug: "web-design-development",
                        submenu: [
                            { title: "Custom Web Design", slug: "/solutions/web-design-development/custom-web-design" },
                            { title: "UI/UX & Prototyping", slug: "/solutions/web-design-development/ui-ux-prototyping" },
                            { title: "Frontend Development", slug: "/solutions/web-design-development/frontend-development" },
                            { title: "Backend Development", slug: "/solutions/web-design-development/backend-development" },
                            { title: "CMS Web Development", slug: "/solutions/web-design-development/cms-web-development" },
                            { title: "E-Commerce Development", slug: "/solutions/web-design-development/e-commerce-development" },
                            { title: "Website Redesign", slug: "/solutions/web-design-development/website-redesign" },
                            { title: "API Integrations", slug: "/solutions/web-design-development/api-integrations" },
                            { title: "Performance & SEO", slug: "/solutions/web-design-development/performance-seo" },
                            { title: "Maintenance & Support", slug: "/solutions/web-design-development/website-maintenance-support" },
                        ],
                        poster: "/assets/images/navigation/web-design-development.jpg",
                    },
                    {
                        title: "Mobile App Solutions",
                        icon: "/assets/images/navigation/mad.png",
                        slug: "#",
                        // slug: "mobile-app-solutions",
                        submenu: [
                            { title: "Android App Development", slug: "/solutions/mobile-app-solutions/android-app-development" },
                            { title: "iOS App Development", slug: "/solutions/mobile-app-solutions/ios-app-development" },
                            { title: "Hybrid App Development", slug: "/solutions/mobile-app-solutions/hybrid-app-development" },
                            { title: "Progressive Web Apps", slug: "/solutions/mobile-app-solutions/progressive-web-apps" },
                        ],
                        poster: "/assets/images/navigation/mobile-app-solutions.jpg",
                    },
                    {
                        title: "Creative & Graphic Design",
                        icon: "/assets/images/navigation/gd.png",
                        slug: "#",
                        // slug: "graphics-design",
                        submenu: [
                            { title: "Branding & Visual Identity", slug: "/solutions/graphics-design/branding-visual-identity" },
                            { title: "Marketing Creatives", slug: "/solutions/graphics-design/marketing-creatives" },
                            { title: "UI & Web Graphics", slug: "/solutions/graphics-design/ui-web-graphics" },
                            { title: "Print Media Design", slug: "/solutions/graphics-design/print-media-design" },
                            // { title: "Presentations & Reports", slug: "/solutions/graphics-design/presentations-reports" },
                            // { title: "Infographic", slug: "/solutions/graphics-design/infographic" },
                            // { title: "Packaging Design", slug: "/solutions/graphics-design/packaging-design" },
                        ],
                        poster: "/assets/images/navigation/graphics-design.jpg",
                    },
                    {
                        title: "Digital Marketing & Growth",
                        icon: "/assets/images/navigation/dm.png",
                        slug: "#",
                        // slug: "digital-marketing-growth",
                        submenu: [
                            { title: "Search Engine Optimization", slug: "/solutions/digital-marketing-growth/search-engine-optimization" },
                            { title: "Paid Marketing", slug: "/solutions/digital-marketing-growth/paid-marketing" },
                            { title: "Social Media Marketing", slug: "/solutions/digital-marketing-growth/social-media-marketing" },
                            { title: "Content Writing", slug: "/solutions/digital-marketing-growth/content-writing" },
                            { title: "Email & Automation", slug: "/solutions/digital-marketing-growth/email-automation" },
                            { title: "Local SEO", slug: "/solutions/digital-marketing-growth/local-seo" },
                            { title: "E-Commerce Marketing", slug: "/solutions/digital-marketing-growth/e-commerce-marketing" },
                            { title: "Online Reputation Management", slug: "/solutions/digital-marketing-growth/online-reputation-management" },
                            { title: "App Store Optimization", slug: "/solutions/digital-marketing-growth/app-store-optimization" },
                        ],
                        poster: "/assets/images/navigation/digital-marketing.webp",
                    },
                    {
                        title: "Managed Services & Support",
                        icon: "/assets/images/navigation/ms.png",
                        slug: "#",
                        // slug: "managed-services-support",
                        submenu: [
                            { title: "Application Support & Maintenance", slug: "/solutions/managed-services-support/application-support-maintenance" },
                            { title: "Domain & Hosting Management", slug: "/solutions/managed-services-support/domain-hosting-management" },
                            { title: "Cloud & Infrastructure Management", slug: "/solutions/managed-services-support/cloud-infrastructure-management" },
                            { title: "Security & Compliance", slug: "/solutions/managed-services-support/security-compliance" },
                        ],
                        poster: "/assets/images/navigation/manage-support.jpg",
                    },
                ],
            },
        },
        {
            title: "Hire Developers",
            slug: "/hire-developers",
        },
        {
            title: "Portfolio",
            slug: "/portfolio",
            portfolioBlocks: {
                children: [
                    {
                        title: "Logo Design",
                        slug: "logo-design",
                    },
                    {
                        title: "Website Design",
                        slug: "website-design",
                    },
                    {
                        title: "Graphics Design",
                        slug: "graphics-design",
                    },
                ],
            },
        },
        {
            title: "Case Studies",
            slug: "/casestudies",
        },
        {
            title: "Contact Us",
            slug: "/contact-us",
        },
    ],
};
type SocialItem = {
    site_social_link_name?: string;
    site_social_link_url?: string;
    site_social_icon?: string;
    site_class_name?: string;
};
interface DataProps {
    show: boolean;
    handleClose: () => void;
    social?: SocialItem[];
}
const ResponsiveHeader = ({
    show,
    handleClose,
    social,
}: DataProps) => {
    const pathName = usePathname();
    // First Level
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    // Third Level
    const [openSubIndex, setOpenSubIndex] = useState<string | null>(null);
    // Main Menu Toggle
    const toggleMenu = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };
    // Third Level Toggle
    const toggleSubMenu = (key: string) => {
        setOpenSubIndex((prev) => (prev === key ? null : key));
    };
    useEffect(() => {
        handleClose();
    }, [pathName]);
    return (
        <Offcanvas show={show} onHide={handleClose}>
            {/* Header */}
            <Offcanvas.Header closeButton>
                <Link
                    href={`${process.env.NEXT_PUBLIC_ENV_URL}/`}
                    className="responsiveLogo"
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/eclick-logo.webp`}
                        alt="Logo"
                        width={274}
                        height={69}
                        priority
                    />
                </Link>
            </Offcanvas.Header>
            {/* Body */}
            <Offcanvas.Body className="responsiveBody">
                <nav role="navigation" className="responsiveMenu">
                    <Stack as="ul" className="mainMenu">
                        {menuMaps.menu.map((item, index) => {
                            const hasChildren =
                                item.megaMenu ||
                                item.megaMenuBlocks ||
                                item.portfolioBlocks;
                            return (
                                <li
                                    key={index}
                                    className={`
                                        responsive-menuItem
                                        ${hasChildren ? "responsive-children-item" : ""}
                                        ${openIndex === index ? "showSubmenu" : ""}
                                    `}
                                >
                                    {/* Main Link */}
                                    <div className="mainMenuWrapper">
                                        <MenuLink href={item.slug || "#"}>
                                            {item.title}
                                        </MenuLink>
                                        {hasChildren && (
                                            <span
                                                className="submenuToggle"
                                                onClick={() => toggleMenu(index)}
                                            >
                                                <FontAwesomeIcon icon={faChevronDown} />
                                            </span>
                                        )}
                                    </div>
                                    {/* Second Level */}
                                    {hasChildren && (
                                        <ul
                                            className={`
                                                responsive-submenu
                                                ${openIndex === index ? "open" : ""}
                                            `}
                                        >
                                            {/* Mega Menu Tabs */}
                                            {item.megaMenu?.tabs?.map((tab, tabIndex) => {
                                                const tabKey = `tab-${index}-${tabIndex}`;
                                                return (
                                                    <li
                                                        key={tabIndex}
                                                        className="submenu-group"
                                                    >
                                                        {/* Third Level Toggle */}
                                                        <div
                                                            className="submenu-title-wrapper"
                                                            onClick={() => toggleSubMenu(tabKey)}
                                                        >
                                                            <div className="submenu-title">
                                                                {tab.title}
                                                            </div>
                                                            <span className="submenuToggle">
                                                                <FontAwesomeIcon
                                                                    icon={faChevronDown}
                                                                />
                                                            </span>
                                                        </div>
                                                        {/* Third Level */}
                                                        {tab.submenu?.length > 0 && (
                                                            <ul
                                                                className={`
                                                                    third-level-menu responsive-submenu
                                                                    ${openSubIndex === tabKey
                                                                        ? "open"
                                                                        : ""}
                                                                `}
                                                            >
                                                                {tab.submenu.map(
                                                                    (sub, subIndex) => (
                                                                        <li key={subIndex}>
                                                                            <MenuLink href={sub.slug}>
                                                                                {sub.title}
                                                                            </MenuLink>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                            {/* Mega Menu Blocks */}
                                            {item.megaMenuBlocks?.map(
                                                (block, blockIndex) => {
                                                    const blockKey = `block-${index}-${blockIndex}`;
                                                    return (
                                                        block.children?.length > 0 && (
                                                            <ul
                                                                className={`
                                                                        third-level-menu
                                                                        ${openSubIndex === blockKey
                                                                        ? "open"
                                                                        : ""}
                                                                    `}
                                                            >
                                                                {block.children.map(
                                                                    (child, childIndex) => (
                                                                        <li key={childIndex}>
                                                                            <MenuLink
                                                                                href={child.slug}
                                                                            >
                                                                                {child.title}
                                                                            </MenuLink>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )
                                                    );
                                                }
                                            )}
                                            {item.portfolioBlocks?.children?.map(
                                                (portfolio, portfolioIndex) => (
                                                    <li key={portfolioIndex}>
                                                        <MenuLink
                                                            href={`/portfolio/${portfolio.slug}`}
                                                        >
                                                            {portfolio.title}
                                                        </MenuLink>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </Stack>
                </nav>
            </Offcanvas.Body>
            {/* Footer */}
            <Offcanvas.Header className="responsive_social">
                <span>Follow On:</span>
                <Social social={social} />
            </Offcanvas.Header>
        </Offcanvas>
    );
};
export default ResponsiveHeader;