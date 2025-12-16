"use client";
import { useBlogContext } from "@/context/Blogcontext";
import Styles from "./style.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  slug: string[];
}

const BlogDetails = ({ slug }: Props) => {
  const blogSlug = slug[1];
  const { pageData, setPageData, hasLoading, setHasLoading } = useBlogContext();
  const [notFoundPage, setNotFoundPage] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blogSlug}`);
        const { response_code, response_data } = await response.json();

        if (!response_code) {
          setNotFoundPage(true);
        }

        setPageData(response_data);
      } catch (err: unknown) {
        console.log('API data is something wrong: ', (err as Error).message)
      } finally {
        setHasLoading(false);
      }
    }

    fetchData();
  }, [blogSlug, setPageData, setHasLoading]);

  return (
    notFoundPage ? (
      <div className="d-flex flex-column justify-content-center align-items-center vh-60 text-center p-4">
        <h2 className="fw-semibold mb-3">Oops! Post Not Found 😢</h2>
        <div className="mt-3">
          <Link href={`${process.env.NEXT_PUBLIC_ENV_URL}/blog`} className="eclick-btn-back">Back to Blogs</Link>
        </div>
      </div>
    ) : (
      !hasLoading ? (
        <div className={Styles.main_content}>
          <h2>Overview</h2>
          <div className={Styles.content}
            dangerouslySetInnerHTML={{ __html: pageData?.blog_description ?? '' }}
          />
        </div>
      ) : (
        <div className={`${Styles.main_content} ${Styles.skeleton_content}`}>
          <h4 className="skeleton mt-0"></h4>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText w-75"></div>
          <h2 className="skeleton"></h2>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText w-75"></div>
          <h3 className="skeleton"></h3>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText w-75"></div>
          <h4 className="skeleton"></h4>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText w-75"></div>
          <h3 className="skeleton"></h3>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText"></div>
          <div className="skeleton skeletonText w-75"></div>
          <h2 className="skeleton"></h2>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-100"></div>
          <div className="skeleton skeletonText w-75"></div>
        </div>
      )
    )
  );
};

export default BlogDetails;
