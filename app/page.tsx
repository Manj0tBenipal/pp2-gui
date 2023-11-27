"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

export default function Home() {
  const [dataChanged, setDataChanged] = useState<number>(0);
  const [tableData, setTableData] = useState<MainTableRow[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresMovie, setGenresMovie] = useState<GenresMovie[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [addNewIsVisible, setAddNewIsVisible] = useState(false);
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
        <div className="flex flex-column flex-even">
          <h2>Perform Update, Delete and Create Operations</h2>

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
