import Image from 'next/image';
import Styles from './style.module.css';

export interface RatingItem {
    jrne_ratting1: string;
    jrne_icon_1: string;
    jrne_title1: string;
    jrne_ratting2: string;
    jrne_icon_2: string;
    jrne_title2: string;
    jrne_ratting3: string;
    jrne_icon_3: string;
    jrne_title3: string;
}
interface Props {
    hasLoading: boolean;
    data: {
        ratting?: RatingItem;
    };
}
const Review_rating = ({ hasLoading, data }: Props) => {
    const mediaUrl = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images`;
    const rating = data?.ratting;
    return (
        <div className={Styles.supportRow}>
            {!hasLoading ? (
                <>
                    <div className={Styles.supportBox}>
                        <div>
                            <div className={Styles.review}>
                                {rating?.jrne_ratting1}
                                <Image
                                    className="flex-shrink-0"
                                    src={`${mediaUrl}/star-icon.png`}
                                    alt={rating?.jrne_title1 || "clutch"}
                                    width={22} height={22}
                                    priority
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                            <div className={`d-flex align-items-start gap-2${Styles.supportBoxText ?? ''}`}>
                                <Image
                                    className="flex-shrink-0"
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${rating?.jrne_icon_1}`}
                                    alt={rating?.jrne_title1 || "clutch"}
                                    width={26} height={26}
                                    priority
                                />
                                <span>{rating?.jrne_title1}</span>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.supportBox}>
                        <div>
                            <div className={Styles.review}>
                                {rating?.jrne_ratting2}
                                <Image
                                    className="flex-shrink-0"
                                    src={`${mediaUrl}/star-icon.png`}
                                    alt={rating?.jrne_title1 || "clutch"}
                                    width={22} height={22}
                                    priority
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                            <div className={`d-flex align-items-start gap-2 ${Styles.supportBoxText ?? ''}`}>
                                <Image
                                    className="flex-shrink-0"
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${rating?.jrne_icon_2}`}
                                    alt={rating?.jrne_title2 || "Google"}
                                    width={26} height={26}
                                    priority
                                />
                                <span>{rating?.jrne_title2}</span>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.supportBox}>
                        <div>
                            <div className={Styles.review}>
                                {rating?.jrne_ratting3}
                                <em>+</em>
                            </div>
                            <div className={`d-flex align-items-start gap-2${Styles.supportBoxText ?? ''}`}>
                                <span>{rating?.jrne_title3}</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                [...Array(3)].map((_, i) => (
                    <div className={Styles.supportBox} key={i}>
                        <div>
                            <div className={Styles.review}>
                                <div className={`skeleton ${Styles.skeletonCount}`}></div>
                                <div className={`skeleton ${Styles.skeletonPrefix}`}></div>
                            </div>
                            <div className={`d-flex align-items-center gap-2 mt-2${Styles.supportBoxText ?? ''}`}>
                                <div className={`skeleton rounded-circle ${Styles.skeletonPrefix}`}></div>
                                <div className={`skeleton skeletonText`}></div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Review_rating
