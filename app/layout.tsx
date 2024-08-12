import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";

const fonts = Oxanium({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Contraudit",
  description: "Clodron Contract Audit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fonts.className}>
        <Nav />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
