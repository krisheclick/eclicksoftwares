"use client";

import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Styles from "@/components/hire-developer/style.module.css";

const Hirepage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://eclicksoftwaresnode.eclickprojects.com/api/v1/page/hire-developers"
        );
        const json = await res.json();
        setData(json.response_data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!data) return null;

  // Parse JSON string fields safely
  const repeaterData = data.page_repeater_data
    ? JSON.parse(data.page_repeater_data)
    : [];

  const counterData = data.counter_data
    ? JSON.parse(data.counter_data)
    : [];

  return (

    <div className={Styles.papa}>
      <Container>
      {/* ================= Page Header ================= */}
      <h1>{data.page_title}</h1>
      <p>{data.page_short_description}</p>

      {/* ================= Repeater Section ================= */}
      <section style={{ marginTop: "40px" }}>
        <h2>Why Hire Developers</h2>
        {repeaterData.map((item: any, index: number) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      {/* ================= Technologies ================= */}
      <section style={{ marginTop: "40px" }}>
        <h2>Technologies</h2>
        <ul>
          {data.technologies?.map((tech: any, index: number) => (
            <li key={index}>{tech.technology_title}</li>
          ))}
        </ul>
      </section>

      {/* ================= Counter Section ================= */}
      <section style={{ marginTop: "40px" }}>
        <h2>Our Stats</h2>
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {counterData.map((item: any, index: number) => (
            <div key={index}>
              <h3>
                {item.site_counter_number}
                {item.site_counter_simbol}
              </h3>
              <p>{item.site_counter_title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Recommended Team ================= */}
      <section style={{ marginTop: "40px" }}>
        <h2>Recommended Team</h2>
        {data.recommend_team?.map((member: any, index: number) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>{member.team_title}</h3>
            <strong>{member.team_designation}</strong>
            <p>{member.team_description}</p>
          </div>
        ))}
      </section>

      {/* ================= FAQs ================= */}
      <section style={{ marginTop: "40px" }}>
        <h2>FAQs</h2>
        {data.faqs?.map((faq: any, index: number) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{faq.faq_title}</strong>
            <p>{faq.faq_description}</p>
          </div>
        ))}
      </section>
      </Container>
    </div>
  );
};

export default Hirepage;


