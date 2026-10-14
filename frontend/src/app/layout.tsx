import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { StructuredData } from "./structured-data";
import { Navbar } from "@/components/Navbar";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alerta Estudiantil Colombia",
  description: "Investigación independiente sobre deserción en la educación superior colombiana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={geistSans.variable + " " + geistMono.variable}>
      <body className="bg-[#0B0F19] text-zinc-100 antialiased">
        <StructuredData />
        <Providers>
          <a href="#main" className="skip-to-content">Saltar al contenido principal</a>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
