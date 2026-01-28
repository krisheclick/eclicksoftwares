"use client";
import Styles from './style.module.css';
import { useHireModal } from '@/utils/useLetsConnect';
import CustomImage from '@/utils/CustomImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
    icon?: string;
    title?: string;
    description?: string;
    button?: boolean;
}
const HireCard = ({icon, title, description, button = true}: Props) => {
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
            {button && (
                <span 
                    onClick={()=>{openHireModal(); setSelectedUsp(title??'')}}
                    className={`eclick-btn-action sm ${Styles.btnhwdsbx_btn}`}
                >
                    <span><FontAwesomeIcon icon={faArrowRight} /></span>
                    <em>Hire Now</em>
                </span>
            )}
        </div>
    )
}

export default HireCard
