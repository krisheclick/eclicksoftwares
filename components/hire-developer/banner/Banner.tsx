import Image from 'next/image';
import { Container } from 'react-bootstrap';
import Styles from "./style.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface BannerData {
    wkx5_heading?: string;
    wkx5_sub_heading?: string;
    wkx5_description?: string;
    wkx5_button_name?: string;
    wkx5_button_link?: string;
    wkx5_image?: string;
}
interface RecommendTeam {
    team_feature_image_path?: string;
    team_title?: string;
    team_rating?: string;
    team_designation?: string;
}
interface Props {
    data?: BannerData;
    recommend_team?: RecommendTeam[];
    top_pick_team?: RecommendTeam;
    onHireClick?: () => void;
}

const Banner = ({ data, recommend_team, top_pick_team, onHireClick }: Props) => {
    const mediaUrl = `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images`;
    return (
        <div className={Styles.hero} style={{ background: `url(${mediaUrl + '/banner/hire-banner.webp'}) no-repeat center` }}>
            <Container>
                <div className={Styles.heroWrapper}>
                    <div className={Styles.banner_content}>
                        <h1 className={Styles.banner_heading}> {data?.wkx5_heading} <span>{data?.wkx5_sub_heading}</span></h1>
                        <div
                            className={Styles.bannersubTitle}
                            dangerouslySetInnerHTML={{ __html: data?.wkx5_description ?? '' }}
                        />
                        {data?.wkx5_button_name && (
                            <button
                                onClick={() => onHireClick?.()}
                                className={`eclick-btn-hireBtn lg ${Styles.hireBtn ?? ''}`}
                                type="button"
                            >
                                <em>{data.wkx5_button_name}</em>
                                <span className={Styles.icon}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </button>
                        )}

                        {recommend_team && (
                            <div className={Styles.recommend}>
                                <div className={Styles.banner_rech}>Recommend</div>
                                <div className={Styles.recommendCards}>
                                    {recommend_team.map((value, index) => (
                                        <div className={Styles.card} key={index}>
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value.team_feature_image_path}`}
                                                alt={value.team_title || "Team Title"}
                                                width={50}
                                                height={50}
                                                priority={true}
                                            />
                                            <div>
                                                <strong>{value.team_title}</strong>
                                                <span>{value.team_designation}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>
                    {top_pick_team && (
                        <>
                            {/* Floating Card */}
                            <div className={Styles.right}>
                                <div className={Styles.floatingCard}>
                                    <figure>
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${top_pick_team.team_feature_image_path}`}
                                            alt={top_pick_team.team_title || "Team Title"}
                                            fill
                                            priority={true}
                                            style={{objectFit: "contain"}}
                                        />
                                    </figure>
                                    <div>
                                        <strong className={Styles.memberName}>{top_pick_team.team_title}</strong>
                                        {top_pick_team.team_designation && (
                                            <span className={Styles.designation}>{top_pick_team.team_designation}</span>
                                        )}
                                        <div className={Styles.stars}>★★★★★</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Banner
