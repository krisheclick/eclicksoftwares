"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { slugify } from "@/utils/slugify";
import { Col, Row } from "react-bootstrap";
import Styles from "./style.module.css";

type ProjectItem = {
  proj_feature_image_path?: string;
  proj_name?: string;
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
                      proj_short_desc,
                      proj_tools_used,
                    } = item;

                    let tools: { name?: string; value?: string }[] = [];
                    if (typeof proj_tools_used === "string") {
                      try {
                        tools = JSON.parse(proj_tools_used);
                      } catch (err) {
                        console.error("Error parsing proj_tools_used:", err);
                      }
                    } else if (Array.isArray(proj_tools_used)) {
                      tools = proj_tools_used;
                    }

                    return (
                      <Col lg={6} key={index}>
                        <div className={Styles.rowList}>
                          <div className={Styles.card}>
                            <figure className={Styles.cardPoster}>
                              <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${proj_feature_image_path}`}
                                alt={proj_name || "Project Image"}
                                fill
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    `${process.env.NEXT_PUBLIC_assetPrefix}/assets/images/noimage.jpg`;
                                }}
                                priority
                                style={{ objectFit: "cover" }}
                              />
                            </figure>
                            <aside>
                              <div className={Styles.boxTitle}>{proj_name}</div>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: proj_short_desc || "",
                                }}
                              />

                              {tools.length > 0 && (
                                <ul>
                                  {tools.slice(0, 2).map((tool, idx) => (
                                    <li key={idx}>
                                      <span>{tool.name}</span> <em>{tool.value}</em>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <div className={Styles.listTarget}>
                                <Link
                                  href={`/services/${category.service_category_slug}/${slugify(
                                    proj_name
                                  )}`}
                                >
                                  <FontAwesomeIcon icon={faLink} /> {proj_name}
                                </Link>
                              </div>
                            </aside>
                          </div>
                        </div>
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
