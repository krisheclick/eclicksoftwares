import Image from "next/image";

interface CustomImageProps {
    src?: string;
    alt?: string;
    priority?: boolean;
    fill?: boolean;
}

const CustomImage = ({
    src,
    alt = "Image",
    priority = false,
    fill = true,
}: CustomImageProps) => {
    const imageSrc = src
        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${src}`
        : `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
    return (
        <figure className="position-relative overflow-hidden">
            <Image
                src={imageSrc}
                alt={alt}
                fill={fill}
                priority={priority}
                onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                }}
            />
        </figure>
    )
}

export default CustomImage
