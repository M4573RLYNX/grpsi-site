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
    default: "GRP & Associates Ltd | Maritime, Engineering & Fuel — Solomon Islands",
    template: "%s | GRP & Associates",
  },
  description:
    "Maritime logistics, civil engineering and fuel distribution across the Solomon Islands, from our base in Honiara.",
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
