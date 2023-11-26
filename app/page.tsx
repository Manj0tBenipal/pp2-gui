"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Genre, Movie } from "./types/Movie";
export default function Home() {
  const [moviesData, setMoviesData] = useState([]);
  useEffect(() => {
    async function getAllMovies() {
      const res = await fetch("/api/movies", {
        next: {
          revalidate: 0,
        },
      });
      const data = await res.json();
      setMoviesData(data);
    }
    getAllMovies();
  }, []);
  const rows = moviesData.map((movie: Movie) => {
    let genres: string = "";
    for (let i = 0; i < movie.genre.length; i++) {
      if (i < movie.genre.length - 1) {
        genres += movie.genre[i].genreName + ", ";
      } else {
        genres += movie.genre[i].genreName;
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
      <div>
        <h2>Perform Update, Delete and Create Operations</h2>
      </div>
    </main>
  );
}
