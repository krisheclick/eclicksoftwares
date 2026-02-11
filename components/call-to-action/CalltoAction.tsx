import { Button, Container } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import Link from "next/link";
import { useScheduleCall } from "@/utils/useLetsConnect";
type CallToAction = {
    "4e3s_title"?: string;
    "4e3s_button_name"?: string;
    "4e3s_button_link"?: string;
};
type classType = {
    spaceClass: string;
    content: {
        "call-to-action"?: CallToAction;
    };
    isLoading: boolean;
}
const CalltoAction = ({ spaceClass, content, isLoading }: classType) => {
    const { openScheduleModal} = useScheduleCall();
    const data = content?.["call-to-action"];
    return (
        <div className={`${spaceClass ?? ''} ${Styles.calltoAction ?? ''}`}>
            <Container>
                <div className={`${Styles.calltoAction_wrapper} calltoAction_wrapper`}>
                    {!isLoading ? (
                        <>
                            <div className={Styles.calltoAction_content}>
                                <div
                                    className={`title ${Styles.title}`}
                                    dangerouslySetInnerHTML={{
                                        __html: data?.["4e3s_title"] ?? "",
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => openScheduleModal('general_schedule_a_call')}
                                className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}
                            >
                                <span>
                                    <Image
                                        className="auto-img"
                                        src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/phone.webp`}
                                        alt="Schedule a Call"
                                        width={21} height={21}
                                        priority={true}
                                    />
                                </span>
                                <em>{data?.["4e3s_button_name"] ?? "Schedule a Call"}</em>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={Styles.skeltonTitle} style={{ width: "50%", margin: 0 }}>
                                <div className={`skeleton mb-2 ${Styles.skeletonTitle}`}></div>
                                <div className={`skeleton w-75 ${Styles.skeletonTitle}`}></div>
                            </div>
                            <div className="skeleton p-1" style={{ width: 220 }}>
                                <span className="skeleton" style={{ width: 40, height: 40 }}></span>
                                <em className="skeleton"></em>
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default CalltoAction
