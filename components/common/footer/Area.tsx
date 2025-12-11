'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "./area.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { usePathname } from "next/navigation";

type data = {
    location_feature_image_path?: string;
    location_title?: string;
    location_address?: string;
    location_phone?: string;
    location_email?: string;
    location_iframe_url?: string;
    country?: {
        name?: string;
    }
}
const Area = () => {
    const [hasLoading, setLoading] = useState(true);
    const [data, setData] = useState<data[] | null>([]);
    const [activeTab, setActive] = useState<string | null>(null);

    const fetchLocation = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location`);
            const { response_data } = await response.json();
            setData(response_data);
        } catch (err: unknown) {
            console.log('Location API is Something wrong!', (err as Error).message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocation();
    }, []);

    const activeData = data?.find((item) => item.location_title === activeTab);

    useEffect(() => {
        if ((data?.length ?? 0) > 0 && !activeData) {
            setActive(data![0].location_title ?? null);
        }
    }, [data, activeData]);

    const pathName = usePathname();
    const innerLocation = (pathName === '/') ? '' : Styles.innerLocation;

    return (
        <div className={`${Styles.locationArea} ${innerLocation}`}>
            <Container>
                <Row className="row align-items-center">
                    <Col lg={pathName === '/' ? 6 : 12}>
                        {!hasLoading ? (
                            <div className={Styles.infoBox}>
                                {(pathName === '/') ? (
                                    <div className={`${Styles.locationTitle ?? ''} titleTag`}>Locations</div>
                                ) : null}
                                <div className={Styles.locationRow}>
                                    {data?.map((value, index) => {
                                        const { location_feature_image_path, location_title, location_address, location_phone, location_email } = value;
                                        return (
                                            <div className={Styles.locationCol} key={index}>
                                                <div
                                                    className={`${Styles.locationBox} ${activeTab === location_title ? Styles.active : ""}`}
                                                    onClick={() => setActive(location_title ?? null)}
                                                >
                                                    <div className={Styles.content}>
                                                        <div className={Styles.locationBoxTitle}>
                                                            <Image
                                                                src={location_feature_image_path ?
                                                                    `${process.env.NEXT_PUBLIC_MEDIA_URL}${location_feature_image_path}` : '/india.png'
                                                                }
                                                                alt={location_title || "India Flag"}
                                                                width={40}
                                                                height={26}
                                                                priority={true}
                                                            />
                                                            <div className={Styles.title}>{location_title}</div>
                                                        </div>
                                                        <ul>
                                                            {location_address && (
                                                                <li className={Styles.address}>
                                                                    <address>{location_address}</address>
                                                                </li>
                                                            )}
                                                            {location_phone && (
                                                                <li className={Styles.phone}>
                                                                    <Link href={`tel:${location_phone}`}>{location_phone}</Link>
                                                                </li>
                                                            )}
                                                            {location_email && (
                                                                <li className={Styles.email}>
                                                                    <Link href={`mailto:${location_email}`} className="events-none">{location_email}</Link>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className={Styles.infoBox}>
                                {(pathName === '/') ? (
                                    <>
                                        <div className={`skeleton ${Styles.skeletonTitle}`}></div>
                                        <div className={`skeleton skeletonDot ${Styles.skeletonDot}`}>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </>
                                ) : null}
                                <div className={Styles.locationRow}>
                                    {[...Array(4)].map((_, index) => (
                                        <div className={Styles.locationCol} key={index}>
                                            <div className={Styles.locationBox}>
                                                <div className={Styles.locationBoxTitle}>
                                                    <div className={`skeleton ${Styles.skeletonIcon}`}></div>
                                                    <div className={`skeleton skeletonTitle ${Styles.skeletonSubtitle}`}></div>
                                                </div>
                                                <div className="w-100">
                                                    <div className="skeleton skeletonText"></div>
                                                    <div className="skeleton skeletonText"></div>
                                                    <div className="skeleton skeletonText"></div>
                                                    <div className="skeleton skeletonText"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Col>
                    {pathName === '/' && (
                        <Col lg={6}>
                            {!hasLoading ? (
                                <div className={Styles.iframeBox}>
                                    {activeData?.location_iframe_url ? (
                                        <iframe
                                            src={activeData.location_iframe_url}
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title={`${activeData?.country?.name} Map Location`}
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    ) : (
                                        <div className={Styles.location_iframe_url}>
                                            <p>No map available for this location.</p>
                                        </div>
                                    )}

                                    <div className={Styles.frameAddress}>
                                        <div className={Styles.country}>
                                            <Image
                                                src={
                                                    activeData?.location_feature_image_path
                                                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${activeData.location_feature_image_path}`
                                                        : "/india.png"
                                                }
                                                alt={`${activeData?.country?.name} Flag` || "Flag"}
                                                width={54}
                                                height={54}
                                            />
                                            <span>{activeData?.country?.name}</span>
                                        </div>

                                        <ul>
                                            <li className={Styles.address}>
                                                <FontAwesomeIcon icon={faLocationDot} />
                                                <address>Godrej Genesis, 12 Floor, Unit - 1207, Sector V, Salt Lake, Kolkata -700091, West Bengal, India.</address>
                                            </li>
                                            <li className={Styles.phone}>
                                                <FontAwesomeIcon icon={faPhone} />
                                                <Link href={'tel:+913340044425'}>+91 33 4004 4425</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className={Styles.iframeBox} style={{ background: 'transparent' }}>
                                    <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: '0', background: '#d7e4fa36' }}></div>
                                    <div className={`skeleton w-100 ${Styles.frameAddress} ${Styles.frameAddressSkeleton}`}>
                                        <div className={Styles.country}>
                                            <div className={`skeleton rounded-circle ${Styles.skeletonIcon}`}></div>
                                            <span className="skeleton skeletonText w-100" style={{ height: '24px' }}></span>
                                        </div>
                                        <ul>
                                            <li className="align-items-start">
                                                <div className={`skeleton ${Styles.skeletonIcon}`}></div>
                                                <div className="w-100">
                                                    <div className="skeleton skeletonText w-100"></div>
                                                    <div className="skeleton skeletonText w-100"></div>
                                                </div>
                                            </li>
                                            <li className="align-items-start">
                                                <div className={`skeleton ${Styles.skeletonIcon}`}></div>
                                                <div className="w-100">
                                                    <div className="skeleton skeletonText w-100"></div>
                                                    <div className="skeleton skeletonText w-100"></div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}

export default Area;