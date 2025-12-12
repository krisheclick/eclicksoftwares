"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Styles from "./navigation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Col, Container, Row } from "react-bootstrap";
import { usePathname } from "next/navigation";

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
                  { title: "About Us", slug: "/about-us" },
                  { title: "Team", slug: "/team" },
                  { title: "Testimonials", slug: "/testimonials" },
                  { title: "Partners", slug: "/partners" },
               ],
               poster: "/assets/images/navigation/welcome-poster.jpg",
            },
         ],
      },
      {
         title: "Solutions",
         slug: "/solutions",
         megaMenu: {
            tabs: [
               {
                  title: "Web Design & Development",
                  icon: "/assets/images/navigation/wdd.png",
                  slug: "web-design-development",
                  submenu: [
                     { title: "Web Design", slug: "/solutions/web-design-development/website-design" },
                     { title: "Content Based Website", slug: "/solutions/web-design-development/content-based-website" },
                     { title: "e-Commerce", slug: "/solutions/web-design-development/e-commerce" },
                     { title: "Maintenance & Support", slug: "/solutions/web-design-development/maintenance-support" },
                     { title: "API-Integration", slug: "/solutions/web-design-development/api-integration" },
                     { title: "Customized Website", slug: "/solutions/web-design-development/customized-website" },
                  ],
                  poster: "/assets/images/navigation/menu-poster.png",
               },
               {
                  title: "Mobile App Development",
                  icon: "/assets/images/navigation/mad.png",
                  slug: "mobile-app-development",
                  submenu: [
                     { title: "Android App Development", slug: "/solutions/mobile-app-development/android-app-development" },
                     { title: "iOS App Development", slug: "/solutions/mobile-app-development/ios-app-development" },
                     { title: "Hybrid App Development", slug: "/solutions/mobile-app-development/hybrid-app-development" },
                  ],
                  poster: "/assets/images/navigation/mad.jpg",
               },
               {
                  title: "Graphics Design",
                  icon: "/assets/images/navigation/gd.png",
                  slug: "graphics-design",
                  submenu: [
                     { title: "Visual Identity Design (Branding)", slug: "/solutions/graphics-design/visual-identity-design-branding" },
                     { title: "Marketing & Advertising Design", slug: "/solutions/graphics-design/marketing-advertising-design" },
                     { title: "UI Design", slug: "/solutions/graphics-design/ui-user-interface-design" },
                     { title: "UX Design", slug: "/solutions/graphics-design/ux-user-experience-design" },
                     { title: "Publication Design", slug: "/solutions/graphics-design/publication-design" },
                     { title: "Illustration Design", slug: "/solutions/graphics-design/illustration-design" },
                     { title: "Infographic Design", slug: "/solutions/graphics-design/infographic-design" },
                  ],
                  poster: "/assets/images/navigation/graphic.jpg",
               },
               {
                  title: "Digital Marketing",
                  icon: "/assets/images/navigation/dm.png",
                  slug: "digital-marketing",
                  submenu: [
                     { title: "Search Engine Optimization", slug: "/solutions/digital-marketing/search-engine-optimization" },
                     { title: "Social Media Marketing", slug: "/solutions/digital-marketing/social-media-marketing" },
                     { title: "Pay Per Click (PPC)", slug: "/solutions/digital-marketing/pay-per-click" },
                     { title: "Email Marketing", slug: "/solutions/digital-marketing/email-marketing" },
                     { title: "Content Writing", slug: "/solutions/digital-marketing/content-writing" },
                     { title: "Local SEO", slug: "/solutions/digital-marketing/local-seo" },
                     { title: "Online Reputation Management", slug: "/solutions/digital-marketing/online-reputation-management" },
                     { title: "App Store Optimization", slug: "/solutions/digital-marketing/app-store-optimization" },
                  ],
                  poster: "/assets/images/navigation/digital.jpg",
               },
               {
                  title: "Managed Service",
                  icon: "/assets/images/navigation/ms.png",
                  slug: "managed-service",
                  submenu: [
                     { title: "Domain", slug: "/solutions/managed-service/domain" },
                     { title: "Hosting", slug: "/solutions/managed-service/hosting" },
                     { title: "Networking", slug: "/solutions/managed-service/networking" },
                  ],
                  poster: "/assets/images/navigation/manage-service.jpg",
               },
            ],
         },
      },
      {
         title: "Hire Developers",
         slug: "/hire-developers",
         megaMenuBlocks: [
            {
               title: "Hire Developers",
               children: [
                  { title: "WordPress Developer", slug: "/hire-wordpress-developer" },
                  { title: "React Developer", slug: "/hire-react-developer" },
                  { title: "Laravel Developer", slug: "/hire-laravel-developer" },
                  { title: "Node.js Developer", slug: "/hire-nodejs-developer" },
                  { title: "PHP Developer", slug: "/hire-php-developer" },
                  { title: "UI/UX Designer", slug: "/hire-ui-ux-designer" },
               ],
               poster: "/assets/images/navigation/hire-poster.jpg",
            },
            {
               title: "Engagement Models",
               children: [
                  { title: "Dedicated Team Model", slug: "/dedicated-team-model" },
                  { title: "Fixed Price Model", slug: "/fixed-price-model" },
                  { title: "Hourly / Flexible Hiring", slug: "/hourly-flexible-hiring" },
               ],
               poster: "/assets/images/navigation/hire-poster.jpg",
            },
         ],
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
                  image: "/assets/images/navigation/1.png",
               },
               {
                  title: "Website Design",
                  slug: "website-design",
                  image: "/assets/images/navigation/website.png",
               },
               {
                  title: "T-Shirt Design",
                  slug: "t-shirt-design",
                  image: "/assets/images/navigation/illustration.png",
               },
               {
                  title: "Mobile App Design",
                  slug: "mobile-app-design",
                  image: "/assets/images/navigation/mobile.png",
               },
               {
                  title: "Business Card",
                  slug: "business-card",
                  image: "/assets/images/navigation/location-2.jpg",
               },
               {
                  title: "Packaging Design",
                  slug: "packaging-design",
                  image: "/assets/images/navigation/graphic-design.png",
               },
               {
                  title: "Flyer Design",
                  slug: "flyer-design",
                  image: "/assets/images/navigation/3d.png",
               },
               {
                  title: "Illustration",
                  slug: "illustration",
                  image: "/assets/images/navigation/location-4.jpg",
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
                           key={tab.slug}
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
                        {current.submenu.map((sub) => (
                           <li key={sub.slug} className={Styles.navItem}>
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
   console.log('itemClass', itemClass)
   if(itemClass === "#"){
      col1 = 9;
      col2 = 3;
   }else{
      col1 = 6;
      col2 = 6;
   }

   return (
      <div className={`${Styles.megaMenu} ${megaMenuActive ? Styles.showMegaMenu : ""} ${Styles.megaMenuBlock}`}>
         <Container className="ps-2 pe-2">
            <Row className={`gx-3 ${Styles.mega_menu_row ?? ''}`}>
               <Col lg={col1}>
                  <figure className={Styles.navPoster}>
                     <Image src={posterBlock.poster} alt={posterBlock.title} fill style={{ objectFit: "cover", objectPosition: "center" }} />
                  </figure>
               </Col>

               <Col lg={col2}>
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