import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathQuest 🧮 – Fra 1. klasse til universitetet",
  description:
    "Et sjovt og motiverende matematik-spil for danske elever fra 1. klasse til videregående uddannelse. Lær addition, subtraktion, algebra og kalkulus med belønninger og rigtige eksempler!",
  keywords: ["matematik", "spil", "lær", "dansk", "skole", "addition", "subtraktion"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-152.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "MathQuest" },
  applicationName: "MathQuest",
};


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#6d28d9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body className="antialiased">{children}</body>
    </html>
  );
}
