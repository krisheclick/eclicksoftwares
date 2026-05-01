import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useRef, useState } from "react";
import Styles from './style.module.css';

interface MenuProps {
    title: string;
    children: ReactNode;
}
const FooterAccordion = ({ title, children }: MenuProps) => {
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
        const el = contentRef.current;
        if (!el) return;

        if (open) {
            el.style.height = el.scrollHeight + "px";
            requestAnimationFrame(() => {
                el.style.height = "0px";
            });
        } else {
            el.style.height = el.scrollHeight + "px";
        }

        setOpen(!open);
    };

    return (
        <div className={`${Styles.columnBox} ${open ? Styles.open : ''}`}>
            <div className={Styles.navLinkWrapper}>
                <div className={Styles.title} onClick={toggle}>
                    {title}
                    <span className={Styles.clickBtn}>
                        <FontAwesomeIcon icon={open ? faMinus : faPlus} />
                    </span>
                </div>
                <div className={Styles.navList} ref={contentRef}>
                    <ul className={Styles.navMenu}>
                        {children}
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default FooterAccordion;