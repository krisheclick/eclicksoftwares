"use client";
import NotFound from "@/app/not-found";
import Banner from "@/components/portfoilo/Banner";
import PortfolioList from "@/components/portfoilo/List";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Styles from "@/components/portfoilo/style.module.css";
import LogoDesign from "@/components/portfoilo/LogoDesign";
const bannerData = {
   title: "Portfolio Details"
}
type Portfolios = {
   portfolio_feature_image_path?: string;
   portfolio_title?: string;
   portfolio_description?: string;
}
type PortflioData = {
   portfolio_group_title?: string;
   portfolio_group_slug?: string;
   Portfolios?: Portfolios[] | null;
}

const Page = ({ params }: { params: { slug: string } }) => {
   const [hasLoading, setLoading] = useState(true);
   const [data, setData] = useState<PortflioData | null>(null);
   const [notFoundPage, setNotFoundPage] = useState(false);
   const fetchData = async () => {
      const { slug } = await params;
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}group/${slug}`);
         const { response_code, response_data } = await response.json();
         if (!response_code) {
            setNotFoundPage(true);
            return;
         }
         setData(response_data);
      } catch (err: unknown) {
         console.log('API Data is something wrong: ', (err as Error).message);
      } finally {
         setLoading(false);
      }
   }
   useEffect(() => {
      fetchData();
   }, []);
   return (
      notFoundPage ? (
         <NotFound />
      ) : (
         <>
            <Banner data={bannerData} />

            <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
               <Container>
                  {data?.portfolio_group_slug === "logo-design" ? (
                     <LogoDesign portfolios={data.Portfolios ?? []} />
                  ) : (
                     <PortfolioList />
                  )}
               </Container>
            </div>
         </>
      )
   )
}

export default Page
