"use client";
import Image, { ImageLoader } from "next/image";
import { CSSProperties, useState } from "react";

interface ImageProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    style?: CSSProperties;
    className?: string;
    fallBack?: string;
}

const DEFAULT_FALLBACK = "/assets/images/noimage.jpg";

const imageLoader: ImageLoader = ({ src, width, quality }) => {
    return `${process.env.NEXT_PUBLIC_MEDIA_URL}${src}?w=${width}&q=${quality || 75}`;
};

const CustomImage = ({
    src,
    alt,
    width,
    height,
    style,
    className,
    fallBack
}: ImageProps) => {
    const [hasLoading, setLoading] = useState(true);

    const imageFallback = fallBack || DEFAULT_FALLBACK;
    const imageSrc = src || imageFallback;

    const isFixedSize = typeof width === "number" && typeof height === "number";

    return (
        <figure className={`custom_image ${!isFixedSize ? "fixedImage" : ""} ${className || ""}`}>
            <Image
                loader={imageLoader}
                src={imageSrc}
                alt={alt || "Alt Image"}
                {...(isFixedSize ? { width, height } : { fill: true })}
                priority
                placeholder="blur"
                blurDataURL={`${process.env.NEXT_PUBLIC_assetPrefix}${imageFallback}`}
                onLoad={() => setLoading(false)}
                className={`custom-image ${hasLoading ? "loading" : "loaded"}`}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${process.env.NEXT_PUBLIC_assetPrefix}${imageFallback}`;
                }}
                style={style}
            />
        </figure>
        );
};

export default CustomImage;
