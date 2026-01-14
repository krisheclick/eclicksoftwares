"use client";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "@/components/common/banner/Banner";
import Link from "next/link";
import Image from "next/image";
import Styles from "./style.module.css";

interface Job {
    id: string;
    title: string;
    location: string;
    description: string;
    requirements: string[];
}

const Careers = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // For now, using static data based on the website content
        // In production, this would fetch from API
        const staticJobs: Job[] = [
            {
                id: "sr-php-web-developer",
                title: "Sr. PHP Web Developer",
                location: "Kolkata",
                description: "We are hiring a Senior PHP Web Developer at Eclick Softwares and Solutions Pty Ltd. You will be responsible for writing clean, maintainable and performance PHP code. You have to work in collaboration with our team to create a great output for our clients.",
                requirements: [
                    "Should have a solid understanding of PHP / Core PHP & MySQL",
                    "Basic knowledge of HTML, CSS, Bootstrap etc.",
                    "Exposure to customization on open source, E-commerce, MVC & CMS modules",
                    "Good concept on OOPS fundamentals",
                    "Good knowledge of WordPress & CI or Laravel",
                    "Knowledge in any one of Javascript Framework (React, Angular, Node etc) with strong Database knowledge"
                ]
            }
        ];
        setJobs(staticJobs);
        setIsLoading(false);
    }, []);

    return (
        <>
            <Banner
                isLoading={false}
                title="Join Eclick To Inspire And Be Inspired"
                subtitle="Focussing on Technology and Innovation To Deliver Results"
                image="/upload/banner_images/career.jpg"
                short_description=""
            />

            <div className={`sectionArea ${Styles.sectionArea}`}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <div className={Styles.careersContent}>
                                <div className={Styles.introText}>
                                    <p>
                                        Tap, click, scroll – and explore the scale and depth of career paths which await
                                        you at Eclick. It&apos;s for people who are looking to escape from the world of
                                        ordinary opportunities and collaborate with insightful, extraordinary people in an
                                        environment that cultivates individuality and creativity.
                                    </p>
                                    <p>
                                        <Link href="https://eclicksoftwares.com/" target="_blank" rel="noopener noreferrer">
                                            Eclick
                                        </Link> is filled with smart people, each of whom are involved actively in helping
                                        industries around the world do something better, more productively and more
                                        efficiently. Very few places in Kolkata provide as many opportunities as Eclick for
                                        gaining knowledge in your field of expertise, working in a challenging environment &
                                        being rewarded for excellent performance.
                                    </p>
                                    <p>
                                        To be yourself in a world that is constantly trying to make you something else
                                        is the greatest accomplishment.
                                    </p>
                                </div>

                                <div className={Styles.careerImage}>
                                    <Image
                                        src="/images/career.png"
                                        alt="Career at Eclick"
                                        width={800}
                                        height={400}
                                        className="img-fluid"
                                        style={{ borderRadius: '10px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </div>

                                <div className={Styles.jobListings}>
                                    <h2 className={Styles.sectionTitle}>Current Openings</h2>

                                    {isLoading ? (
                                        <div className={Styles.loading}>
                                            <p>Loading job openings...</p>
                                        </div>
                                    ) : jobs.length > 0 ? (
                                        <div className={Styles.jobsGrid}>
                                            {jobs.map((job) => (
                                                <div key={job.id} className={Styles.jobCard}>
                                                    <div className={Styles.jobHeader}>
                                                        <h3 className={Styles.jobTitle}>{job.title}</h3>
                                                        <p className={Styles.jobLocation}>
                                                            <strong>Location:</strong> {job.location}
                                                        </p>
                                                    </div>

                                                    <div className={Styles.jobDescription}>
                                                        <p>{job.description}</p>
                                                    </div>

                                                    <div className={Styles.jobRequirements}>
                                                        <h4>Requirements:</h4>
                                                        <ul>
                                                            {job.requirements.map((req, index) => (
                                                                <li key={index}>{req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className={Styles.jobActions}>
                                                        <Link
                                                            href={`/careers/apply-job?s=${btoa(job.title)}&link=${btoa(job.id)}`}
                                                            className={`eclick-btn-primary ${Styles.applyBtn}`}
                                                        >
                                                            <em>Apply Now</em>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={Styles.noJobs}>
                                            <p>No current openings available. Please check back later.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Careers;