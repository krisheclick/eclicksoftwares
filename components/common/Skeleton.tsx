const Skeleton = () => {
    return (
        <div className="w-100">
            <div className="skeleton heading w-75 rounded-1 mb-0">&nbsp;</div>
            <div className="skeleton skeletonDot">
                <span></span>
                <span></span>
            </div>
        </div>
    )
}

export default Skeleton
