import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Frond } from "@/components/botanical";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brew",
  description: "Sporing av håndbrygg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${playfair.variable} ${inter.variable} h-full antialiased bg-parchment`}
    >
      <body className="min-h-full">
        <Frond
          aria-hidden="true"
          className="text-heading/75 rotate-45 fixed -bottom-24 -left-48 size-128 pointer-events-none select-none"
        />
        <div className="relative min-h-full">{children}</div>
      </body>
    </html>
  );
}
