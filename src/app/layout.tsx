import type { Metadata } from "next";
import { Petit_Formal_Script, Spectral } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

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
      <body
        className={`${petitFormalScript.variable} ${spectral.variable} bg-stone-900 text-stone-100 min-h-screen`}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
