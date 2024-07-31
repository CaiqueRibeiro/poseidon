import type { Metadata } from "next";
import "../styles/globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Poseidon Platform",
  description: "Trading bot platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link type="text/css" href="/css/notyf.min.css" rel="stylesheet" />
      </head>
      <body className="bg-gradient-to-t from-zinc-950 to-sky-900 w-full h-full">
        {children}
        <Script type="text/javascript" src="/js/notyf.min.js" />
        </body>
    </html>
  );
}
