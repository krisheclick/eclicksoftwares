import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

type Props = {
    title?: string;
}
const Banner = ({title}: Props) => {
  return (
    <div className={Styles.bannerSection}>
        <Container>
            <article className={Styles.bannerContent}>
                <h1 className={Styles.pageTitle}>{title}</h1>
            </article>
        </Container>
    </div>
  )
}

export default Banner