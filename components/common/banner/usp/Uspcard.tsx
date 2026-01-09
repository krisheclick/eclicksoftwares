import Image from 'next/image';
import Styles from './style.module.css';

interface Props {
    icon?: string;
    content?: string;
}

const Uspcard = ({ icon, content }: Props) => {
    return (
        <div className={Styles.uspBox}>
            <Image
                className="auto-img"
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${icon}`}
                alt="Clutch"
                width={50} height={50}
                priority={true}
            />
            <p 
                dangerouslySetInnerHTML={{__html: content ?? ''}}
            />
        </div>
    )
}

export default Uspcard
