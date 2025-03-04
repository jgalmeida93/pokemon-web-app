import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddPokemonModal } from "../Modal/AddNewPokemon";
import { pokemonApi } from "@/app/services/api";

import { toast } from "sonner";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

jest.mock("../../app/services/api.ts", () => ({
  pokemonApi: {
    getAll: jest.fn().mockResolvedValue([]),
    getById: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../context/PokemonContext.tsx", () => ({
  usePokemon: jest.fn(() => ({
    fetchPokemons: jest.fn().mockResolvedValue([]),
  })),
  PokemonProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockPokemon = {
  id: 30,
  name: "vulpix",
  types: "ground",
  abilities: "static,lightning-rod",
  height: 4,
  weight: 60,
  imageUrl: "https://example.com/pikachu.png",
  pokeApiId: 37,
};

describe("AddPokemonModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with add pokemon form", () => {
    render(<AddPokemonModal onPokemonAdded={jest.fn()} />);

    fireEvent.click(screen.getByTestId("addpokemon"));

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(
      screen.getByText(/I dont remember all the Pokemon information/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Pokemon/i })
    ).toBeInTheDocument();
  });

  it("submits form with full pokemon data when all fields are filled", async () => {
    const mockOnPokemonAdded = jest.fn();
    (pokemonApi.create as jest.Mock).mockResolvedValueOnce(mockPokemon);

    render(<AddPokemonModal onPokemonAdded={mockOnPokemonAdded} />);

    fireEvent.click(screen.getByTestId("addpokemon"));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Sandshrew" },
    });
    fireEvent.change(screen.getByLabelText(/Types/i), {
      target: { value: "ground" },
    });
    fireEvent.change(screen.getByLabelText(/Abilities/i), {
      target: { value: "static,lightning-rod" },
    });
    fireEvent.change(screen.getByLabelText(/Height/i), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText(/Weight/i), {
      target: { value: "60" },
    });
    fireEvent.change(screen.getByLabelText(/Image URL/i), {
      target: { value: "https://example.com/pikachu.png" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Pokemon/i }));

    await waitFor(() => {
      expect(pokemonApi.create).toHaveBeenCalledWith({
        name: "Sandshrew",
        types: "ground",
        abilities: "static,lightning-rod",
        height: 4,
        weight: 60,
        imageUrl: "https://example.com/pikachu.png",
      });
      expect(mockOnPokemonAdded).toHaveBeenCalledWith(mockPokemon);
      expect(toast.success).toHaveBeenCalledWith(
        "Sandshrew added successfully!"
      );
    });
  });

  it("submits form with only name when usePokeApi is checked", async () => {
    const mockOnPokemonAdded = jest.fn();
    (pokemonApi.create as jest.Mock).mockResolvedValueOnce(mockPokemon);

    render(<AddPokemonModal onPokemonAdded={mockOnPokemonAdded} />);

    fireEvent.click(screen.getByText("Add New Pokemon"));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Sandshrew" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    expect(screen.queryByLabelText(/Types/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Add Pokemon/i }));

    await waitFor(() => {
      expect(pokemonApi.create).toHaveBeenCalledWith({
        name: "Sandshrew",
      });
      expect(mockOnPokemonAdded).toHaveBeenCalledWith(mockPokemon);
    });
  });

  it("shows validation error when form is submitted without required fields", async () => {
    render(<AddPokemonModal onPokemonAdded={jest.fn()} />);

    fireEvent.click(screen.getByText("Add New Pokemon"));

    fireEvent.click(screen.getByRole("button", { name: /Add Pokemon/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    expect(pokemonApi.create).not.toHaveBeenCalled();
  });

  it("handles API error when pokemon already exists", async () => {
    const conflictError = new Error("Pokemon already exists");
    Object.defineProperty(conflictError, "status", { value: 409 });
    (pokemonApi.create as jest.Mock).mockRejectedValueOnce(conflictError);

    render(<AddPokemonModal onPokemonAdded={jest.fn()} />);

    fireEvent.click(screen.getByText("Add New Pokemon"));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Sandshrew" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Add Pokemon/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add Pokemon, Pokemon already exists!"
      );
    });
  });

  it("handles API error when pokemon doesn't exist in PokeAPI", async () => {
    const notFoundError = new Error("Pokemon not found");
    Object.defineProperty(notFoundError, "status", { value: 404 });
    (pokemonApi.create as jest.Mock).mockRejectedValueOnce(notFoundError);

    render(<AddPokemonModal onPokemonAdded={jest.fn()} />);

    fireEvent.click(screen.getByText("Add New Pokemon"));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "NonExistentPokemon" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Add Pokemon/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "NonExistentPokemon doesn't exist!"
      );
    });
  });

  it("resets form after successful submission", async () => {
    (pokemonApi.create as jest.Mock).mockResolvedValueOnce(mockPokemon);

    render(<AddPokemonModal onPokemonAdded={jest.fn()} />);

    fireEvent.click(screen.getByText("Add New Pokemon"));

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Sandshrew" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Add Pokemon/i }));

    await waitFor(() => {
      expect(pokemonApi.create).toHaveBeenCalled();
    });
  });
});
