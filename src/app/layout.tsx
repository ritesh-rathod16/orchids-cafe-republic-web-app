import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "Cafe Republic | Fresh Coffee. Cozy Vibes.",
  description: "Experience premium coffee and elegant dining at Cafe Republic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="1893a6a4-6f54-4ba2-ab7f-ae3c94c1fe6a"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <CartProvider>
          <Header />
          <main className="flex-1 pb-20">
            {children}
          </main>
          <BottomNav />
        </CartProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
