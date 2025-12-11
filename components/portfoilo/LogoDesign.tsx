import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import FancyboxWrapper from "@/utils/FancyboxWrapper";
import Link from "next/link";
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
const LogoDesign = ({ hasLoading, title, portfolios = [] }: Props) => {
    if (!hasLoading && portfolios.length === 0) {
        return <p className="notFound text-center">{title} Portfolio items found.</p>;
    }
    return (
        <FancyboxWrapper>
            <Row className="rowGap">
                {!hasLoading ? (
                    portfolios.map((item, index) => (
                        <Col xl={3} md={4} sm={6} key={index}>
                            <Link href={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.portfolio_feature_image_path ?? ''}`} className={Styles.logoBox} data-fancybox="gallery">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.portfolio_feature_image_path ?? ''}`}
                                    alt={item.portfolio_title || "Logo Design Title"}
                                    fill
                                    priority
                                />
                            </Link>
                        </Col>
                    ))
                ) : (
                    [...Array(8)].map((_, index) => (
                        <Col xl={3} md={4} sm={6} key={index}>
                            <div className={`skeleton ${Styles.logoBox}`}></div>
                        </Col>
                    ))
                )}
            </Row>
        </FancyboxWrapper>
    );
};

export default LogoDesign
