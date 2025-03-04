export interface Pokemon {
  id: number;
  name: string;
  types: string[] | string;
  height: number;
  weight: number;
  abilities: string[] | string;
  imageUrl: string;
  pokeApiId: number;
}

export interface PokemonFormData {
  name: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}
