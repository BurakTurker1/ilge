import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "İLGE | Türk Tarihi Atlası",
  description: "Türk tarihini interaktif harita, zaman çizgisi ve ansiklopedi modülleriyle keşfedin.",
  keywords: ["Türk tarihi", "tarih atlası", "Selçuklu", "Osmanlı", "Göktürk", "İLGE"]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
