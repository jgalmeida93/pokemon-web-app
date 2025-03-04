import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { DeleteConfirmationModal } from "../Modal/DeleteConfirmation";
import { PokemonProvider } from "@/context/PokemonContext";
import { pokemonApi } from "@/app/services/api";
import React from "react";

const mockDeletePokemon = jest.fn();

jest.mock("../../app/services/api", () => ({
  pokemonApi: {
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("../../context/PokemonContext.tsx", () => {
  const mockFetchPokemons = jest.fn().mockResolvedValue([]);
  return {
    usePokemon: () => ({
      pokemons: [],
      loading: false,
      error: null,
      fetchPokemons: mockFetchPokemons,
      getPokemon: jest.fn().mockResolvedValue({}),
      addPokemon: jest.fn().mockResolvedValue({}),
      updatePokemon: jest.fn().mockResolvedValue({}),
    }),
    PokemonProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  types: "grass",
  height: 1,
  weight: 100,
  abilities: "bite",
  imageUrl:
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  pokeApiId: 2,
};

describe("DeleteConfirmationModal", () => {
  it("renders modal with pokemon information", () => {
    render(
      <PokemonProvider>
        <DeleteConfirmationModal
          pokemon={mockPokemon}
          onPokemonDeleted={jest.fn()}
          trigger={<button>Delete Pokemon</button>}
        />
      </PokemonProvider>
    );

    fireEvent.click(screen.getByText("Delete Pokemon"));

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });
  it("calls deletePokemon and onPokemonDeleted when confirmed", async () => {
    const mockOnDeleted = jest.fn();
    mockDeletePokemon.mockResolvedValueOnce(undefined);

    render(
      <PokemonProvider>
        <DeleteConfirmationModal
          pokemon={mockPokemon}
          onPokemonDeleted={mockOnDeleted}
          trigger={<button>Delete Pokemon</button>}
        />
      </PokemonProvider>
    );

    fireEvent.click(screen.getByText("Delete Pokemon"));

    fireEvent.click(screen.getByRole("button", { name: /Delete Pokemon/i }));

    await waitFor(() => {
      expect(pokemonApi.delete).toHaveBeenCalledWith(mockPokemon.id);
      expect(mockOnDeleted).toHaveBeenCalled();
    });
  });
});
