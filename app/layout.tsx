import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01";
import Footer from "@/components/shadcn-studio/blocks/footer-component-01/footer-component-01";
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
    title: "Settings",
    href: "/settings",
  },
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Login",
    href: "/login",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServiceWorkerWrapper>
            <Navbar navigationData={navigationData} />
            <main>{children}</main>
            <Footer />
          </ServiceWorkerWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
