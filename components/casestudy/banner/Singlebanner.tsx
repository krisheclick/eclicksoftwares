import { Col, Container, Row } from "react-bootstrap";
import Styles from "../casestudy.module.css";
type Client = {
    client_name?: string;
    industry?: {
        industry_title?: string;
    }
}
type Data = {
    proj_name?: string;
    proj_title?: string;
    proj_short_desc?: string;
    proj_tools_used?: string | { name?: string; value?: string }[];
    client?: Client | undefined;
}
type Props = {
    data?: Data;
}
const Singlebanner = ({data}: Props) => {    
    const proj_tools_used = data?.proj_tools_used;
    let tools: {name?: string; value?: string;}[] = [];
    if(typeof proj_tools_used === "string"){
        try{
            tools = JSON.parse(proj_tools_used);
        }catch(err){
            console.log('Error parsing proj_tools_used:', err)
        }
    }else if(Array.isArray(proj_tools_used)){
        tools = proj_tools_used;
    }

  return (
    <section className={Styles.singleBannerSection}>
        <Container>
            <Row>
                <Col lg={5}>
                    <div className={Styles.leftContent}>
                        <h1>
                            <span>{data?.proj_name}</span>
                            <div>{data?.proj_title}</div>
                        </h1>
                    </div>
                </Col>
                <Col lg={4}>
                    <div className={Styles.middleContent}>
                        <div className={Styles.tagLine}>Project Overview</div>
                        <p
                            dangerouslySetInnerHTML={{__html: data?.proj_short_desc || ''}}
                        />
                    </div>
                </Col>
                <Col lg={3}>
                    <div className={Styles.tagLine}>Project Information</div>
                    <div className={Styles.projectName}>
                        <span>Client</span>
                        {data?.client?.client_name}
                    </div>
                    <div className={Styles.projectName}>
                        <span>Industry</span>
                        {data?.client?.industry?.industry_title}
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default Singlebanner