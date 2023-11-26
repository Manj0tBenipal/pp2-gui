export interface Movie {
  id: number;
  title: string;
  characters: Character[];
  country: Country;
  genre: Genre[];
  rating: number;
}

export interface Genre {
  genreId: number;
  genreName: string;
}
export interface Country {
  countryId: number;
  countryName: string;
}

export interface Character {
  characterId: number;
  actorName: string;
  characterName: string;
}
