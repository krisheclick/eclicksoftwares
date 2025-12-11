"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Parentstyles from "../style.module.css";
import Styles from "./style.module.css";
import { usePathname } from "next/navigation";
interface Category {
    title: string;
    slug: string;
    catCount: number;
}

const Blogcategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const cats = [
            { title: "All", slug: "", catCount: 120 },
            { title: "App Development", slug: "app-development", catCount: 18 },
            { title: "Development Tools", slug: "development-tools", catCount: 10 },
            { title: "DevOps", slug: "devops", catCount: 7 },
            { title: "Ecommerce", slug: "ecommerce", catCount: 14 },
            { title: "Marketing & SEO", slug: "marketing-seo", catCount: 22 },
            { title: "Opinion", slug: "opinion", catCount: 6 },
            { title: "Software Testing", slug: "software-testing", catCount: 9 },
            { title: "Technology", slug: "technology", catCount: 25 },
            { title: "Tips", slug: "tips", catCount: 13 },
            { title: "UI/UX", slug: "ui-ux", catCount: 11 },
            { title: "Web Development", slug: "web-development", catCount: 30 },
            { title: "Web Hosting", slug: "web-hosting", catCount: 5 },
            { title: "Other", slug: "other", catCount: 4 }
        ];
        setCategories(cats);
        setLoading(false);
    }, []);

    return (
        <div className={`${Parentstyles.widget} ${Styles.category_widget ?? ''}`}>
            <div className={Parentstyles.widget_title}>Categories</div>
            <div className={Styles.catList}>
                {loading ? (
                    <ul className={`noList ${Styles.skeletonList}`}>
                        {[...Array(6)].map((_, i) => (
                            <li key={i} className="skeleton w-100"></li>
                        ))}
                    </ul>
                ) : (
                    <ul className="noList">
                        {categories.map((cat) => {
                            const blogLink = process.env.NEXT_PUBLIC_ENV_URL;
                            return (
                                <li
                                    key={cat.slug}
                                    className={`${Styles.catLinkParent} ${pathname === `/blog/${cat.slug}` ? Styles.active : ''
                                        }`}
                                >
                                    <Link href={`${blogLink}/blog/${cat.slug}`} className={Styles.catLink}>
                                        <span>{cat.title}</span> <em>({cat.catCount})</em>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Blogcategory;