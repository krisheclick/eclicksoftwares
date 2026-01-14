"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row } from "react-bootstrap";
import { usePathname } from "next/navigation";
import Styles from "./navigation.module.css";

// ----------------------
// MENU DATA
// ----------------------
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
                  { title: "Our Journey & Milestones", slug: "/our-journey" },
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
                     { title: "Presentations & Reports", slug: "/solutions/graphics-design/presentations-reports" },
                     { title: "Infographic", slug: "/solutions/graphics-design/infographic" },
                     { title: "Packaging Design", slug: "/solutions/graphics-design/packaging-design" },
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
                     { title: "Influencer Marketing", slug: "/solutions/digital-marketing-growth/influencer-marketing" },
                     { title: "E-Commerce Marketing", slug: "/solutions/digital-marketing-growth/e-eommerce-marketing" },
                     { title: "Online Reputation Management", slug: "/solutions/digital-marketing-growth/online-reputation-management" },
                     { title: "App Store Optimization", slug: "/solutions/digital-marketing-growth/app-store-optimization" },
                  ],
                  poster: "/assets/images/navigation/digital.jpg",
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
                  title: "T-Shirt Design",
                  slug: "t-shirt-design",
                  image: "/assets/images/navigation/t-shirt-design.jpg",
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
                  title: "Flyer Design",
                  slug: "flyer-design",
                  image: "/assets/images/navigation/flyer-design.jpg",
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

// ----------------------
// TYPES
// ----------------------
type SubMenuItem = {
   title: string;
   slug: string;
};
type MegaMenuTab = {
   title: string;
   icon: string;
   slug: string;
   submenu: SubMenuItem[];
   poster: string;
};
type MegaMenu = {
   tabs: MegaMenuTab[]
};
type MegaMenuBlock = {
   title: string;
   children: SubMenuItem[];
   poster: string;
};
type PortfoiloItem = {
   title: string;
   slug: string;
   image: string;
}
type PortfoiloData = {
   title: string;
   description: string;
   children: PortfoiloItem[];
}
type MenuItemType = {
   title: string;
   slug: string;
   megaMenu?: MegaMenu;
   megaMenuBlocks?: MegaMenuBlock[];
   portfolioBlocks?: PortfoiloData;
};

// ----------------------
// NAVIGATION COMPONENT
// ----------------------
export default function Navigation() {
   const pathname = usePathname();
   const [hydrated, setHydrated] = useState(false);

   useEffect(() => {
      setHydrated(true);
   }, []);

   if (!hydrated) return null;

   return (
      <nav role="navigation" className={Styles.navMenu}>
         <ul className={Styles.menu_wrapper}>
            {menuMaps.menu.map((item, index) => (
               <MenuItem key={index} item={item} pathname={pathname} />
            ))}
         </ul>
      </nav>
   );
}

// ----------------------
// MENU ITEM
// ----------------------
type MenuItemProps = { item: MenuItemType; pathname: string };

function MenuItem({ item, pathname }: MenuItemProps) {
   const [activeTab, setActiveTab] = useState<number>(0);
   const isActive = pathname === item.slug;
   const [open, setOpen] = useState(false);
   useEffect(() => {
      setOpen(false);
   }, [pathname]);

   return (
      <li
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}
         className={`${Styles.navItem} ${isActive ? Styles.current : ""} ${item.megaMenu || item.megaMenuBlocks || item.portfolioBlocks ? Styles.childrenMenu ?? '' : ""}`}
      >
         <Link
            href={`${process.env.NEXT_PUBLIC_ENV_URL || ""}${item.slug}`}
            className={Styles.navLink}
            onClick={() => setOpen(false)}
         >
            {item.title}
            {(item.megaMenu || item.megaMenuBlocks || item.portfolioBlocks) && <FontAwesomeIcon icon={faAngleDown} />}
         </Link>
         {item.megaMenu && (
            <MegaMenuComponent megaMenuActive={open} megaMenu={item.megaMenu} activeTab={activeTab} setActiveTab={setActiveTab} />
         )}
         {item.megaMenuBlocks && <MegaMenuBlocks itemClass={item.slug} megaMenuActive={open} megaMenu={item.megaMenuBlocks} />}
         {item.portfolioBlocks && <PortfolioMegaMenu megaMenuActive={open} megaMenu={item.portfolioBlocks} />}
      </li>
   );
}

// ----------------------
// MEGA MENU COMPONENT
// ----------------------
type MegaMenuProps = { megaMenu: MegaMenu; activeTab: number; megaMenuActive: boolean; setActiveTab: (index: number) => void };

