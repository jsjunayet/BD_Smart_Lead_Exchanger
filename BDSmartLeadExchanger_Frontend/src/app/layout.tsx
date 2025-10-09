import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BDSmartLeadExchanger | Digital Traffic & CPA Lead Exchange Platform",
  description:
    "BDSmartLeadExchanger is a trusted digital marketplace offering traffic exchange, CPA lead generation, social media growth, and business tools. Built on transparency and performance, we empower users to grow, earn, and succeed online.",
  icons: {
    icon: "logo.png",
  },
  openGraph: {
    title: "BDSmartLeadExchanger",
    description:
      "Join BDSmartLeadExchanger and tap into secure, transparent digital growth through traffic exchange, lead generation, and more.",
    url: "https://bdsmartleadx.com",
    siteName: "BDSmartLeadExchanger",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BDSmartLeadExchanger",
    description:
      "Grow your digital presence with secure traffic exchange, CPA leads, and premium business tools from BDSmartLeadExchanger.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <Toaster richColors position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
