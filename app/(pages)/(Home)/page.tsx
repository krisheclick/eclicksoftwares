"use client";
import Clients from "@/components/clients/Clients";
import SliderBanner from "@/components/common/banner/Sliderbanner";
import Aboutcomponent from "@/components/home/About";
import Blog from "@/components/home/blog/Blog";
import HookIndustry from "@/components/home/industry/Industry";
import HookClients from "@/components/home/our-clients/Clients";
import Workaction from "@/components/home/casestudy/Workaction";
import Platformscomponent from "@/components/home/platforms/Platforms";
import Coreservice from "@/components/home/service/Coreservice";
import { useEffect, useState } from "react";
import SliderBannerSkeleton from "@/components/common/banner/SliderBannerSkeleton";

type SEO = {
  og_image_path: string;
  meta_title: string;
  meta_keywords: string;
  meta_descriptions: string;
  meta_robots: string;
  og_image: string;
}

type Project = {
  proj_name: string;
  proj_slug: string;
  proj_banne_image: string;
  proj_banne_image_path: string | null;
  proj_responsive_image_1_path: string | null;
  proj_responsive_image_2_path: string | null;
  proj_tools_used: string;
}

type Page = {
  page_feature_image_path: string;
  heading: string;
  page_feature_image: string;
  short_description: string;
  description: string;
  pages_custom_field: string;
  seo: SEO;
  banner: Project | undefined;
}
type BannerData = {
  joza_title: string;
  title_tag: string;
  joza_description: string;
}
type Content = {
  c0be_title?: string;
  c0be_description?: string;
  c0be_usp_icon1?: string;
  c0be_usp_title1?: string;
  c0be_usp_icon2?: string;
  c0be_usp_title2?: string;
  c0be_usp_icon3?: string;
  c0be_usp_title4?: string;
  c0be_image?: string;
};

type CallToAction = {
  tpdc_title?: string;
}
export default function Home() {
  const [pagedata, setPageData] = useState<Page | null>(null);
  const [bannerContent, setBannerContent] = useState<BannerData>({ joza_title: '', title_tag: '', joza_description: '' });
  const [aboutContent, setAboutContent] = useState<Content>({});
  const [callToActContent, setCallToActContent] = useState<CallToAction>({ tpdc_title: '' });
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const API = `${process.env.NEXT_PUBLIC_API_URL}page/home`;

      const response = await fetch(API);
      if (!response.ok) {
        throw new Error("API data is not ok. Please check & fixed...");
      }
      const data = await response.json();
      if (data.response_code === false) {
        console.error("API response_code is false");
        return;
      }
      setPageData(data.response_data);
    } catch (err) {
      console.error('API error:', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (pagedata) {

      if (pagedata.pages_custom_field) {
        try {
          const custom_field_data = JSON.parse(pagedata.pages_custom_field).group_name;
          setBannerContent(custom_field_data.banner);
          setAboutContent(custom_field_data['about-us']);
          setCallToActContent(custom_field_data['call-to-action']);
        } catch (err) {
          console.error('Error parsing custom field data:', err);
        }
      }
    }
  }, [pagedata]);

  return (
    <>
      {isLoading ? <SliderBannerSkeleton /> : <SliderBanner banner={pagedata?.banner} bannerdata={bannerContent} />}
      <Clients />
      <Aboutcomponent isLoading={isLoading} content={aboutContent} calltoaction={callToActContent} />
      <Coreservice />
      <HookIndustry />
      <Platformscomponent />
      <Workaction />
      <HookClients />
      <Blog />
    </>
  );
}
