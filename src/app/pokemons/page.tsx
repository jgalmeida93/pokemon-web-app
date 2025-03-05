"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AddPokemonModal } from "@/components/Modal/AddNewPokemon";
import { EditPokemonModal } from "@/components/Modal/EditPokemon";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { usePokemon } from "@/context/PokemonContext";
import Image from "next/image";

export default function PokemonList() {
  const { pokemons, loading, fetchPokemons } = usePokemon();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        await fetchPokemons();
      } catch (error: unknown) {
        console.error("Error fetching Pokemon:", error);
      }
    };
    loadPokemons();
  }, [fetchPokemons]);

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(pokemon.types) &&
        pokemon.types.some((type) =>
          type.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  if (loading) {
    return <LoadingScreen message="Loading Pokémons..." />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Pokemon List</h1>
        <AddPokemonModal onPokemonAdded={() => {}} />
      </div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search Pokémon by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPokemons.length > 0 &&
          filteredPokemons.map((pokemon) => (
            <Card key={pokemon.id} className="overflow-hidden border-border">
              <CardHeader className="pb-2">
                <CardTitle className="capitalize">{pokemon.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {pokemon.imageUrl && (
                  <div className="flex justify-center">
                    <Image
                      src={pokemon.imageUrl}
                      alt={pokemon.name}
                      width={100}
                      height={100}
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                )}
                <div className="mt-2">
                  <p>
                    <span className="font-semibold">Types:</span>{" "}
                    <span className="text-muted-foreground">
                      {Array.isArray(pokemon.types)
                        ? pokemon.types.join(", ")
                        : typeof pokemon.types === "string"
                        ? pokemon.types
                        : String(pokemon.types)}
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/pokemons/${pokemon.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <EditPokemonModal
                  pokemon={pokemon}
                  onPokemonUpdated={() => {}}
                  trigger={
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  }
                />
              </CardFooter>
            </Card>
          ))}

        {filteredPokemons.length === 0 && (
          <div className="col-span-full flex justify-center items-center">
            <p data-testid="list-not-found" className="text-muted-foreground">
              {searchQuery
                ? "No Pokémons match your search."
                : "No Pokémons found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
