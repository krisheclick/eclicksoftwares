"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "@/components/common/banner/Banner";
import JobApplyForm from "@/components/careers/JobApplyForm";
import Styles from "./style.module.css";

const ApplyJob = () => {
    const searchParams = useSearchParams();
    const [jobTitle, setJobTitle] = useState<string>("");
    const [jobId, setJobId] = useState<string>("");

    useEffect(() => {
        const titleParam = searchParams.get('s');
        const linkParam = searchParams.get('link');

        if (titleParam) {
            try {
                setJobTitle(atob(titleParam));
            } catch {
                setJobTitle(titleParam);
            }
        }

        if (linkParam) {
            try {
                setJobId(atob(linkParam));
            } catch {
                setJobId(linkParam);
            }
        }
    }, [searchParams]);

    return (
        <>
            <Banner
                isLoading={false}
                title={`Apply for ${jobTitle || 'Job Position'}`}
                subtitle="Join our team and be part of something great"
                image="/upload/banner_images/career.jpg"
                short_description=""
            />

            <div className={`sectionArea ${Styles.sectionArea}`}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className={Styles.applyContent}>
                                <div className={Styles.jobHeader}>
                                    <h2 className={Styles.jobTitle}>
                                        Job Apply For: {jobTitle || 'Position'}
                                    </h2>
                                </div>

                                <JobApplyForm jobTitle={jobTitle} jobId={jobId} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default ApplyJob;