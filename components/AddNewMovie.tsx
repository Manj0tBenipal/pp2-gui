"use client";
import styles from "@/components/newmovie.module.css";
import {
  Button,
  Checkbox,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Character,
  Country,
  Genre,
  GenresMovie,
  Movie,
} from "@/app/types/Movie";
import { useState, MouseEvent, SyntheticEvent, use } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CharacterWithoutId, PostDataMovie } from "@/app/types/PostData";
import { Cancel } from "@mui/icons-material";

export default function AddNewMovie({
  setVisibility,
  genres,
  countries,
  movies,
  genresMovie,
  setMovies,
  setGenresMovie,
  setDataChanged,
}: {
  setVisibility: Function;
  genres: Genre[];
  countries: Country[];
  genresMovie: GenresMovie[];
  movies: Movie[];
  setMovies: Function;
  setGenresMovie: Function;
  setDataChanged: Function;
}) {
  /**
   * Form Fields
   */
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [characters, setCharacters] = useState<CharacterWithoutId[]>([]);
  const [characterName, setCharacterName] = useState<string>("");
  const [actorName, setActorName] = useState<string>("");
  const [rating, setRating] = useState<string>("");

  /**
   * Form Errors
   */
  const [genresError, setGenresError] = useState<boolean>(false);
  const [countryError, setCountryError] = useState<boolean>(false);
  const [charactersError, setCharactersError] = useState({
    actor: false,
    character: false,
  });
  const [ratingError, setRatingError] = useState({
    range: false,
    numeric: false,
  });
  const [titleError, setTitleError] = useState<boolean>(false);
  /**
   * Visibility State
   */
  const [charactersListIsVisible, setCharactersListIsVisible] =
    useState<boolean>(false);

  //Validator functions
  function validateTitle(title: string) {
    return title.length === 0;
  }
  function validateCharacter(actorName: string, characterName: string) {
    if (actorName.length === 0) {
      setCharactersError((prev) => {
        return { ...prev, actor: true };
      });
    } else {
      setCharactersError((prev) => {
        return { ...prev, actor: false };
      });
    }
    if (characterName.length === 0) {
      setCharactersError((prev) => {
        return { ...prev, character: true };
      });
    } else {
      setCharactersError((prev) => {
        return { ...prev, character: false };
      });
    }
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
  function validateFormData() {
    if (title.length === 0) {
      setTitleError(true);
      return false;
    }
    validateRating(rating);
    if (selectedGenres.length === 0) {
      setGenresError(true);
      return false;
    }
    if (selectedCountry.length === 0) {
      setCountryError(true);
      return false;
    }
    if (characters.length === 0) {
      alert("You must add at least one character");
      return false;
    }
    return true;
  }

  //Post data preparation
  function handleFormSubmission(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const dataIsOk: boolean = validateFormData();
    if (dataIsOk) {
      const releaseDate = date.toISOString().split("T")[0];

      const values: PostDataMovie = {
        title: title,
        country: selectedCountry,
        rating: rating,
        releaseDate: releaseDate,
        genres: selectedGenres,
        characters: characters,
      };

      sendData(values);
    }
  }
  //Post request function
  async function sendData(values: any) {
    const res = await fetch("/api/movies", {
      method: "POST",
      body: JSON.stringify(values),
      next: {
        revalidate: 0,
      },
    });
    const data = await res.json();
    if (data) {
      setDataChanged(true);
      setVisibility(false);
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
              <div className="flex flex-column flex-gap-small">
                <div className="flex flex-evenly flex-gap-small">
                  <TextField
                    id="outlined-basic"
                    label="Actor Name"
                    variant="outlined"
                    value={actorName}
                    onChange={(e) => {
                      setActorName(e.target.value);
                      validateCharacter(e.target.value, characterName);
                    }}
                    error={charactersError.actor}
                    helperText={
                      charactersError.actor ? "Cannot be empty" : null
                    }
                  />
                  <TextField
                    id="outlined-basic"
                    label="Character Name"
                    variant="outlined"
                    value={characterName}
                    onChange={(e) => {
                      setCharacterName(e.target.value);
                      validateCharacter(actorName, e.target.value);
                    }}
                    error={charactersError.character}
                    helperText={
                      charactersError.character ? "Cannot be empty" : null
                    }
                  />
                </div>
              </div>
              <div className="flex flex-gap-small flex-even">
                <Button
                  variant="text"
                  onClick={() => {
                    if (charactersError.actor || charactersError.character)
                      return;
                    setCharacters((prev: CharacterWithoutId[]) => {
                      return [
                        ...prev,
                        { characterName: characterName, actorName: actorName },
                      ];
                    });
                    setCharacterName("");
                    setActorName("");
                  }}
                >
                  Add Character
                </Button>
                <Button
                  variant="text"
                  onClick={() => setCharactersListIsVisible(true)}
                >
                  View List
                </Button>
              </div>
            </FormControl>

            <FormControl fullWidth>
              <DatePicker
                value={dayjs(date)}
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
            {charactersListIsVisible && (
              <div className={`${styles.charactersList}`}>
                <Cancel
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    cursor: "pointer  ",
                  }}
                  onClick={() => setCharactersListIsVisible(false)}
                />

                <h2>Characters</h2>
                <List>
                  {characters.map(
                    (character: CharacterWithoutId, index: number) => {
                      return (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                setCharacters(
                                  characters.filter(
                                    (el: CharacterWithoutId, i: number) =>
                                      index !== i
                                  )
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={
                              character.actorName +
                              "(" +
                              character.characterName +
                              ")"
                            }
                          />
                        </ListItem>
                      );
                    }
                  )}
                </List>
              </div>
            )}
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}
