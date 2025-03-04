"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Escale Pokemon App
          </Link>
          <nav className="hidden md:flex gap-4 ml-4">
            <Link
              href="/pokemons"
              className="hover:text-primary transition-colors"
            >
              Pokemons
            </Link>
          </nav>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
