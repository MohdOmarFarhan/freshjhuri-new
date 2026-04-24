import type { Metadata } from "next";
import { Outfit, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bazar - Safe & Organic Food",
  description: "Premium safe and organic food store in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${hindSiliguri.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans bg-amber-50/30 dark:bg-stone-900 text-stone-800 dark:text-stone-200 transition-colors duration-300">
        <ThemeProvider>
          <AppWrapper>
            <main className="flex-grow">{children}</main>
          </AppWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
