export interface PostDataMovie {
  characters: CharacterWithoutId[];
  title: string;
  country: string;
  rating: string;
  releaseDate: string;
  genres: string[];
}
export interface CharacterWithoutId {
  actorName: string;
  characterName: string;
}
