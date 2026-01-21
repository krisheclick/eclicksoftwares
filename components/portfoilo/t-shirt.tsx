import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import { useLetsConnect } from "@/utils/useLetsConnect";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

type Portfolio = {
    portfolio_feature_image_path?: string;
    portfolio_title?: string;
    portfolio_description?: string;
};

type Props = {
    hasLoading: boolean;
    title: string;
    portfolios?: Portfolio[];
};

const Tshirt = ({ hasLoading, title, portfolios = [] }: Props) => {
    const { openLetsConnectModal } = useLetsConnect();

    if (!hasLoading && portfolios.length === 0) {
        return (
            <p className="notFound text-center">
                {title} Portfolio items found.
            </p>
        );
    }

    return (
        <>
            <Row className="rowGap">
                {!hasLoading ? (
                    portfolios.map((item, index) => (
                        <Col lg={4} sm={6} key={index}>
                            <div className={Styles.shirtBox}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.portfolio_feature_image_path ?? ""}`}
                                    alt={item.portfolio_title || "Logo Design"}
                                    fill
                                    priority
                                />
                            </div>
                        </Col>
                    ))
                ) : (
                    [...Array(6)].map((_, index) => (
                        <Col lg={4} sm={6} key={index}>
                            <div className={`skeleton ${Styles.shirtBox}`} />
                        </Col>
                    ))
                )}
            </Row>

            {/* MODAL BUTTON */}
            {!hasLoading && portfolios.length > 0 && (
                <div className={`btn_center ${Styles.btn_center ?? ''}`}>
                    <button type="button" className={`eclick-btn-view lg ${Styles.viewBtn ?? ''}`} onClick={() => openLetsConnectModal("general_lets_connect")}>
                        <span>
                            <FontAwesomeIcon icon={faEye} />
                        </span>
                        <em>View more Design</em>
                    </button>
                </div>
            )}
        </>
    );
};

export default Tshirt;