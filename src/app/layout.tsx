import type { Metadata } from "next";
import { Petit_Formal_Script, Spectral } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const petitFormalScript = Petit_Formal_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-petit-formal-script',
});

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-spectral',
});

export const metadata: Metadata = {
  title: "Fuwa Touch",
  description: "Home-service nail art and eyelashes app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <>
        <body
          className={`${petitFormalScript.variable} ${spectral.variable}`}
        >
          {children}
        </body>
      </>
    </html>
  );
}
