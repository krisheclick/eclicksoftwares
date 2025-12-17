"use client";
import Parentstyles from "../style.module.css";
import Styles from "./style.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
type Post = {
    blog_feature_image_path: string;
    blog_title: string;
    blog_slug: string;
    blog_short_description: string;
    publish_date: string;
    Category: {
        blog_category_feature_image_path: string;
        blog_category_title: string;
        blog_category_slug: string;
    };
}
const PopularPost = () => {
    const [hasLoading, setHasLoading] = useState(true)
    const [recentPost, setRecentPost] = useState<Post[] | null>(null);
    const dataFetch = async() => {
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}blogs`);
            const {response_data} = await response.json();
            setRecentPost(response_data?.blogData);
        }catch(err: unknown){
            console.log('Data fetching is something wrong ', (err as Error).message)
        }finally{
            setHasLoading(false)
        }
    }

    useEffect(() => {
        dataFetch();
    }, []);
    const pathname = usePathname();
    return (
        (recentPost?.length ?? 0) > 0 && (
            <div className={`${Parentstyles.widget} ${Styles.recent_posts ?? ''}`}>
                <div className={Parentstyles.widget_title}>Recent Posts</div>
                <div className={Styles.postList}>
                    {!hasLoading ? (
                        <ul className="noList">
                            {recentPost?.slice(0, 5)?.map((postData, postIndex) => {
                                const { blog_feature_image_path: blog_poster, Category: blog_category, blog_title, blog_slug, publish_date } = postData;
                                const blogLink = `${process.env.NEXT_PUBLIC_ENV_URL}`;
                                const dateObj = publish_date ? new Date(publish_date) : null;
                                const formattedDate = dateObj?.toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short"
                                }) + ", " + dateObj?.getFullYear();
                                return (
                                    <li
                                        key={postIndex}
                                        className={`${Styles.postParent} ${pathname === `/blog/${blog_category?.blog_category_slug}/${blog_slug}` ? Styles.active : ''
                                            }`}
                                    >
                                        <Link href={`${blogLink}/blog/${blog_category?.blog_category_slug}/${blog_slug}`} className={Styles.postBox}>
                                            <figure className={Styles.poster}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${blog_poster}`}
                                                    alt={blog_title || "Blog Title"}
                                                    fill
                                                    priority
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                                                    }}
                                                    className={Styles.cardImage}
                                                />
                                            </figure>
                                            <div className={Styles.postcontent}>
                                                <div className={Styles.title}>{blog_title}</div>
                                                <em className={Styles.postDate}>{formattedDate}</em>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <ul className={`noList ${Styles.skeletonList ?? ''}`}>
                            {[...Array(5)].map((_, postIndex) => (
                                <li
                                    key={postIndex}
                                    className={`${Styles.postParent} skeleton w-100 p-2`}
                                >
                                    <div className={Styles.postBox}>
                                        <figure className={`skeleton ${Styles.poster}`}></figure>
                                        <div className={Styles.postcontent}>
                                            <div className="skeleton skeletonText w-100"></div>
                                            <div className="skeleton skeletonText w-75"></div>
                                            <em className="skeleton skeletonText w-25"></em>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    )
}

export default PopularPost;