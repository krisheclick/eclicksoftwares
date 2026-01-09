import { Container } from 'react-bootstrap';
import Styles from './style.module.css';
import Card from '../common/postercard/Card';

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
    hasLoading?: boolean;
}


const MissionVission = ({ hasLoading, data }: Props) => {
    const content = data?.["vision-mission"];

    if (!content) return null;

    return (
        <div className={Styles.mission_vission}>
            <Container>
                <div className={`rowCard ${Styles.row}`}>
                    <Card
                        hasLoading = {hasLoading}
                        poster={content["96lg_vision_image"]}
                        subtitle={content["96lg_vision_title"]}
                        title={content["96lg_vision_heading"]}
                        description={content["96lg_vision_description"]}
                    />
                    <Card
                        hasLoading = {hasLoading}
                        poster={content["96lg_mission_image"]}
                        subtitle={content["96lg_mission_title"]}
                        title={content["96lg_mission_heading"]}
                        description={content["96lg_mission_description"]}
                    />
                </div>
            </Container>
        </div>
    );
};

export default MissionVission;