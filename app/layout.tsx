import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0f131c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SafeDrive AI Perception Core | Autonomous Indian Road Navigation System",
  description: "AeroPath - Adaptive Planning & Collision Avoidance Hub engineered for chaotic, unstructured road environments.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${geistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-on-surface font-sans antialiased min-h-screen selection:bg-primary-container selection:text-surface-container-lowest">
        {children}
      </body>
    </html>
  );
}
