"use client";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
                    title: "Our Company",
                    children: [
                        { title: "Our Clients", slug: "/our-clients" },
                        { title: "Client Testimonials", slug: "/our-testimonials" },
                        { title: "Our Partners", slug: "/our-partners" },
                        { title: "About the Company", slug: "/about-us" },
                    ],
                    poster: "/assets/images/navigation/about-poster.jpg",
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
            // megaMenuBlocks: [
            //    {
            //       title: "Hire Developers",
            //       children: [
            //          { title: "WordPress Developer", slug: "/hire-wordpress-developer" },
            //          { title: "React Developer", slug: "/hire-react-developer" },
            //          { title: "Laravel Developer", slug: "/hire-laravel-developer" },
            //          { title: "Node.js Developer", slug: "/hire-nodejs-developer" },
            //          { title: "PHP Developer", slug: "/hire-php-developer" },
            //          { title: "UI/UX Designer", slug: "/hire-ui-ux-designer" },
            //       ],
            //       poster: "/assets/images/navigation/hire-poster.jpg",
            //    },
            //    {
            //       title: "Engagement Models",
            //       children: [
            //          { title: "Dedicated Team Model", slug: "/dedicated-team-model" },
            //          { title: "Fixed Price Model", slug: "/fixed-price-model" },
            //          { title: "Hourly / Flexible Hiring", slug: "/hourly-flexible-hiring" },
            //       ],
            //       poster: "/assets/images/navigation/hire-poster.jpg",
            //    },
            // ],
        },
        {
            title: "Portfolio",
            slug: "/portfolio",
            portfolioBlocks: {
                title: "Creating a contest is fast and free.",
                description:
                    "Join the thousands of entrepreneurs who are launching their contests every week and harnessing the awesome power of crowdsourcing.",
                children: [
                    {
                        title: "Logo Design",
                        slug: "logo-design",
                        image: "/assets/images/navigation/logo-design.jpg",
                    },
                    {
                        title: "Website Design",
                        slug: "website-design",
                        image: "/assets/images/navigation/website.jpg",
                    },
                    {
                        title: "Graphics Design",
                        slug: "graphics-design",
                        image: "/assets/images/navigation/flyer-design.jpg",
                    },
                    {
                        title: "Mobile App Design",
                        slug: "mobile-app-design",
                        image: "/assets/images/navigation/mobile-app-design.jpg",
                    },
                    {
                        title: "Business Card",
                        slug: "business-card",
                        image: "/assets/images/navigation/business-card.jpg",
                    },
                    {
                        title: "Packaging Design",
                        slug: "packaging-design",
                        image: "/assets/images/navigation/packaging-design.jpg",
                    },
                    {
                        title: "T-Shirt Design",
                        slug: "t-shirt-design",
                        image: "/assets/images/navigation/t-shirt-design.jpg",
                    },
                    {
                        title: "Illustration",
                        slug: "illustration",
                        image: "/assets/images/navigation/illustration.jpg",
                    }
                ]
            }
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

interface MenuItem {
    url?: string;
    label?: string;
    children?: MenuItem[] | null;
}
type SocialItem = {
    site_social_link_name?: string;
    site_social_link_url?: string;
    site_social_icon?: string;
    site_class_name?: string;
}
interface DataProps {
    menu?: MenuItem[] | null;
    show: boolean;
    handleClose: () => void;
    social?: SocialItem[];
}
const ResponsiveHeader = ({ menu = [], show, handleClose, social }: DataProps) => {
    const appLink = process.env.NEXT_PUBLIC_ENV_URL || "";
    const pathName = usePathname();

    // Navigation Mobile Menu
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    // Toggle
    const currentRef = useRef<HTMLUListElement>(null);
    const toggleMenu = (index: number) => {
        setOpenIndex(prev => prev === index ? null : index)
    }
    useEffect(() => {
        handleClose();
    }, [pathName]);


    return (
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/`} className="responsiveLogo">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/eclick-logo.webp`}
                        alt="Logo"
                        width={274}
                        height={69}
                        priority={true}
                    />
                </Link>
            </Offcanvas.Header>
            <Offcanvas.Body className="responsiveBody">
                {menuMaps ? (
                    <nav role="navigation" className="responsiveMenu">
                        {/* <Stack as="ul" className="mainMenu">
                            {menu.map((item, index) => {
                                const itemPath = item.url?.startsWith("/")
                                    ? item.url
                                    : `/${item.url}`;

                                return (
                                    <li
                                        key={index}
                                        className={`responsive-menuItem 
                                        ${item.children ? "responsive-children-item" : ""}
                                        ${pathName === itemPath ? "active" : ""}
                                        ${openIndex === index ? "showSubmenu" : ""}`}
                                    >

                                        <MenuLink href={`${appLink}${itemPath}`}>
                                            {item.label}
                                        </MenuLink>

                                        {item.children && (
                                            <span
                                                className="submenuToggle"
                                                onClick={() => toggleMenu(index)}
                                            >
                                                <FontAwesomeIcon icon={faChevronDown} />
                                            </span>
                                        )}

                                        {item.children && item.children.length > 0 && (
                                            <ul className={`responsive-submenu ${openIndex === index ? "open" : ""}`} ref={currentRef}>
                                                {item.children.map((child, childIndex) => {
                                                    const childPath = child.url?.startsWith("/")
                                                        ? child.url
                                                        : `/${child.url}`;

                                                    return (
                                                        <li key={childIndex}>
                                                            <MenuLink href={`${appLink}${childPath}`}>
                                                                {child.label}
                                                            </MenuLink>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </Stack> */}
                        <Stack as="ul" className="mainMenu">
                            {menuMaps.menu.map((item, index) => {
                                const hasChildren =
                                    item.megaMenu ||
                                    item.megaMenuBlocks ||
                                    item.portfolioBlocks;

                                return (
                                    <li
                                        key={index}
                                        className={`responsive-menuItem
                                        ${hasChildren ? "responsive-children-item" : ""}
                                        ${openIndex === index ? "showSubmenu" : ""}`}
                                    >
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

                                        {/* Submenu */}
                                        {hasChildren && (
                                            <ul
                                                className={`responsive-submenu ${openIndex === index ? "open" : ""
                                                    }`}
                                            >
                                                {/* Mega Menu Tabs */}
                                                {item.megaMenu?.tabs?.map((tab, tabIndex) => (
                                                    <li key={tabIndex} className="submenu-group">
                                                        <div className="submenu-title">
                                                            {tab.title}
                                                        </div>

                                                        {tab.submenu?.length > 0 && (
                                                            <ul>
                                                                {tab.submenu.map((sub, subIndex) => (
                                                                    <li key={subIndex}>
                                                                        <MenuLink href={sub.slug}>
                                                                            {sub.title}
                                                                        </MenuLink>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}

                                                {/* Mega Menu Blocks */}
                                                {item.megaMenuBlocks?.map((block, blockIndex) => (
                                                    <li key={blockIndex} className="submenu-group">
                                                        <div className="submenu-title">
                                                            {block.title}
                                                        </div>

                                                        {block.children?.length > 0 && (
                                                            <ul>
                                                                {block.children.map((child, childIndex) => (
                                                                    <li key={childIndex}>
                                                                        <MenuLink href={child.slug}>
                                                                            {child.title}
                                                                        </MenuLink>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}

                                                {/* Portfolio Blocks */}
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
                ) : (
                    <p className="text-white mt-3 ps-2">Menus not Found</p>
                )}
            </Offcanvas.Body>
            <Offcanvas.Header className="responsive_social">
                <span>Follow On:</span>
                <Social social={social} />
            </Offcanvas.Header>
        </Offcanvas>
    )
}

export default ResponsiveHeader
