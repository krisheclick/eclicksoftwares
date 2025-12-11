"use client";
import { useEffect, useState } from "react";
import Parentstyles from "../style.module.css";
import Styles from "./style.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
interface Poststype {
    title?: string;
    permalink?: string;
    thumbnail?: string;
    publishdate?: string;
}
const PopularPost = () => {
    const [hasLoading, setLoading] = useState(true);
    const [popularPost, setPopularPost] = useState<Poststype[] | null>([]);
    const pathname = usePathname();

    useEffect(() => {
        const posts = [
            {
                title: 'How to Optimize Your Landing Page to Grab More Leads?',
                thumbnail: '/blog-1.png',
                publishdate: '15 Jan 2020',
                permalink: '/how-to-optimize-your-landing-page-to-grab-more-leads'
            },
            {
                title: 'Most effective digital marketing strategies for real estate',
                thumbnail: '/blog-2.png',
                publishdate: '16 Jan 2020',
                permalink: '/most-effective-digital-marketing-strategies-for-real-estate'
            },
            {
                title: 'Why does your business require custom websites over templates?',
                thumbnail: '/blog-4.png',
                publishdate: '17 Jan 2020',
                permalink: '/why-does-your-business-require-custom-websites-over-templates'
            },
            {
                title: 'How to Optimize Your Landing Page to Grab More Leads?',
                thumbnail: '/blog-5.jpg',
                publishdate: '15 Jan 2020',
                permalink: '/how-to-optimize-your-landing-page-to-grab-more-leads'
            },
            {
                title: 'Most effective digital marketing strategies for real estate',
                thumbnail: '/blog-2.png',
                publishdate: '16 Jan 2020',
                permalink: '/most-effective-digital-marketing-strategies-for-real-estate'
            },
            {
                title: 'Why does your business require custom websites over templates?',
                thumbnail: '',
                publishdate: '29 Jan 2020',
                permalink: '/why-does-your-business-require-custom-websites-over-templates'
            },
        ];
        setPopularPost(posts);
        setLoading(false);
    }, []);
    return (
        <div className={`${Parentstyles.widget} ${Styles.recent_posts ?? ''}`}>
            <div className={Parentstyles.widget_title}>Recent Posts</div>
            <div className={Styles.postList}>
                {hasLoading ? (
                    <ul className={`noList ${Styles.skeletonList}`}>
                        {[...Array(5)].map((_, i) => (
                            <li key={i} className="skeleton w-100"></li>
                        ))}
                    </ul>
                ) : (
                    <ul className="noList">
                        {popularPost?.slice(0, 5)?.map((post, postIndex) => {
                            const blogLink = process.env.NEXT_PUBLIC_ENV_URL;
                            const mediaUrl = process.env.NEXT_PUBLIC_assetPrefix;
                            const thumbnail = post.thumbnail ? post.thumbnail : '/noimage.jpg';
                            return (
                                <li
                                    key={postIndex}
                                    className={`${Styles.postParent} ${pathname === `/blog/${post.permalink}` ? Styles.active : ''
                                        }`}
                                >
                                    <Link href={`${blogLink}/blog/${post.permalink}`} className={Styles.postBox}>
                                        <figure className={Styles.poster}>
                                            <Image
                                                src={`${mediaUrl}/assets/images/${thumbnail}`}
                                                alt={post.title || "Title"}
                                                fill
                                            />
                                        </figure>
                                        <div className={Styles.postcontent}>
                                            <div className={Styles.title}>{post.title}</div>
                                            <em className={Styles.postDate}>{post.publishdate}</em>
                                        </div>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default PopularPost;