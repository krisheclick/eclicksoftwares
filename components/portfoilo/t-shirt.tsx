import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";

type Portfolios = {
    portfolio_feature_image_path?: string;
    portfolio_title?: string;
    portfolio_description?: string;
}
type Props = {
    hasLoading: boolean;
    title: string;
    portfolios?: Portfolios[];
}
const Tshirt = ({ hasLoading, title, portfolios = [] }: Props) => {
    if (!hasLoading && portfolios.length === 0) {
        return <p className="notFound text-center">{title} Portfolio items found.</p>;
    }
    return (
        <Row className="rowGap">
            {!hasLoading ? (
                portfolios.map((item, index) => (
                    <Col lg={4} sm={6} key={index}>
                        <div className={Styles.shirtBox} >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.portfolio_feature_image_path ?? ''}`}
                                alt={item.portfolio_title || "Logo Design Title"}
                                fill
                                priority
                            />
                        </div>
                    </Col>
                ))
            ) : (
                [...Array(6)].map((_, index) => (
                    <Col lg={4} sm={6} key={index}>
                        <div className={`skeleton ${Styles.shirtBox}`}></div>
                    </Col>
                ))
            )}
        </Row>
    )
}

export default Tshirt
