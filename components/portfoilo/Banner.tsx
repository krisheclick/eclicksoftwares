import { Container } from "react-bootstrap";
import Styles from "./style.module.css";

type DataItem = {
    title?: string;
}
type Props = {
    data?: DataItem;
}
const Banner = ({data}: Props) => {
  return (
    <div className={Styles.bannerSection}>
        <Container>
            <article className={Styles.bannerContent}>
                <h1 className={Styles.pageTitle}>{data?.title}</h1>
            </article>
        </Container>
    </div>
  )
}

export default Banner