"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Pokemon, PokemonFormData } from "@/types/pokemon";
import { pokemonApi } from "@/app/services/api";
import { toast } from "sonner";

interface PokemonContextType {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  fetchPokemons: () => Promise<void>;
  getPokemon: (id: number) => Promise<Pokemon>;
  addPokemon: (pokemon: PokemonFormData) => Promise<Pokemon>;
  updatePokemon: (
    id: number,
    pokemon: Partial<PokemonFormData>
  ) => Promise<Pokemon>;
  deletePokemon: (id: number) => Promise<void>;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await pokemonApi.getAll();
        setPokemons(data);
      } catch (err) {
        setError("Failed to fetch initial Pokemon data");
        toast.error("Failed to load Pokemon list");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pokemonApi.getAll();
      setPokemons(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching Pokemon:", err);
      setError("Failed to fetch Pokemon data");
      toast.error("Failed to refresh Pokemon list");
    } finally {
      setLoading(false);
    }
  }, []);

  const getPokemon = useCallback(async (id: number) => {
    try {
      return await pokemonApi.getById(id);
    } catch (err) {
      toast.error("Failed to fetch Pokemon details");
      throw err;
    }
  }, []);

  const addPokemon = useCallback(
    async (pokemon: PokemonFormData) => {
      try {
        setLoading(true);
        const newPokemon = await pokemonApi.create(pokemon);
        setPokemons((currentPokemons) => [...currentPokemons, newPokemon]);

        toast.success("Pokemon added successfully!");

        await fetchPokemons();

        return newPokemon;
      } catch (err) {
        setError("Failed to add Pokemon");
        toast.error("Failed to add Pokemon");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPokemons]
  );

  const updatePokemon = useCallback(
    async (id: number, pokemon: Partial<PokemonFormData>) => {
      try {
        setLoading(true);
        const updatedPokemon = await pokemonApi.update(id, pokemon);
        setPokemons((currentPokemons) =>
          currentPokemons.map((p) => (p.id === id ? updatedPokemon : p))
        );
        toast.success("Pokemon updated successfully!");

        await fetchPokemons();

        return updatedPokemon;
      } catch (err) {
        setError("Failed to update Pokemon");
        toast.error("Failed to update Pokemon");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPokemons]
  );

  const deletePokemon = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await pokemonApi.delete(id);
        setPokemons((currentPokemons) =>
          currentPokemons.filter((p) => p.id !== id)
        );
        toast.success("Pokemon deleted successfully!");

        await fetchPokemons();
      } catch (err) {
        setError("Failed to delete Pokemon");
        toast.error("Failed to delete Pokemon");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPokemons]
  );

  const value = {
    pokemons,
    loading,
    error,
    fetchPokemons,
    getPokemon,
    addPokemon,
    updatePokemon,
    deletePokemon,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};

export const usePokemon = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
};
