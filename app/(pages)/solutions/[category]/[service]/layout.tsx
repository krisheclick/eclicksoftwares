// import type { Metadata } from "next";
// import Head from 'next/head';

// export async function generateMetadata({ params }: { params: Promise <{ slug: string[] }> }) {

//     return {
//         title: 'Darpan Magazine',
//         description: 'Default Description',
//     };

// }


export default async function SolutionsLayout({
    children,
    className = "",  // Default to an empty string if no className is provided
}: Readonly<{
    children: React.ReactNode;
    className?: string;  // Optional className prop
}>) {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}

