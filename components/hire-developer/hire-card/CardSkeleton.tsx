"use client";
import Styles from './style.module.css';
const HireCardSkeleton = () => {
    return (

        <div className={Styles.hwdsbox}>
            <div className={`skeleton ${Styles.technologyIcon}`}></div>
            <div className={Styles.hwdsboxh}>
                <div className="skeleton skeletonSubtitle mb-2"></div>
                <div className="skeleton skeletonSubtitle w-75"></div>
            </div>
            <div className={Styles.hwdsboxp}>
                <div className="skeleton skeletonText mb-2"></div>
                <div className="skeleton skeletonText mb-2"></div>
                <div className="skeleton skeletonText"></div>
            </div>
            {/* <div className={Styles.btnhwdsbx}>
                <a 
                    onClick={()=>{openHireModal(); setSelectedUsp(title??'')}}
                    className={Styles.btnhwdsbx_btn}
                >
                    Hire Now
                </a>
            </div>  */}
        </div>
    )
}

export default HireCardSkeleton
