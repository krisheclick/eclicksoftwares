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
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
