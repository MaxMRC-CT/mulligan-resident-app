import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mulligan Resident Portal",
  description: "Communication and accountability portal for Mulligan Recovery Centers residents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
