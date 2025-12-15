import { BlogProvider } from "@/context/Blogcontext";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Blog - Eclick Softwares & Solutions Pvt. Ltd.",
    description: "Eclick Softwares blog covers latest trends &amp; updates in web development, web designing, digital marketing &amp; technologies. Stay connected &amp; remain updated!"
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <BlogProvider>
            {children}
        </BlogProvider>
    )
}