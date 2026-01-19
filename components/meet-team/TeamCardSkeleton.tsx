import Styles from './style.module.css';
const TeamCardSkeleton = () => {
    return (
        <div className={Styles.card}>
            <div className={`position-relative overflow-hidden ${Styles.memberImage}`}>
                <div className="skeleton skeletonFill"></div>
            </div>
            <div className={`skeleton ${Styles.skeletonName} ${Styles.name}`}></div>
            <div className={`skeleton skeletonText mx-auto w-75 ${Styles.designation}`}></div>
        </div>
    )
}

export default TeamCardSkeleton
