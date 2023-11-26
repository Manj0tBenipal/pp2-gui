"use client";
import styles from "@/components/newmovie.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Character,
  Country,
  Genre,
  GenresMovie,
  Movie,
} from "@/app/types/Movie";

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
        <FormControl>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Genre"
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
