import seoData from "@/data/seo.json";
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
    const path = await params;
    console.log('path----------------', path)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/home`, {
        cache: "no-store", // or 'force-cache' for static
    });
    console.log('SEO API Response Status:', res.status);

    if (!res.ok) {
        return seoData;
    }
    const seo = await res.json();

    return {
        title: seo.title || seoData.title,
        description: seo.description || seoData.description,
        keywords: seo.keywords || [],
        openGraph: {
            type: seoData.openGraph.type,
            locale: seoData.openGraph.locale,
            siteName: seoData.openGraph.siteName,
            url: seoData.openGraph.url,
            title: seo.og_title,
            description: seo.og_description,
            images: [
                {
                    url: seo.og_image,
                    width: 1200,
                    height: 630,
                    alt: seoData.openGraph.siteName
                }
            ]
        },
        // openGraph: {
        //   title: seo.og_title,
        //   description: seo.og_description,
        //   images: [seo.og_image],
        // },
        twitter: {
            card: "summary_large_image",
            title: seo.og_title,
            description: seo.og_description,
            images: [
                {
                    url: seo.og_image,
                    width: 1200,
                    height: 630,
                    alt: seoData.openGraph.siteName
                }
            ]
        },
        alternates: {
            canonical: "https://example.com",
        },
    };
}

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    )
}