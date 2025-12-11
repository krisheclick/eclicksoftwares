"use client";
import NotFound from "@/app/not-found";
import Banner from "@/components/portfoilo/Banner";
import PortfolioList from "@/components/portfoilo/List";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Styles from "@/components/portfoilo/style.module.css";
import LogoDesign from "@/components/portfoilo/LogoDesign";
import Tshirt from "@/components/portfoilo/t-shirt";
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
   const pageSlug = data?.portfolio_group_slug;
   const items = data?.Portfolios ?? [];
   const title = data?.portfolio_group_title;

   console.log('data', data)
   let content;

   if (pageSlug === "logo-design" || pageSlug === "illustration") {
      content = <LogoDesign hasLoading={hasLoading} title={title ?? ''} portfolios={items} />;
   } else if (pageSlug === "website-design") {
      content = <PortfolioList />;
   } else {
      content = <Tshirt hasLoading={hasLoading} title={title ?? ''} portfolios={items} />;
   }

   return (
      notFoundPage ? (
         <NotFound />
      ) : (
         <>
            <Banner title={title} />

            <div className={`sectionArea ${Styles.sectionArea ?? ''}`}>
               <Container>
                  {content}
               </Container>
            </div>
         </>
      )
   )
}

export default Page
