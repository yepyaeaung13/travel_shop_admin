import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import React from "react";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Travel Shop Admin",
  description: "Travel Shop Admin website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beVietnamPro.variable} antialiased font-be-vietnam-pro`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
