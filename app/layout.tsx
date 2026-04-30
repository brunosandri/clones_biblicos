import type { Metadata } from "next";
import "./globals.css";
import { LayoutHeader } from "@/components/LayoutHeader";

export const metadata: Metadata = {
  title: "Clones da Biblia",
  description: "Estudo bíblico cronológico com mentores bíblicos temporais."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <LayoutHeader />
        {children}
      </body>
    </html>
  );
}
