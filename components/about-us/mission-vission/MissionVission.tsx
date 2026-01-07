import { Col, Container, Row } from 'react-bootstrap';
import Styles from './style.module.css'
import Image from 'next/image';

interface VisionMission {
    "96lg_vision_title"?: string;
    "96lg_vision_heading"?: string;
    "96lg_vision_description"?: string;
    "96lg_vision_image"?: string;
    "96lg_mission_title"?: string;
    "96lg_mission_heading"?: string;
    "96lg_mission_description"?: string;
    "96lg_mission_image"?: string;
}

interface Props {
    data: {
        "vision-mission"?: VisionMission;
    };
}


const MissionVission = ({ data }: Props) => {
    const content = data?.["vision-mission"];

    if (!content) return null;

    return (
        <section className={Styles.mission_vission}>
            <Container>
                <Row className="align-items-center">
                    {/* Vision */}
                    <Col lg={6}>
                        {content["96lg_vision_image"] && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content["96lg_vision_image"]}`}
                                alt={content["96lg_vision_title"] ?? "Our Vision"}
                                width={600}
                                height={400}
                            />
                        )}
                    </Col>

                    <Col lg={6}>
                        <h4>{content["96lg_vision_title"]}</h4>
                        <h2>{content["96lg_vision_heading"]}</h2>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: content["96lg_vision_description"] ?? "",
                            }}
                        />
                    </Col>

                    {/* Mission */}
                    <Col lg={6}>
                        <h4>{content["96lg_mission_title"]}</h4>
                        <h2>{content["96lg_mission_heading"]}</h2>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: content["96lg_mission_description"] ?? "",
                            }}
                        />
                    </Col>

                    <Col lg={6}>
                        {content["96lg_mission_image"] && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${content["96lg_mission_image"]}`}
                                alt={content["96lg_mission_title"] ?? "Our Mission"}
                                width={600}
                                height={400}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default MissionVission;