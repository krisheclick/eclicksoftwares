import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
import Image from "next/image";
type Technologies = {
    technology_feature_image_path?: string;
    technology_title?: string;
}
type Services = {
    service_title?: string;
}
type Data = {
    technologies?: Technologies[] | undefined;
    services: Services[] | undefined;
}
type Props = {
    data?: Data;
}

const Serviceslist = ({ data }: Props) => {
    const services = data?.services || [];
    const technologies = data?.technologies || [];
    return (
        <section className={Styles.ListSection}>
            <Container>
                <Row>
                    <Col lg={7}>
                        {services.length > 0 && (
                            <div className={Styles.leftContentList}>
                                <div className={Styles.tagLine}>Providing Services</div>
                                <ul>
                                    {data?.services?.map((value, index) => {
                                        return (
                                            <li key={index}>{value.service_title}</li>
                                        )

                                    })}
                                </ul>
                            </div>
                        )}
                    </Col>
                    <Col lg={5}>
                        {technologies?.length > 0 && (
                            <div className={Styles.technologies}>
                                <div className={Styles.tagLine}>Use Technologies</div>
                                <ul className="noList">
                                    {data?.technologies?.map((value, index) => {
                                        const { technology_feature_image_path, technology_title } = value;
                                        return (
                                            <li key={index}>
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${technology_feature_image_path}`}
                                                    alt={technology_title || ''}
                                                    width={32}
                                                    height={32}
                                                />
                                                <span>{technology_title}</span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Serviceslist