"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// ================= TYPES =================

interface ApiResponse<T> {
  response_code: boolean;
  response_message: string;
  response_data: T;
}

interface AboutcomponentData {
  id: number;
  heading: string;
  page_feature_image: string;
  short_description: string;
  page_title: string;
  description: string;
  pages_custom_field: string; // JSON string
  page_repeater_data: string; // JSON string
  page_technologies_used: string | null;
  page_top_pick_team: string | null;
  page_teams_used: string;
  usp_categorys: UspCategory[];
  top_pick_team: TeamMember[] | null;
  faqs: Faq[];
  technologies: Technology[];
  recommend_team: TeamMember[];
  counter_data: string; // JSON string
}

interface UspCategory {
  usp_category_title: string;
  usp_category_description: string;
  usps: Usp[];
}

interface Usp {
  usp_feature_image_path: string;
  usp_title: string;
  usp_short_description: string;
  usp_description: string;
  usp_feature_image: string;
}

interface CounterItem {
  site_counter_number: string;
  site_counter_simbol: string;
  site_counter_title: string;
}

interface TeamMember {
  team_feature_image_path: string;
  team_title: string;
  team_rating: string;
  team_designation: string;
  team_description: string;
  team_feature_image: string;
}

interface Faq {
  id?: number;
  question?: string;
  answer?: string;
}

interface Technology {
  id?: number;
  name?: string;
  icon?: string;
}

// ================= COMPONENT =================

const Aboutcomponent = () => {
  const [aboutData, setAboutData] = useState<AboutcomponentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/about-us`)
      .then((res) => res.json())
      .then((result: ApiResponse<AboutcomponentData>) => {
        setAboutData(result.response_data);
      })
      .catch((err) => {
        console.error("Failed to fetch About Page:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!aboutData) return <p>No data found.</p>;

  // Safely parse counter_data
  let counters: CounterItem[] = [];
  try {
    counters = JSON.parse(aboutData.counter_data || "[]");
  } catch (e) {
    console.error("Invalid counter_data JSON", e);
  }

  return (
    <div className="about_page">
      <section>
        {/* ================= ABOUT CONTENT ================= */}
        <div className="about-content">
          <h2>{aboutData.heading}</h2>
          <p>{aboutData.short_description}</p>
          <div dangerouslySetInnerHTML={{ __html: aboutData.description }} />
        </div>

        {/* ================= USP LOOP ================= */}
        <div className="usp-section">
          {aboutData.usp_categorys?.map((category, i) => (
            <div key={i} className="usp-category">
              <h3>{category.usp_category_title}</h3>
              <div className="usp-grid">
                {category.usps?.map((usp, j) => (
                  <div key={j} className="usp-card">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/uploads/page_image/${usp.usp_feature_image_path}`}
                        alt={usp.usp_title || "Title"}
                        width={50} height={50}
                        priority
                    />
                    <h4>{usp.usp_title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: usp.usp_description || "" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ================= COUNTER LOOP ================= */}
        <div className="counter-section">
          {counters.map((item, i) => (
            <div key={i} className="counter-box">
              <h2>
                {item.site_counter_number}
                {item.site_counter_simbol}
              </h2>
              <p>{item.site_counter_title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Aboutcomponent;
