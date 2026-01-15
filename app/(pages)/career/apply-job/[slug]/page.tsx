"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "@/components/common/banner/Banner";
import JobApplyForm from "@/components/career/JobApplyForm";
import Styles from "./style.module.css";

type Career = {
    career_feature_image_path: string;
    career_id: number;
    career_name: string;
    career_slug: string;
    career_location: string;
    career_description: string;
    career_feature_image: string;
    // Add more fields if available, like full description
};

const ApplyJob = () => {
    const params = useParams();
    const slug = params.slug as string;
    const [job, setJob] = useState<Career | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobData = async () => {
            if (!slug) return;
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers/${slug}`);
                const { response_data } = await response.json();
                setJob(response_data);
            } catch (err: unknown) {
                console.error("Failed to fetch job data:", (err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobData();
    }, [slug]);

    return (
        <>
            <Banner
                isLoading={isLoading}
                title={`Apply for ${job?.career_name || 'Job Position'}`}
                subtitle="Join our team and be part of something great"
                image={job?.career_feature_image_path || ''}
                short_description=""
                showButton={false}
            />

            <div className={`sectionArea ${Styles.sectionArea}`}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={6}>
                            <div className={Styles.jobDetails}>
                                <h2 className={Styles.jobTitle}>
                                    {job?.career_name || 'Job Position'}
                                </h2>
                                <p className={Styles.jobLocation}>
                                    Location: {job?.career_location}
                                </p>
                                <div className={Styles.jobDescription}>
                                    <div dangerouslySetInnerHTML={{ __html: job?.career_description || "" }} />
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={Styles.applyContent}>
                                <JobApplyForm 
                                    jobTitle={job?.career_name || ''} 
                                    jobId={job?.career_id?.toString() || ''} 
                                    jobLocation={job?.career_location || ''}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default ApplyJob;