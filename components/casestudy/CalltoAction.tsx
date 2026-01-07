import { Container } from "react-bootstrap";
import Image from "next/image";
import Styles from "./style.module.css";
import Link from "next/link";
const CalltoAction = () => {
    return (
        <div className={Styles.calltoAction}>
            <Container>
                <div className={`${Styles.calltoAction_wrapper}`}>
                    <div className={Styles.calltoAction_content}>
                        <div className={`title ${Styles.calltoActionTitle}`}>
                            Start Your Project Today <br />
                            <b>Development Assistance!</b>
                        </div>
                    </div>
                    <Link href="#" className={`eclick-btn-schedule ${Styles.scheduleBtn ?? ''}`}>
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
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default CalltoAction
