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
    portfolios?: Portfolios[];
}
const LogoDesign = ({ portfolios = [] }: Props) => {
  return (
    <FancyboxWrapper>
        <Row className="rowGap">
        {portfolios.length === 0 ? (
            <p>No portfolio items found.</p>
        ) : (
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
        )}
        </Row>
    </FancyboxWrapper>
  );
};

export default LogoDesign
