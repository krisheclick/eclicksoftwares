import Image from 'next/image';
import { Container } from 'react-bootstrap'
import Link from 'next/link';
import Styles from './style.module.css';
import { useLetsConnect } from '@/utils/useLetsConnect';


type Technology = {
  technology_feature_image_path: string;
  technology_title: string;
  technology_feature_image: string;
}

type props = {
  isLoading: boolean;
  title: string;
  technologies: Technology[];
}

const Technologies = ({ isLoading, title, technologies }: props) => {
  const { openLetsConnectModal} = useLetsConnect();
  return (
    <div className={Styles.sectionArea}>
      <Container>
        <div className={`section-content full text-center ${Styles.section_content ?? ''}`}>
          {!isLoading ? (
            <h3 className={`title ${Styles.title ?? ''}`}>{title ? title : 'Technologies We Use in Custom  Software Development (Static).'}</h3>
          ) : (
            <div className="skeleton skeletonTitle"></div>
          )}
        </div>
        <div className={Styles.brands}>
          <ul className='noList'>
            {!isLoading ? (
              technologies.slice(0, 10)?.map((value, index) => {
                return (
                  <li key={index}>
                    <figure className={Styles.brandLogo}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${value?.technology_feature_image_path}`}
                        alt={value?.technology_title}
                        fill
                        className={Styles.icon}
                      />
                    </figure>
                    <span>{value?.technology_title}</span>
                  </li>
                )
              })
            ) : (
              [...Array(10)].map((_, index) => (
                <li key={index}>
                  <figure className={`skeleton ${Styles.brandLogo}`}></figure>
                  <div className="skeleton skeletonText w-75 mx-auto"></div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="btn_center">
          {!isLoading ? (
            <Link href={`javascript:void(0);`}  onClick={()=>openLetsConnectModal('general_lets_connect')} className={`eclick-btn-connect lg ${Styles.bannerBtn ?? ''}`}>
              <span className={Styles.phoneIcon}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/chat.png`}
                  alt="Conversation"
                  width={23} height={22}
                  loading="lazy"
                />
              </span>
              <em>Let’s Connect</em>
            </Link>
          ) : (
            <div className="skeleton p-1 mt-4 mx-auto" style={{ width: 220 }}>
              <span className="skeleton" style={{ width: 40, height: 40 }}></span>
              <em className="skeleton"></em>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default Technologies
