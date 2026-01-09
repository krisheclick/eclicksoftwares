"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";
import { Col, Row } from "react-bootstrap";
import Card from "@/components/casestudy/card/Card";
import Styles from "./style.module.css";

type ProjectItem = {
    proj_feature_image_path?: string;
    proj_name?: string;
    proj_slug?: string;
    proj_short_desc?: string;
    proj_tools_used?: string | { name?: string; value?: string }[];
};

type ServiceCategory = {
    service_category_title?: string;
    service_category_slug?: string;
    projects?: ProjectItem[];
};

type Props = {
    data?: ServiceCategory[] | null;
};

const TabContainer = ({ data }: Props) => {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        if (data && data.length > 0 && !activeTab) {
            setActiveTab(data[0].service_category_slug || null);
        }
    }, [data, activeTab]);

    return (
        <div className={Styles.tab_container}>
            <div className={Styles.tabs}>
                <ul role="tablist" className="noList">
                    {data?.slice(0, 6)?.map((category, index) => (
                        <li
                            key={index}
                            onClick={() => setActiveTab(category.service_category_slug || null)}
                            className={`${Styles.tabItem} ${activeTab === category.service_category_slug ? Styles.active : ""
                                }`}
                            role="tab"
                            aria-hidden="true"
                            aria-selected={activeTab === category.service_category_slug}
                            aria-controls={`panel-${category.service_category_slug}`}
                        >
                            {category.service_category_title}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={Styles.tabs_content} >
                {data?.slice(0, 6)?.map((category) => {
                    if (category.service_category_slug !== activeTab) return null;

                    return (
                        <div key={category.service_category_slug} className={Styles.smallList}>
                            {category.projects && category.projects.length > 0 ? (
                                <Row className="rowGap">
                                    {category.projects?.map((item, index) => {
                                        const {
                                            proj_feature_image_path,
                                            proj_name,
                                            proj_slug,
                                            proj_short_desc,
                                        } = item;
                                        return (
                                            <Col lg={6} key={index}>
                                                <Card
                                                    poster={proj_feature_image_path}
                                                    slug={proj_slug}
                                                    title={proj_name}
                                                    projectName={proj_name}
                                                    proj_short_desc={proj_short_desc}
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                            ) : (
                                <p className="notFound text-center">Case Study Not Found</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TabContainer;
