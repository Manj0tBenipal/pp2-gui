"use client";
import styles from "@/components/newmovie.module.css";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Character,
  Country,
  Genre,
  GenresMovie,
  Movie,
} from "@/app/types/Movie";
import { useState } from "react";

export default function AddNewMovie({
  setVisibility,
  genres,
  countries,
  characters,
  movies,
  genresMovie,
  setMovies,
  setGenresMovie,
}: {
  setVisibility: Function;
  genres: Genre[];
  countries: Country[];
  characters: Character[];
  genresMovie: GenresMovie[];
  movies: Movie[];
  setMovies: Function;
  setGenresMovie: Function;
}) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedCharacters, setSelectedCharacter] = useState<string[]>([]);
  console.log(selectedCharacters);
  return (
    <div className={`${styles.wrapper}`}>
      <div className={`${styles.container}`}>
        <CancelIcon
          onClick={() => setVisibility(false)}
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            cursor: "pointer",
          }}
        />
        <form className={`${styles.form} flex flex-even`}>
          <FormControl fullWidth>
            <InputLabel id="genre">Genre</InputLabel>
            <Select labelId="genre" id="genreSelect" label="Genre">
              {genres.map((genre: Genre) => {
                return (
                  <MenuItem value={genre.genreId}>{genre.genreName}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="countryLabel">Country</InputLabel>
            <Select labelId="counrtyLabel" id="countrySelect" label="Country">
              {countries.map((country: Country) => {
                return (
                  <MenuItem value={country.countryId}>
                    {country.countryName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="characterLabel">Characters</InputLabel>
            <Select
              labelId="characterLabel"
              id="characterSelect"
              label="Character"
              multiple
              onChange={(e: SelectChangeEvent<typeof selectedCharacters>) =>
                setSelectedCharacter(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value
                )
              }
              renderValue={(selectedCharacters) => {
                let string = "";
                const c: any = selectedCharacters.map((id: number | string) => {
                  const formattedId: number =
                    typeof id === "string" ? parseInt(id) : id;
                  return characters.find(
                    (el: Character) => el.characterId === formattedId
                  );
                });
                c.map((el: Character) => {
                  string += el.characterName + "(" + el.actorName + ") ,";
                });
                return string;
              }}
              value={selectedCharacters}
            >
              {characters.map((character: Character) => {
                return (
                  <MenuItem
                    key={character.characterId}
                    value={character.characterId}
                  >
                    <Checkbox
                      checked={
                        selectedCharacters.findIndex(
                          (c: string) => character.characterId === parseInt(c)
                        ) > -1
                      }
                    />
                    <ListItemText
                      primary={
                        character.characterName +
                        "(" +
                        character.actorName +
                        ")"
                      }
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </form>
      </div>
    </div>
  );
}
