import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 data-testid="home-title" className="text-4xl font-bold mb-8">
        Pokemon Manager
      </h1>
      <p data-testid="home-subtitle" className="text-xl mb-8">
        Manage your Pokemon collection
      </p>
      <Link href="/pokemons">
        <Button data-testid="home-view-pokemon" size="lg">
          View All Pokemon
        </Button>
      </Link>
    </main>
  );
}
