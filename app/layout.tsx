import type { Metadata } from "next";
import { Instrument_Sans, DM_Sans, Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "@/app/globals.css";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import RouteLoader from "@/components/RouteLoader";
export const dynamic = 'force-dynamic';

const primaryFont = Instrument_Sans({
  variable: "--primary-font",
  subsets: ["latin"],
});

const secondaryFont = DM_Sans({
  variable: "--secondary-font",
  subsets: ["latin"],
});

const tertiaryFont = Inter({
  variable: "--tertiary-font",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eclick Softwares: Innovation-Driven Web Development & Digital Agency",
  description: "Eclick Softwares is a top web design & development company offering innovative digital solutions to grow your business online. Book a Free Quote Today.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let response = null;

try {
  // const res = await fetch(API_URL, { cache: 'no-store' });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}menu/07e44c0de79cdf07b8b1`, { cache: 'no-store' });
  if (!res.ok) throw new Error('API failed');
  response = await res.json();
} catch (err) {
  console.error('API fetch failed:', err);
}
  // const menuBar = await fetch(`${process.env.NEXT_PUBLIC_API_URL}menu/07e44c0de79cdf07b8b1`);
  // const response = await menuBar.json();
  return (
    <ThemeProvider>
      <html lang="en">
        <body
          className={`${primaryFont.variable} ${secondaryFont.variable} ${tertiaryFont.variable} antialiased`}
        >
          <RouteLoader />
          <Header menuData={response.response_data} />
          <main role="main" className="mainContainer">{children}</main>
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
}
