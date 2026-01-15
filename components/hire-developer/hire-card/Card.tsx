"use client";

import Image from 'next/image';
import Styles from './style.module.css';
import { useHireModal } from '@/utils/useLetsConnect';

interface Props {
    icon?: string;
    title?: string;
    description?: string;
}
const HireCard = ({icon, title, description}: Props) => {
    const { openHireModal, setSelectedUsp } = useHireModal();

    return (
        <div className={Styles.hwdsbox}>
            <figure>
                <Image
                    src={icon || ''}
                    alt={title || "Card Icon"}
                    fill
                    priority

                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/php.png`;
                    }}
                />
            </figure>
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
