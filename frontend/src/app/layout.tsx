import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { StructuredData } from "./structured-data";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alerta Estudiantil Colombia - Investigacion sobre Desercion Universitaria",
  description: "Investigacion independiente basada en datos oficiales del SPADIES - Ministerio de Educacion Nacional. Tasa de desercion anual 9.78% (2024). 15 anos de datos (2010-2024). Por Leonardo Mosquera, Ingeniero de Software y Analista de Datos.",
  keywords: [
    "desercion estudiantil Colombia",
    "tasa desercion universitaria",
    "SPADIES Ministerio Educacion",
    "abandono universitario Colombia",
    "retencion estudiantil IES",
    "desercion cohorte acumulada",
    "datos abiertos educacion Colombia",
    "Leonardo Mosquera analista datos",
    "dashboard desercion universitaria",
    "investigacion educacion superior Colombia"
  ],
  authors: [{ name: "Leonardo Mosquera" }],
  creator: "Leonardo Mosquera",
  publisher: "Leonardo Mosquera",
  openGraph: {
    title: "Alerta Estudiantil Colombia",
    description: "1 de cada 2 estudiantes no se gradua. Investigacion con datos oficiales del SPADIES - MEN Colombia.",
    url: "https://alerta-estudiantil.leomoslab.com",
    siteName: "Alerta Estudiantil Colombia",
    locale: "es_CO",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Alerta Estudiantil Colombia",
    description: "1 de cada 2 estudiantes no se gradua. Datos oficiales SPADIES - MEN Colombia."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large"
    }
  },
  alternates: {
    canonical: "https://alerta-estudiantil.leomoslab.com"
  }
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
