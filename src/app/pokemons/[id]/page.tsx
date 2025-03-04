"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pokemon } from "@/types/pokemon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { pokemonApi } from "@/app/services/api";
import { DeleteConfirmationModal } from "@/components/Modal/DeleteConfirmation";
import { EditPokemonModal } from "@/components/Modal/EditPokemon";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function PokemonDetails() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await pokemonApi.getById(id);
        setPokemon(data);
      } catch (error) {
        toast.error("Failed to fetch Pokemon details");
        console.error("Error fetching Pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPokemon();
    }
  }, [id]);

  const handlePokemonDeleted = () => {
    router.push("/pokemons");
  };

  if (loading) {
    return <LoadingScreen message="Loading Pokémons..." />;
  }

  if (!pokemon) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Pokemon not found</h1>
        <Link href="/pokemons">
          <Button>Back to Pokemon List</Button>
        </Link>
      </div>
    );
  }

  console.log(pokemon);

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="mb-6">
        <Link href="/pokemons">
          <Button variant="outline" size="sm">
            &larr; Back to Pokemon List
          </Button>
        </Link>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold capitalize flex justify-between items-center">
            {pokemon.name}
            <span className="text-sm bg-muted text-muted-foreground px-3 py-1 rounded-full">
              #{pokemon.pokeApiId}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex justify-center">
              {pokemon.imageUrl && (
                <Image
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  width={250}
                  height={250}
                  className="object-contain w-full max-w-[250px] h-auto"
                  priority
                />
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Types</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {typeof pokemon.types === "string"
                    ? pokemon.types.split(",").map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize"
                        >
                          {type.trim()}
                        </span>
                      ))
                    : Array.isArray(pokemon.types)
                      ? pokemon.types.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize"
                          >
                            {type}
                          </span>
                        ))
                      : null}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Abilities</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {typeof pokemon.abilities === "string"
                    ? pokemon.abilities.split(",").map((ability) => (
                        <span
                          key={ability}
                          className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-sm capitalize"
                        >
                          {ability.trim()}
                        </span>
                      ))
                    : Array.isArray(pokemon.abilities)
                      ? pokemon.abilities.map((ability) => (
                          <span
                            key={ability}
                            className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-sm capitalize"
                          >
                            {ability}
                          </span>
                        ))
                      : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Height</h3>
                  <p>{pokemon.height / 10} m</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Weight</h3>
                  <p>{pokemon.weight / 10} kg</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <EditPokemonModal
            pokemon={pokemon}
            onPokemonUpdated={(updatedPokemon) => setPokemon(updatedPokemon)}
            trigger={
              <Button variant="outline" className="w-full sm:w-auto">
                Edit Pokemon
              </Button>
            }
          />
          <DeleteConfirmationModal
            pokemon={pokemon}
            onPokemonDeleted={handlePokemonDeleted}
            trigger={
              <Button variant="destructive" className="w-full sm:w-auto">
                Delete Pokemon
              </Button>
            }
          />
        </CardFooter>
      </Card>
    </div>
  );
}
