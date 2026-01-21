import Styles from "./style.module.css";
import CustomImage from "@/utils/CustomImage";

type Props = {
    title?: string;
    poster?: string;
    params?: {slug?: string;}
}
const Banner = ({title, poster}: Props) => {
  return (
    <div className={Styles.bannerSection}>
        <CustomImage
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${poster}`}
            alt={title}
            className={Styles.bannerPoster}
        />
    </div>
  )
}

export default Banner