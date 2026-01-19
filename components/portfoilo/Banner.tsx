import { Container } from "react-bootstrap";
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
        <div className={Styles.bannerText}>
            <Container>
                <article className={Styles.bannerContent}>
                    <h1 className={Styles.pageTitle}>{title}</h1>
                </article>
            </Container>
        </div>
    </div>
  )
}

export default Banner