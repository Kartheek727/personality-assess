import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientProviders } from "./client-providers";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Mind Avenues - Unlocking Human Potential",
  description:
    "Mind Avenues is a global organization dedicated to psychological wellness, self-realization, and human potential.",
  keywords: [
    "Mind Avenues",
    "Psychological Wellness",
    "Human Potential",
    "Mental Health",
    "Self-Realization",
  ],
  authors: [{ name: "Dr. Damera Vijayalakshmi" }, { name: "Dr. Kotra Krishna Mohan" }],
  openGraph: {
    title: "Mind Avenues | Psychological Wellness & Human Potential",
    description: "Mind Avenues offers psychological assessments and interventions.",
    type: "website",
    url: "https://www.mindavenues.com",
    images: [{ url: "https://www.mindavenues.com/assets/mindavenues-banner.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mind Avenues | Psychological Wellness & Human Potential",
    description: "Unlock your potential with Mind Avenues.",
    images: ["https://www.mindavenues.com/assets/mindavenues-banner.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={cn(poppins.variable, "min-h-screen w-full antialiased overflow-x-hidden")}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}