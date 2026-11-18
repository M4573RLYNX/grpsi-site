import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { BASE_OPEN_GRAPH, SITE_URL } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GRP & Associates Ltd | Earthworks, Civil Engineering, Construction & Logistics — Solomon Islands",
    template: "%s | GRP & Associates",
  },
  description:
    "100% Solomon Islands owned since 1987. Earthworks, civil engineering, construction, marine works and logistics for mining, infrastructure and development projects, from Honiara and Gizo.",
  openGraph: BASE_OPEN_GRAPH,
};

export const viewport: Viewport = {
  themeColor: "#002B5B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
