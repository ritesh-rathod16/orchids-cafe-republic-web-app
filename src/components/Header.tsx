"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  // Hide Header on admin pages if needed, but usually header is fine
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="container flex h-16 items-center justify-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-bold tracking-tight">CAFE REPUBLIC</span>
        </Link>
      </div>
    </header>
  );
}
