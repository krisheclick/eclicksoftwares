"use client";
import Styles from './style.module.css';
import { useHireModal } from '@/utils/useLetsConnect';
import CustomImage from '@/utils/CustomImage';

interface Props {
    icon?: string;
    title?: string;
    description?: string;
}
const HireCard = ({icon, title, description}: Props) => {
    const { openHireModal, setSelectedUsp } = useHireModal();

    return (
        <div className={Styles.hwdsbox}>
            <CustomImage
                src={icon}
                alt={title}
                className={Styles.technologyIcon}
                fallBack="/assets/images/technology-icon.png"
            />
            <div className={Styles.hwdsboxh}>{title}</div>
            <div className={Styles.hwdsboxp}>
                <div dangerouslySetInnerHTML={{ __html: description || "" }}/>
            </div>
            <div className={Styles.btnhwdsbx}>
                <a 
                    onClick={()=>{openHireModal(); setSelectedUsp(title??'')}}
                    className={Styles.btnhwdsbx_btn}
                >
                    Hire Now
                </a>
            </div>      
        </div>
    )
}

export default HireCard
