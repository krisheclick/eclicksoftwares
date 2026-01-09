"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import Styles from "@/components/hire-developer/style.module.css";

/* ---------- helper to safely parse API JSON strings ---------- */
const parseToArray = (value: any) => {
  try {
    if (!value) return [];
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
};

const API_BASE = "https://eclicksoftwaresnode.eclickprojects.com";

const Hirepage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- API CALL ---------- */
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/page/hire-developers`)
      .then((res) => res.json())
      .then((json) => setData(json.response_data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!data) return null;

  /* ---------- PARSED DATA ---------- */
  const repeaterData = parseToArray(data.page_repeater_data);
  const counterData = parseToArray(data.counter_data);

  const uspImages =
    data?.usp_categorys?.flatMap((cat: any) =>
      cat.usps.map((usp: any) => ({
        title: usp.usp_title,
        description: usp.usp_description,
        image: API_BASE + usp.usp_feature_image_path,
      }))
    ) || [];

  return (
    <div className={Styles.papasudipda}>
      {/* ================= HEADER ================= */}
      <section className={Styles.pageHeader}>
        <Container>
          <h1>{data.page_title}</h1>
          <p>{data.page_short_description}</p>
        </Container>
      </section>



      {/* ================= WHY HIRE DEVELOPERS ================= */}
      {repeaterData.length > 0 && (
        <section className={Styles.hiredevsec}>
          <Container>
            <h2 className={Styles.hdtilte}>
              hire remote developers 
              <strong>facilities</strong>
            </h2>
            <div className={Styles.mainboxhiretable}>
              {repeaterData.map((item: any, index: number) => (
                <div key={index} className={Styles.singleboxhiretable}>
                  <h3 className={Styles.tablehireheading}>
                    {item.title}
                  </h3> 
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}



      {/* ================= IMAGE LOOP ================= */}
      {uspImages.length > 0 && (
        <section className={Styles.hwbsec}>
          
          <Container>
              <div className={Styles.hwdfullbox}>
                <div className={Styles.hwdfulltextbox}>
                  <h2 className={Styles.hwdtilte}>Hire Web Developers</h2> 
                  <div className={Styles.hwdtiltepara}>With more than 16 years of experience in the IT sector, Eclick Softwares. has set itself as a top website development company offshore. Hire remote web developers to build customized websites and web portals for your business. We handpick the best website developers from the market after a rigorous scan and skill check. From responsive web development to PWA and eCommerce, build your own team of web developers at affordable costs.</div>
                </div>
              <div className={Styles.hwdsboxes}>
                <Row className={Styles.row}>
                  {uspImages.map((item: any, index: number) => (
                        <Col lg={3} md={4}>
                          <div className={Styles.hwdsbox}>
                            <figure>
                              <img
                                src={item.image}
                                alt={item.title}
                                className={Styles.uspImage}
                              />
                            </figure>
                            <div className={Styles.hwdsboxh}>{item.title}</div>
                            <div className={Styles.hwdsboxp}>
                              <div
                                dangerouslySetInnerHTML={{ __html: item.description }}
                              />
                            </div>
                            
                          </div>
                      </Col>
                  ))} 
                </Row>
              </div>
            </div>
          </Container>
           
        </section>
      )}

      {/* ================= TECHNOLOGIES ================= */}
      {data.technologies?.length > 0 && (
        <section className={Styles.techSectionsam}>
          <Container>
            <div className={Styles.hwdfulltextbox}>
              <h2 className={`${Styles.hwdtilte} ${Styles.hwdtectilte}`}>Standards our Web Designers and Developers for Hire Follow</h2> 
              <div className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}>Our web designs and developers follow internationally acclaimed  processes to build bespoke web solutions. Our processes adhere to the required sets of standards. We follow guidelines set by the World Wide Web Consortium (W3C) to maintain web standards across devices, screens,  and browsers.</div>
              <div className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}>Eclick Softwares is committed to implementing the best practices for web  security to ensure the protection of user data and maintain their privacy. We deliver reliable and top-notch websites that meet global benchmarks by adhering to local, international, and domain-specific  standards.</div>
            </div>
            <div className={Styles.techcmb}>
              <Row className={Styles.row}>
                {data.technologies.map((tech: any, index: number) => (
                  <Col key={index} lg={3} md={4} xs={6}>
                    <div className={Styles.techCardsbx}>
                      <figure className={Styles.techcardimg}><img src={API_BASE + tech.technology_feature_image_path} alt={tech.technology_title} /></figure>
                      <div className={Styles.techstitle}>{tech.technology_title}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </section>
      )}

      {/* ================= COUNTERS ================= */}
      {counterData.length > 0 && (
        <section className={Styles.counterSection}>
          <Container>
            <Row>
              {counterData.map((item: any, index: number) => (
                <Col key={index} md={3} sm={6}>
                  <div className={Styles.counterBox}>
                    <h3>
                      {item.site_counter_number}
                      {item.site_counter_simbol}
                    </h3>
                    <p>{item.site_counter_title}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ================= TEAM ================= */}
      {/* {data.recommend_team?.length > 0 && (
        <section className={Styles.teamSection}>
          <Container>
            <h2>Recommended Team</h2>

            <Row>
              {data.recommend_team.map((member: any, index: number) => (
                <Col key={index} md={4}>
                  <div className={Styles.teamCard}>
                    <img
                      src={API_BASE + member.team_feature_image_path}
                      alt={member.team_title}
                    />
                    <h4>{member.team_title}</h4>
                    <span>{member.team_designation}</span>
                    <p>{member.team_description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )} */}

      {/* ================= FAQ ================= */}
      {data.faqs?.length > 0 && (
      <section className={Styles.faqSectionsam}>
        <Container>
          <Row className={Styles.row}>
            <Col lg={5}>
              <div className={Styles.hmfaq_tpbx}>
                <h2 className={Styles.hwdtilte}>FAQs</h2>
                <div className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}>
                  Find quick answers to common questions related to hiring AI developers.
                </div>
                <div className={`${Styles.hwdtiltepara} ${Styles.hwdtectiltepara}`}>
                  Still have a question?
                </div>
                <button className={Styles.scheduleBtn}>
                  <span className={Styles.iconCircle}>
                     
                  </span>

                  <span className={Styles.btnText}>SCHEDULE A CALL</span>
                </button>
              </div>
            </Col>

            <Col lg={7}> 
              <Accordion
                className={Styles.customAccordion}
                defaultActiveKey="0"
              >
                {data.faqs.map((faq: any, index: number) => (
                  <Accordion.Item
                    eventKey={String(index)}
                    key={index}
                    className={Styles.accordionItem}
                  >
                    <Accordion.Header className={Styles.accHeader}>
                      <span className={Styles.icon} aria-hidden="true"></span>
                      <span className={Styles.faqhtilte}>
                        {faq.faq_title}
                      </span>
                    </Accordion.Header>

                    <Accordion.Body>
                      <div
                        className={Styles.faqbpara}
                        dangerouslySetInnerHTML={{ __html: faq.faq_description }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>

            </Col>
          </Row>
        </Container>
      </section>
    )}
    </div>
  );
};

export default Hirepage;


