import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";
import ServiceWorkerWrapper from "@/components/service-worker-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HarmonyHub",
  description: "A social music tracking and recommendation website",
};

const navigationData = [
  {
    title: "Chart",
    href: "/chart",
  },
  // {
  //   title: "Ratings",
  //   href: "/ratings",
  // },
  {
    title: "Friends",
    href: "/friends",
  },
  {
    title: "Home",
    href: "/",
    logo: true,
  },
  {
    title: "Leaderboards",
    href: "/settings", // placeholder for now since the leaderboards page isn't ready yet
  },
  {
    title: "Settings",
    href: "/settings",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ServiceWorkerWrapper>
          <Navbar navigationData={navigationData} />
          <main>{children}</main>
        </ServiceWorkerWrapper>
      </body>
    </html>
  );
}