function MegaMenuComponent({ megaMenu, activeTab, setActiveTab, megaMenuActive}: MegaMenuProps) {
   const tabs = megaMenu.tabs;
   const current = tabs[activeTab];

   return (
      <div className={`${Styles.megaMenu} ${megaMenuActive ? Styles.showMegaMenu : ""}`}>
         <Container className="ps-2 pe-2">
            <Row className={`gx-3 ${Styles.mega_menu_row ?? ''}`}>
               <Col lg={4} xl={3}>
                  <ul className={Styles.tabSubmenu}>
                     {tabs.map((tab, index) => (
                        <li
                           key={index}
                           onMouseEnter={() => setActiveTab(index)}
                           className={`${Styles.navItem} ${index === activeTab ? Styles.activeMenu : ""}`}
                        >
                           <span className={Styles.menuIcon}>
                              <Image src={tab.icon} alt={tab.title} width={40} height={40} />
                           </span>
                           <Link href={`${process.env.NEXT_PUBLIC_ENV_URL || ""}/solutions/${tab.slug}`}>{tab.title}</Link>
                           <bdi className={Styles.circleIcon}>
                              <FontAwesomeIcon icon={faAngleRight} />
                           </bdi>
                        </li>
                     ))}
                  </ul>
               </Col>

               <Col lg={8} xl={9}>
                  <div className={Styles.submenuLayout}>
                     <ul className={Styles.submenu}>
                        {current.submenu.map((sub, index) => (
                           <li key={index} className={Styles.navItem}>
                              <Link href={`${process.env.NEXT_PUBLIC_ENV_URL || ""}${sub.slug}`} className={Styles.navLink}>
                                 <FontAwesomeIcon icon={faAngleRight} />
                                 <span>{sub.title}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>

                     <figure className={Styles.navPoster}>
                        <Image src={current.poster} alt={current.title} fill />
                     </figure>
                  </div>
               </Col>
            </Row>
         </Container>
      </div>
   );
}

// ----------------------
// MEGA MENU BLOCKS
// ----------------------
type MegaMenuBlocksProps = { megaMenu: MegaMenuBlock[]; megaMenuActive: boolean; itemClass: string;};

function MegaMenuBlocks({ megaMenu, megaMenuActive, itemClass}: MegaMenuBlocksProps) {
   const posterBlock = megaMenu[0];
   let col1, col2;
   if(itemClass === "#"){
      col1 = 3;
      col2 = 9;
   }else{
      col1 = 6;
      col2 = 6;
   }

   return (
      <div className={`${Styles.megaMenu} ${megaMenuActive ? Styles.showMegaMenu : ""} ${Styles.megaMenuBlock}`}>
         <Container className="ps-2 pe-2">
            <Row className={`gx-3 ${Styles.mega_menu_row ?? ''}`}>
               <Col lg={col1}>
                  <div className={Styles.subMenuBlockWrapper}>
                     {megaMenu.map((block) => (
                        <div className={Styles.subMenuBlock} key={block.title}>
                           <div className={`titleTag ${Styles.blockTitle}`}>{block.title}</div>
                           <ul className={Styles.submenu}>
                              {block.children.map((sub) => (
                                 <li key={sub.slug} className={Styles.navItem}>
                                    <Link href={`${process.env.NEXT_PUBLIC_ENV_URL || ""}${sub.slug}`} className={Styles.navLink}>
                                       <FontAwesomeIcon icon={faAngleRight} />
                                       <span>{sub.title}</span>
                                    </Link>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}
                  </div>
               </Col>

               <Col lg={col2}>
                  <figure className={Styles.navPoster}>
                     <Image src={posterBlock.poster} alt={posterBlock.title} fill style={{ objectFit: "cover", objectPosition: "center" }} />
                  </figure>
               </Col>
            </Row>
         </Container>
      </div>
   );
}

/* =====Portflio Menu Blocks===== */
type PortfolioMenuProps = { megaMenu: PortfoiloData; megaMenuActive: boolean;}
const PortfolioMegaMenu = ({ megaMenu, megaMenuActive}: PortfolioMenuProps) => {
   const mediaUrl = process.env.NEXT_PUBLIC_assetPrefix || "";
   return (
      <div className={`${Styles.megaMenu} ${Styles.megaMenuPortfolio} ${megaMenuActive ? Styles.showMegaMenu : ""}`}>
         <Container className="ps-2 pe-2">
            <div className={Styles.portfolioList}>
               <ul>
                  {megaMenu.children.map((item, index) => {
                     const { title, slug, image } = item;
                     const poster = image || "/assets/images/noimage.jpg";
                     return (
                        <li key={index}>
                           <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/portfolio/${slug}`}
                              className={Styles.portfolioBox}
                           >
                              <figure className={Styles.portfolioPoster}>
                                 <Image
                                    src={`${mediaUrl}${poster}`}
                                    alt={title || "Poster Title"}
                                    fill
                                 />
                              </figure>
                              <div className={Styles.posterTitle}>{title}</div>
                           </Link>
                        </li>
                     )
                  })}
               </ul>
            </div>
         </Container>
      </div>
   )
}