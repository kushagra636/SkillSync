import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSync | Career Intelligence",
  description:
    "Track your skills, analyze job descriptions, and close your career skill gaps.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full">
        <Script id="theme-initialization" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const savedTheme = localStorage.getItem("skillsync-theme");
                const theme = savedTheme === "light" ? "light" : "dark";
                document.documentElement.classList.toggle("dark", theme === "dark");
              } catch {
                document.documentElement.classList.add("dark");
              }
            })();
          `}
        </Script>

        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}