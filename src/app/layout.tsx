import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "PartiFi – Loan Participation Marketplace for Credit Unions",
  description:
    "The members-only platform where credit unions and vetted brokers post, search, and settle loan participations. Secure, compliant, and built for the CU industry.",
  keywords: ["loan participations", "credit unions", "brokers", "lending", "NCUA"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
