export interface Movie {
  id: number;
  title: string;
  country: Country;
  rating: number;
  releaseDate: Date;
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
  movieId: number;
  actorName: string;
  characterName: string;
}
export interface GenresMovie {
  movieId: number;
  genreId: number;
}

export interface MainTableRow {
  id: number;
  title: string;
  country: Country;
  rating: number;
  releaseDate: Date;
  genres: Genre[];
  characters: Character[];
}
