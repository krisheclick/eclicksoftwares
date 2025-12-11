import Image from 'next/image'
import Styles from './style.module.css'
type ProcessStep = {
    filename: string;
    name: string;
    title: string;
    description: string;
}

type props = {
    isLoading: boolean;
    process_steps : ProcessStep[];
}
const List = ({isLoading, process_steps}:props) => {
    return (
        <div className={Styles.listView}>
            <ul>
                {!isLoading ? (
                    process_steps && process_steps.length > 0 && process_steps.map((item:ProcessStep, index:number) => (
                        <li className={Styles.listbox} key={index}>
                            <figure className={Styles.radiusIcon}>
                                <Image
                                    className='auto-img'
                                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.filename}`}
                                    alt={item.title || 'Project Analysis'}
                                    fill
                                    priority={true}
                                />
                            </figure>
                            <div className={Styles.listcontent}>
                                <div className={`subtitle fw-medium ${Styles.subtitle}`}>{item.title}</div>
                                <span dangerouslySetInnerHTML={{
                                    __html: item.description??''
                                    .replace(/Â+/g, "")
                                    .replace(/\s+/g, " ")
                                    .trim(),
                                }}/>
                            </div>
                        </li>
                    ))
                ) : (
                    [...Array(5)].map((_, index )=> (
                        <li className={Styles.listbox} key={index}>
                            <figure className={`skeleton ${Styles.radiusIcon}`}></figure>
                            <div className={`w-100 ${Styles.skeletonText}`}>
                                <div className="skeleton w-70" style={{ height: 28, marginBottom: 12 }}></div>
                                <div className="skeleton skeletonText mb-2"></div>
                                <div className="skeleton skeletonText w-65"></div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default List
