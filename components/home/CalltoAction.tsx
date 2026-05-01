import { Container } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import { useScheduleCall } from "@/utils/useLetsConnect";
type CallToAction = {
    tpdc_title?: string;
}
type classType = {
    spaceClass: string;
    content: CallToAction;
    isLoading: boolean;
}
const CalltoAction = ({ spaceClass, content, isLoading }: classType) => {
    const { openScheduleModal} = useScheduleCall();
    return (
        <div className={`${spaceClass ?? ''} ${Styles.calltoAction ?? ''}`}>
            <Container>
                <div className={`${Styles.calltoAction_wrapper} calltoAction_wrapper`}>
                    {!isLoading ? (
                        <>
                            <div className={Styles.calltoAction_content}>
                                <div className={`title ${Styles.title}`} dangerouslySetInnerHTML={{
                                    __html: content?.tpdc_title ?? ''
                                        .replace(/Â+/g, "")
                                        .replace(/\s+/g, " ")
                                        .trim(),
                                }} />
                            </div>
                            <button type="button" onClick={() => openScheduleModal('general_schedule_a_call')} className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}>
                                <span>
                                    <Image
                                        className="auto-img"
                                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                        alt="Schedule a Call"
                                        width={21} height={21}
                                        priority={true}
                                    />
                                </span>
                                <em>Schedule a Call</em>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-75">
                                <div className={`title skeleton mb-2 ${Styles.title}`}>&nbsp;</div>
                                <div className={`title skeleton w-75 ${Styles.title}`}>&nbsp;</div>
                            </div>
                            <span className={`skeleton eclick-btn-connect ${Styles.scheduleBtn ?? ''}`}>&nbsp;</span>
                        </>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default CalltoAction
