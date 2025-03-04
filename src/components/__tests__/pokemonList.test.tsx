import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PokemonsList from "../../app/pokemons/page";

const mockPokemons = [
  {
    id: 30,
    name: "vulpix",
    types: "ground",
    abilities: "static,lightning-rod",
    height: 4,
    weight: 60,
    imageUrl: "https://example.com/pikachu.png",
    pokeApiId: 37,
  },
  {
    id: 31,
    name: "pikachu",
    types: "ground",
    abilities: "static,lightning-rod",
    height: 4,
    weight: 60,
    imageUrl: "https://example.com/pikachu.png",
    pokeApiId: 1,
  },
];

jest.mock("../../app/services/api", () => ({
  pokemonApi: {
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
}));

const mockFetchPokemons = jest.fn().mockResolvedValue([]);
const mockGetPokemon = jest.fn().mockResolvedValue({});
const mockAddPokemon = jest.fn().mockResolvedValue({});
const mockUpdatePokemon = jest.fn().mockResolvedValue({});

const mockUsePokemon = jest.fn().mockReturnValue({
  pokemons: mockPokemons,
  loading: false,
  error: null,
  fetchPokemons: mockFetchPokemons,
  getPokemon: mockGetPokemon,
  addPokemon: mockAddPokemon,
  updatePokemon: mockUpdatePokemon,
});

jest.mock("../../context/PokemonContext.tsx", () => ({
  usePokemon: () => mockUsePokemon(),
  PokemonProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("PokemonsList", () => {
  it("renders empty list message when no pokemons", () => {
    mockUsePokemon.mockReturnValueOnce({
      pokemons: [],
      loading: false,
      error: null,
      fetchPokemons: mockFetchPokemons,
      getPokemon: mockGetPokemon,
      addPokemon: mockAddPokemon,
      updatePokemon: mockUpdatePokemon,
    });

    render(<PokemonsList />);
    expect(screen.getByTestId("list-not-found")).toBeInTheDocument();
  });

  it("renders pokemon list when pokemons exist", () => {
    render(<PokemonsList />);
    expect(screen.getByText("vulpix")).toBeInTheDocument();
    expect(screen.getByText("pikachu")).toBeInTheDocument();
  });
});
