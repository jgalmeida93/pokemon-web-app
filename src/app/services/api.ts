import { ApiResponse, Pokemon, PokemonFormData } from "@/types/pokemon";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

export const pokemonApi = {
  getAll: async (): Promise<Pokemon[]> => {
    const response = await api.get<ApiResponse<Pokemon[]>>("/api/pokemon");
    return response.data.data;
  },

  getById: async (id: number): Promise<Pokemon> => {
    const response = await api.get<ApiResponse<Pokemon>>(`/api/pokemon/${id}`);
    return response.data.data;
  },

  create: async (pokemon: PokemonFormData): Promise<Pokemon> => {
    const response = await api.post<ApiResponse<Pokemon>>(
      "/api/pokemon",
      pokemon
    );
    return response.data.data;
  },

  update: async (
    id: number,
    pokemon: Partial<PokemonFormData>
  ): Promise<Pokemon> => {
    const response = await api.put<ApiResponse<Pokemon>>(
      `/api/pokemon/${id}`,
      pokemon
    );
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/pokemon/${id}`);
  },
};

export const pokemonApiMock =
  typeof jest !== "undefined"
    ? {
        getAll: jest.fn().mockResolvedValue([]),
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }
    : {
        getAll: async () => [],
        getById: async () => ({}),
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => {},
      };
