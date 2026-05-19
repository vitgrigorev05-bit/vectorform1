import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ВекторФорм - 3D-печать и маркетплейс моделей",
  description: "Платформа для автоматического расчёта стоимости 3D-печати, маркетплейса 3D-моделей и распределённого производства",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
