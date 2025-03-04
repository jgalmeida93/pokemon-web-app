import axios from "axios";
import { ApiResponse, Pokemon, PokemonFormData } from "@/types/pokemon";

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
