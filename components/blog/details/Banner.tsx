"use client";
import { Container } from "react-bootstrap";
import Styles from "./style.module.css";
import Image from "next/image";
import { useBlogContext } from "@/context/Blogcontext";
const DetailsBanner = () => {
    const { pageData, hasLoading } = useBlogContext();
    const title = pageData?.blog_title;
    const publishDate = pageData?.publish_date;
    const dateObj = publishDate ? new Date(publishDate) : null;
    const formattedDate = dateObj?.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long"
    }) + ", " + dateObj?.getFullYear();
    const poster = pageData?.blog_banner_image_path;
    return (
        <div className={Styles.banner}>
            <Container>
                <div className={Styles.bannertext}>
                    {!hasLoading ? (
                        <>

                            <h1 className={Styles.heading}>{title ? title : "Blog Details"}</h1>
                            {publishDate && <span className={Styles.postDate}>Written on <em>{formattedDate}</em></span>}
                            
                        </>
                    ) : (
                        <>
                            <div className={`skeleton w-75 mb-2 ${Styles.skeletonHeading}`}></div>
                            <div className={`skeleton w-50 ${Styles.skeletonHeading}`}></div>
                            <div className="skeleton mx-auto w-25 skeletonText"></div>
                        </>
                    )}
                </div>
                <div className={Styles.bannerPoster}>
                    {!hasLoading ? (
                        <figure>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
                                alt={title || "Banner Poster"}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`
                                }}
                                fill
                                priority
                                style={{ objectFit: "cover" }}
                            />
                        </figure>
                    ) : (
                        <figure className="skeleton"></figure>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default DetailsBanner
