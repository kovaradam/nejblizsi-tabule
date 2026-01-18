import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Nejbližší tabule",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <React.Suspense
          fallback={
            <div className="flex w-screen h-screen items-center justify-center">
              <Spinner />
            </div>
          }
        >
          {children}
        </React.Suspense>
      </body>
    </html>
  );
}
