import { Anton, Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import "./globals.css";
const displayFont = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
export const metadata = {
  title: {
    default: "OM Mobile Repair Center - Expert Phone & Device Repairs",
    template: "%s | OM Mobile Repair",
  },
  description:
    "Book professional mobile, and laptop repairs at OM Mobile Repair Center. Fast turnaround, genuine parts,and expert technicians near you.",
  keywords: [
    "mobile repair",
    "phone repair near me",
    "screen replacement",
    "battery replacement",
    "OM Mobile Repair",
    "device repair center",
    "tablet repair",
    "smartwatch repair",
    "laptop repair",
    "om mobile repair",
  ],
  openGraph: {
    title: "OM Mobile Repair Center",
    description:
      "Booki expert device repairs online. Fast, reliable, affordable.",
    url: "https://www.ommobilerepair.com",
    siteName: "OM Mobile Repair",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OM Mobile Repair Center",
    description: "Fast & reliable device repair services. Book online now!",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://www.ommobilerepair.com"),
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-bg text-ink font-sans antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
