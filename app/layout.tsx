import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import ServiceWorkerWrapper from "@/components/service-worker-wrapper";
import { ThemeProvider } from "next-themes";

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
  {
    title: "Friends",
    href: "/friends",
  },
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Leaderboards",
    href: "/leaderboards",
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
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServiceWorkerWrapper>
            <Navbar navigationData={navigationData} />
            <main>{children}</main>
          </ServiceWorkerWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
