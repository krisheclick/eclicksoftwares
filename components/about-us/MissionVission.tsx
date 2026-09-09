import { Container } from 'react-bootstrap';
import Styles from './style.module.css';

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


const MissionVission = ({data }: Props) => {
    const content = data?.["vision-mission"];

    if (!content) return null;

    return (
        <div className={Styles.mission_vission}>
            <Container>
                <div className={`row rowGap ${Styles.missionVisionRow}`}>
                    {/* Vision */}
                    <div className="col-lg-6 col-md-6">
                        <div className={Styles.contentCard}>
                            <span className={Styles.cardNumber}>01</span>
                            <div className={Styles.topLine}></div>
                            <span className={Styles.mission_subtitle}>{content["96lg_vision_title"]}</span>
                            <h2 className={`heading ${Styles.mission_title}`}>{content["96lg_vision_heading"]}</h2>
                            <div
                                className={Styles.description}
                                dangerouslySetInnerHTML={{__html: content["96lg_vision_description"] || ''}}
                            />
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="col-lg-6 col-md-6">
                        <div className={Styles.contentCard}>
                            <span className={Styles.cardNumber}>02</span>
                            <div className={Styles.topLine}></div>
                            <span className={Styles.mission_subtitle}>{content["96lg_mission_title"]}</span>
                            <h2 className={`heading ${Styles.mission_title}`}>{content["96lg_mission_heading"]}</h2>
                            <div
                                className={Styles.description}
                                dangerouslySetInnerHTML={{__html: content["96lg_mission_description"] || ''}}
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MissionVission;