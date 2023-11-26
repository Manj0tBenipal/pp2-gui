"use client";
import styles from "@/components/newmovie.module.css";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Character,
  Country,
  Genre,
  GenresMovie,
  Movie,
} from "@/app/types/Movie";
import { useState, MouseEvent, SyntheticEvent } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
  const [genresError, setGenresError] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countryError, setCountryError] = useState<boolean>(false);
  const [selectedCharacters, setSelectedCharacter] = useState<string[]>([]);
  const [charactersError, setCharactersError] = useState<boolean>(false);
  const [rating, setRating] = useState<string>("");
  const [ratingError, setRatingError] = useState({
    range: false,
    numeric: false,
  });
  const [date, setDate] = useState<any>(dayjs(Date.now()));
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<boolean>(false);
  function validateTitle(title: string) {
    return title.length === 0;
  }
  function validateRating(rating: string) {
    const numericRegex = /^[0-9]+$/;
    try {
      if (!numericRegex.test(rating)) {
        throw new Error("Input must contain only numeric characters");
      } else {
        setRatingError((prev) => {
          return { ...prev, numeric: false };
        });
      }
    } catch (e) {
      setRatingError((prev) => {
        return { ...prev, numeric: true };
      });
    }
    const ratingNum: number = parseInt(rating);
    if (ratingNum < 0 || ratingNum > 10) {
      setRatingError((prev) => {
        return { ...prev, range: true };
      });
    } else {
      setRatingError((prev) => {
        return { ...prev, range: false };
      });
    }
  }
  function handleFormSubmission(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    validateFormData();
  }
  function validateFormData() {
    if (title.length === 0) {
      setTitleError(true);
      return;
    }
    validateRating(rating);
    if (selectedGenres.length === 0) {
      setGenresError(true);
      return;
    }
    if (selectedCountry.length === 0) {
      setCountryError(true);
      return;
    }
    if (selectedCharacters.length === 0) {
      setCharactersError(true);
      return;
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`${styles.wrapper}`}>
        <div className={`${styles.container}`}>
          <form className={`${styles.form} flex flex-evenly`}>
            <FormControl fullWidth>
              <TextField
                id="title"
                label="Title"
                variant="outlined"
                helperText={titleError ? "Name cannot be empty" : null}
                onChange={(e) => {
                  setTitle(e.target.value);

                  setTitleError(() => validateTitle(e.target.value));
                }}
                error={titleError}
                value={title}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                label="Rating"
                variant="outlined"
                helperText={
                  ratingError.numeric || ratingError.range
                    ? "Range: 1-10, Only Number"
                    : null
                }
                onChange={(e) => {
                  setRating(e.target.value);

                  validateRating(e.target.value);
                }}
                error={ratingError.numeric || ratingError.range}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="genre">Genre</InputLabel>
              <Select
                labelId="genre"
                id="genreSelect"
                label="Genre"
                multiple
                error={genresError}
                onChange={(e: SelectChangeEvent<typeof selectedGenres>) =>
                  setSelectedGenres(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                renderValue={(selectedGenres) => {
                  let string = "";
                  const g: any = selectedGenres.map((id: number | string) => {
                    const formattedId: number =
                      typeof id === "string" ? parseInt(id) : id;
                    return genres.find(
                      (el: Genre) => el.genreId === formattedId
                    );
                  });
                  g.map((el: Genre) => {
                    string += el.genreName + ",";
                  });
                  return string;
                }}
                value={selectedGenres}
              >
                {genres.map((genre: Genre) => {
                  return (
                    <MenuItem key={genre.genreId} value={genre.genreId}>
                      <Checkbox
                        checked={
                          selectedGenres.findIndex(
                            (g: string) => genre.genreId === parseInt(g)
                          ) > -1
                        }
                      />
                      <ListItemText primary={genre.genreName} />
                      {genre.genreName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="countryLabel">Country</InputLabel>
              <Select
                error={countryError}
                labelId="counrtyLabel"
                id="countrySelect"
                label="Country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {countries.map((country: Country) => {
                  return (
                    <MenuItem key={country.countryId} value={country.countryId}>
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
                error={charactersError}
                onChange={(e: SelectChangeEvent<typeof selectedCharacters>) =>
                  setSelectedCharacter(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                renderValue={(selectedCharacters) => {
                  let string = "";
                  const c: any = selectedCharacters.map(
                    (id: number | string) => {
                      const formattedId: number =
                        typeof id === "string" ? parseInt(id) : id;
                      return characters.find(
                        (el: Character) => el.characterId === formattedId
                      );
                    }
                  );
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

            <FormControl fullWidth>
              <DatePicker
                value={date}
                onChange={(date: any) => {
                  const dateObj: Date = date.toDate();
                  setDate(dateObj);
                }}
              />
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              onClick={(e: MouseEvent<HTMLButtonElement>) =>
                handleFormSubmission(e)
              }
            >
              Add Movie
            </Button>
            <Button variant="outlined" onClick={() => setVisibility(false)}>
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}
