"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  Character,
  Country,
  Genre,
  GenresMovie,
  MainTableRow,
  Movie,
} from "./types/Movie";
import AddNewMovie from "@/components/AddNewMovie";
import { WidthFull } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function Home() {
  /**
   * Data needed for the table
   */
  const [dataChanged, setDataChanged] = useState<number>(0);
  const [tableData, setTableData] = useState<MainTableRow[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresMovie, setGenresMovie] = useState<GenresMovie[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [addNewIsVisible, setAddNewIsVisible] = useState(false);

  /**
   * Data needed for the form
   */
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<any>({
    title: "",
    rating: 0,
    releaseDate: new Date(),
    country: "",
  });
  useEffect(() => {
    async function getAllData() {
      const genresRes = await fetch("/api/genres", {
        next: {
          revalidate: 0,
        },
      })
        .then((res) => res.json())
        .then((data) => data);
      const genres: Genre[] = genresRes.map((genre: any) => {
        const g: Genre = {
          genreId: genre.genre_id,
          genreName: genre.genre_name,
        };
        return g;
      });
      setGenres(() => genres);

      const genresMovieRes = await fetch("/api/genresmovie", {
        next: {
          revalidate: 0,
        },
      })
        .then((res) => res.json())
        .then((data) => data);
      const genresMovie: GenresMovie[] = genresMovieRes.map(
        (genreMovie: any) => {
          const gm = {
            genreId: genreMovie.genre_id,
            movieId: genreMovie.movie_id,
          };
          return gm;
        }
      );
      setGenresMovie(() => genresMovie);
      const countryRes = await fetch("/api/country", {
        next: {
          revalidate: 0,
        },
      })
        .then((res) => res.json())
        .then((data) => data);

      const countries: Country[] = countryRes.map((country: any) => {
        const c: Country = {
          countryId: country.country_id,
          countryName: country.country_name,
        };
        return c;
      });
      setCountries(() => countries);
      const charactersRes = await fetch("/api/characters", {
        next: {
          revalidate: 0,
        },
      })
        .then((res) => res.json())
        .then((data) => data);

      const characters: Character[] = charactersRes.map((character: any) => {
        const c: Character = {
          movieId: character.movie_id,
          characterId: character.character_id,
          characterName: character.character_name,
          actorName: character.actor_name,
        };
        return c;
      });
      setCharacters(() => characters);
      const moviesRes = await fetch("/api/movies", {
        next: {
          revalidate: 0,
        },
      })
        .then((res) => res.json())
        .then((data) => data);

      const movies: Movie[] = moviesRes.map((movie: any) => {
        const date: string[] = movie.release_date.split("-");
        const m: Movie = {
          id: movie.movie_id,
          title: movie.movie_name,
          rating: movie.rating,
          releaseDate: new Date(
            parseInt(date[0]),
            parseInt(date[1]),
            parseInt(date[2])
          ),
          country: movie.country_id,
        };
        return m;
      });
      setMovies(() => movies);
    }

    getAllData();
  }, [dataChanged]);
  useEffect(() => {
    function len(arr: any) {
      return arr?.length > 0;
    }
    if (
      len(genres) &&
      len(movies) &&
      len(genresMovie) &&
      len(countries) &&
      len(characters)
    ) {
      const result: MainTableRow[] | undefined = movies?.map((el: Movie) => {
        const gnr: Genre[] = [];
        const chars: Character[] = [];
        genresMovie.map((gm: GenresMovie) => {
          if (el.id === gm.movieId) {
            genres.map((g: Genre) => {
              if (g.genreId === gm.genreId) {
                gnr.push({
                  genreId: g.genreId,
                  genreName: g.genreName,
                } as Genre);
              }
            });
          }
        });
        characters?.map((c: Character) => {
          if (c.movieId === el.id) {
            chars.push({
              characterId: c.characterId,
              characterName: c.characterName,
              actorName: c.actorName,
            } as Character);
          }
        });
        const country: Country =
          countries?.filter((c: Country) => {
            if (c.countryId === el.id) {
              return {
                countryId: c.countryId,
                countryName: c.countryName,
              } as Country;
            }
          })[0] || ({} as Country);

        const tableRow: MainTableRow = {
          id: el.id,
          title: el.title,
          rating: el.rating,
          country: country,
          genres: gnr,
          characters: chars,
          releaseDate: el.releaseDate,
        };
        return tableRow;
      });
      setTableData(() => result || ([] as MainTableRow[]));
    }
  }, [genres, genresMovie, countries, characters, movies]);
  const rows = tableData.map((movie: MainTableRow) => {
    let genres: string = "";
    for (let i = 0; i < movie.genres.length; i++) {
      if (i < movie.genres.length - 1) {
        genres += movie.genres[i].genreName + ", ";
      } else {
        genres += movie.genres[i].genreName;
      }
    }
    let charcters: string = "";
    for (let i = 0; i < movie.characters.length; i++) {
      if (i < movie.characters.length - 1) {
        charcters +=
          movie.characters[i].characterName +
          `(${movie.characters[i].actorName})` +
          ", ";
      } else {
        charcters +=
          movie.characters[i].characterName +
          `(${movie.characters[i].actorName})`;
      }
    }
    return {
      id: movie.id,
      title: movie.title,
      rating: movie.rating,
      genre: genres,
      characters: charcters,
    };
  });

  return (
    <>
      <main className={styles.main}>
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Rating(Out of 10 )</TableCell>
                  <TableCell>Genres</TableCell>
                  <TableCell>Characters</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.rating}</TableCell>
                    <TableCell>{row.genre}</TableCell>
                    <TableCell>{row.characters}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div
          className="flex  flex-evenly flex-gap-small flex-wrap"
          style={{ alignItems: "flex-start" }}
        >
          <h2 className="min-w-100">
            Perform Update, Delete and Create Operations
          </h2>
          <div className={`${styles.movieUpdateContainer} min-w-100`}>
            <FormControl fullWidth>
              <InputLabel id="movieLabel">Choose A Movie</InputLabel>
              <Select
                labelId="movieLabel"
                id="movieSelect"
                label="Movie"
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
              >
                {movies.map((movie: Movie) => {
                  return (
                    <MenuItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="w-50-pad">
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                label="Movie Title"
                variant="outlined"
                value={movieDetails.title}
                onChange={(e) =>
                  setMovieDetails((prev: any) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="w-50-pad">
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                label="Movie Rating"
                variant="outlined"
                value={movieDetails.rating}
                onChange={(e) =>
                  setMovieDetails((prev: any) => ({
                    ...prev,
                    rating: e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="w-50-pad">
            <FormControl fullWidth>
              <InputLabel id="countryLabel">Country</InputLabel>
              <Select
                labelId="counrtyLabel"
                id="countrySelect"
                label="Country"
                value={movieDetails.country}
                onChange={(e) =>
                  setMovieDetails((prev: any) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
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
          </div>
          <div className="w-50-pad">
            <FormControl fullWidth>
              <DatePicker
                value={dayjs(movieDetails.releaseDate)}
                onChange={(date: any) => {
                  const dateObj: Date = date.toDate();
                  setMovieDetails((prev: any) => ({
                    ...prev,
                    releaseDate: dateObj,
                  }));
                }}
              />
            </FormControl>
          </div>
          <div className="w-50-pad">
            <FormControl fullWidth>
              <Button variant="outlined">Update Movie</Button>
            </FormControl>
          </div>
          <div className="w-50-pad">
            <FormControl fullWidth>
              <Button variant="outlined">Delete Movie</Button>
            </FormControl>
          </div>
          <Button
            variant="contained"
            onClick={() => {
              setAddNewIsVisible(true);
            }}
          >
            Add a Movie
          </Button>
        </div>
      </main>
      {addNewIsVisible && (
        <AddNewMovie
          setVisibility={setAddNewIsVisible}
          genres={genres}
          setMovies={setMovies}
          setDataChanged={setDataChanged}
          countries={countries}
          genresMovie={genresMovie}
          movies={movies}
          setGenresMovie={setGenresMovie}
        />
      )}
    </>
  );
}
