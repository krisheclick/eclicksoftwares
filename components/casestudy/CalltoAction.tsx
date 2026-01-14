"use client"
import { Container } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import { useScheduleCall } from "@/utils/useLetsConnect";

const CalltoAction = ({data}: {data?: string}) => {
    const { openScheduleModal} = useScheduleCall();
    return (
        <div className={Styles.calltoAction}>
            <Container>
                <div className={`${Styles.calltoAction_wrapper}`}>
                    <div className={Styles.calltoAction_content}>
                        <div className={`title ${Styles.calltoActionTitle}`}
                            dangerouslySetInnerHTML={{__html: data ?? 'Start Your Project Today'}}
                        />
                    </div>
                    <button onClick={() => openScheduleModal('general_schedule_a_call')} className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}>
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
                </div>
            </Container>
        </div>
    )
}

export default CalltoAction
