import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Jesus For All Initiative · Pad A Girl", template: "%s · J4AI" },
  description: "Breaking period stigma and promoting dignity. J4AI's Pad A Girl campaign supplies sanitary products and menstrual health education to schoolgirls in Borno State, Nigeria.",
  openGraph: { title: "Jesus For All Initiative · Pad A Girl", description: "Every girl deserves dignity, education and comfort.", images: ["/images/pad-a-girl-banner.jpg"], type: "website" },
  icons: { icon: "/brand/j4ai-emblem.png" },
};
export const viewport: Viewport = { themeColor: "#b70051", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 pt-16">{children}</div>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
