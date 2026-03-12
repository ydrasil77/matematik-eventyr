import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathQuest 🧮 – Fra 1. klasse til universitetet",
  description:
    "Et sjovt og motiverende matematik-spil for danske elever fra 1. klasse til videregående uddannelse. Lær addition, subtraktion, algebra og kalkulus med belønninger og rigtige eksempler!",
  keywords: ["matematik", "spil", "lær", "dansk", "skole", "addition", "subtraktion"],
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧮</text></svg>" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "MathQuest" },
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
