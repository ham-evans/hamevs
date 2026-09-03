import type { Metadata } from "next";
import { Inter, Roboto_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-title",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Hamilton Evans",
  description: "Personal website of Hamilton Evans",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} ${sourceSerif.variable} ${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
