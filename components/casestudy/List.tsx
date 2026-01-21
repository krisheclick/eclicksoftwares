"use client";

import { Col, Container, Row } from "react-bootstrap";
import Styles from "./style.module.css";
import { useCallback, useEffect, useState } from "react";
import Card from "./card/Card";
import Cardskeleton from "./card/Cardskeleton";

type GroupItem = {
    project_group_title: string;
    project_group_slug: string;
    project_group_layout: number;
};

type CaseStudyItem = {
    proj_feature_image_path?: string;
    proj_title?: string;
    proj_name?: string;
    proj_slug?: string;
    proj_short_desc?: string;
};

interface CaseStudyData {
    projectGroup?: {
        Projects?: CaseStudyItem[];
    }
}

const CasestudyList = () => {
    const [hasLoading, setLoading] = useState(true);
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const [activeGroup, setActiveGroup] = useState<string>("");
    const [data, setData] = useState<CaseStudyData | null>(null);

    const apiResponse = `${process.env.NEXT_PUBLIC_API_URL}projects/group`;

    const fetchGroups = useCallback(async () => {
        try {
            const response = await fetch(apiResponse);
            const { response_data } = await response.json();
            const groupList = response_data?.AllGroupByCaseStudy || [];
            setGroups(groupList);

            // set first group as default
            if (groupList.length > 0) {
                setActiveGroup(groupList[0].project_group_slug);
            }
        } catch (err: unknown) {
            console.error("Group list API error:", (err as Error).message);
        }
    }, [apiResponse]);

    const fetchGroupProjects = useCallback(async (groupSlug: string) => {
        if (!groupSlug) return;

        setLoading(true);
        try {
            const response = await fetch(`${apiResponse}/${groupSlug}`);
            const { response_data } = await response.json();
            setData(response_data || []);
        } catch (err: unknown) {
            console.error("Group project API error:", (err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [apiResponse]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    useEffect(() => {
        fetchGroupProjects(activeGroup);
    }, [activeGroup, fetchGroupProjects]);

    const projects = data?.projectGroup?.Projects;

    return (
        <div className={`sectionArea ${Styles.casestudies_section}`}>
            <Container>
                <div className={Styles.tabList}>
                    <ul className="noList">
                        {!hasLoading && groups ? (
                            groups.map((value) => (
                                <li
                                    key={value.project_group_slug}
                                    className={`${Styles.tabItem} ${activeGroup === value.project_group_slug ? Styles.active : ""
                                        }`}
                                    onClick={() => setActiveGroup(value.project_group_slug)}
                                >
                                    {value.project_group_title}
                                </li>
                            ))) : (
                            [...Array(2)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`skeleton ${Styles.tabItem}`}
                                />
                            ))
                        )}
                    </ul>
                </div>

                {/* Cards */}
                <div className={Styles.caseList}>
                    <Row className="rowGap">
                        {!hasLoading ? (
                            projects?.map((item, index) => (
                                <Col lg={6} key={index}>
                                    <Card
                                        poster={item.proj_feature_image_path}
                                        slug={item.proj_slug}
                                        title={item.proj_title}
                                        projectName={item.proj_title}
                                        proj_short_desc={item.proj_short_desc}
                                    />
                                </Col>
                            ))
                        ) : (
                            [...Array(6)].map((_, index) => (
                                <Cardskeleton key={index} />
                            ))
                        )}
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default CasestudyList;
