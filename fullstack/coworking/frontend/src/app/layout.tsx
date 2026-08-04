import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import ToastifyComponent from "./components/ToastifyComponent";
import QueryProvider from "./components/QueryProvider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "COWORKING app",
  description: "Gerenciamento de Espaços de Trabalho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      data-scroll-behavior="smooth"
      className={"scroll-smooth scrollbar-custom antialiased"}
    >
      <body className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <ToastifyComponent>
          <QueryProvider>{children}</QueryProvider>
        </ToastifyComponent>
      </body>
    </html>
  );
}
