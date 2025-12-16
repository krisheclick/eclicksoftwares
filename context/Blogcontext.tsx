"use client";
import { createContext, ReactNode, useContext, useState } from "react";
/* ====== Type Define ====== */
type CategoryData = {
    blog_category_feature_image_path: string;
    blog_category_title: string;
    blog_category_slug: string;
    blog_category_description: string;
}
type BlogCategory = {
    blog_category_feature_image_path: string;
    blog_category_title: string;
    blog_category_slug: string;
}
type RecentPost = {
    blog_feature_image_path: string;
    blog_title: string;
    blog_slug: string;
    blog_short_description: string;
    publish_date: string;
    Category: BlogCategory | null;
}
type BlogData = {
    blog_feature_image_path: string;
    blog_title: string;
    blog_slug: string;
    blog_short_description: string;
    publish_date: string;
    Category: BlogCategory | null;
}
type Pagination = {
    totalCount: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    has_prev: boolean;
    has_next: boolean;
}

/* ====== Type Define Details Page ======  */
type DetailsData = {
    blog_banner_image_path: string;
    blog_feature_image_path: string;
    blog_title: string;
    blog_slug: string;
    blog_description: string;
    publish_date: string;
    Category: {
        blog_category_title: string;
        blog_category_slug: string;
    }
}
type BlogcontextData = {
    hasLoading: boolean | null;
    setHasLoading: (hasLoading: boolean) => void;
    pagination: Pagination | null;
    setPagination: (pagination: Pagination) => void;
    recentPost: RecentPost[] | null;
    setRecentPost: (recentPost: RecentPost[]) => void;
    categoryData: CategoryData[] | null;
    setDategoryData: (categoryData: CategoryData[]) => void;
    allBlogs: BlogData[] | null;
    setAllBlogs: (allBlogs: BlogData[]) => void;
    allCategory: CategoryData[] | null;
    setCategoryData: (allCategory: CategoryData[]) => void;

    /* Details */
    pageData: DetailsData | null;
    setPageData: (pageData: DetailsData) => void;
}
const blogContext = createContext<BlogcontextData | undefined>(undefined);
export const BlogProvider = ({children}: {children: ReactNode}) => {
    const [hasLoading, setHasLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [recentPost, setRecentPost] = useState<RecentPost[] | null>(null);
    const [categoryData, setDategoryData] = useState<CategoryData[] | null>(null);
    const [allBlogs, setAllBlogs] = useState<BlogData[] | null>(null);
    const [allCategory, setCategoryData] = useState<CategoryData[] | null>(null);

    const [pageData, setPageData] = useState<DetailsData | null>(null)
    return(
        <blogContext.Provider value={{
            hasLoading, setHasLoading,
            pagination, setPagination,
            recentPost, setRecentPost,
            categoryData, setDategoryData,
            allBlogs, setAllBlogs,
            allCategory, setCategoryData,
            pageData, setPageData
        }}>
            {children}
        </blogContext.Provider>
    )
}

export const useBlogContext = () : BlogcontextData => {
    const blogContent = useContext(blogContext);
    if(!blogContent){
        throw new Error("useBlogContext must be used within a BlogProvider on layout.tsx");
    }

    return blogContent;
}