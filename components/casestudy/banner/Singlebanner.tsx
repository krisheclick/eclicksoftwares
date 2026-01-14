"use client";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
type Client = {
    client_name?: string;
    industry?: {
        industry_title?: string;
    }
}
type Technologies = {
    technology_title?: string;
}
type Data = {
    proj_name?: string;
    proj_title?: string;
    proj_main_banner_title?: string;
    proj_main_banner_description?: string;
    proj_short_desc?: string;
    proj_tools_used?: string | { name?: string; value?: string }[];
    client?: Client | undefined;
    Group?: {
        project_group_title?: string;
    }
    technologies?: Technologies[] | undefined;
}
type Props = {
    data?: Data;
}
const Singlebanner = ({ data }: Props) => {
    const proj_tools_used = data?.proj_tools_used;
    let tools: { name?: string; value?: string; }[] = [];
    if (typeof proj_tools_used === "string") {
        try {
            tools = JSON.parse(proj_tools_used);
        } catch (err) {
            console.log('Error parsing proj_tools_used:', err)
        }
    } else if (Array.isArray(proj_tools_used)) {
        tools = proj_tools_used;
    }

    if (!data) return null;
    const title = data?.proj_main_banner_title;
    return (
        <div className={Styles.singleBannerSection}>
            <Container>
                <Row>
                    <Col lg={5}>
                        <div className={Styles.leftContent}>
                            <h1>
                                {data?.Group?.project_group_title && (
                                    <span>{data?.Group?.project_group_title}</span>
                                )}
                                <div>{title ? title : data?.proj_name}</div>
                            </h1>

                            <div className={Styles.anotherPart}>
                                <div className={Styles.projectName}>
                                    <span>Client</span>
                                    {data?.client?.client_name}
                                </div>
                                <div className={Styles.projectName}>
                                    <span>Industry</span>
                                    {data?.client?.industry?.industry_title}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className={Styles.middleContent}>
                            <div className={Styles.tagLine}>Project Overview</div>
                            <p
                                dangerouslySetInnerHTML={{ __html: data?.proj_main_banner_description ?? '' }}
                            />
                        </div>
                    </Col>
                    <Col lg={3}>
                        <div className={Styles.tagLine}>Campaign</div>
                        <div className={Styles.campaignList}>
                            {data?.technologies?.map((tech, index) => (
                                <span key={index} className="me-1">{tech.technology_title}</span>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Singlebanner