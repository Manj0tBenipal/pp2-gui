import mysql from "mysql2/promise";

import { Character, Country, Genre, Movie } from "@/app/types/Movie";
export const dynamic = "force-dynamic";
export async function GET() {
  const dbConnection = await mysql.createConnection({
    host: "139.177.193.166",
    user: "pp2",
    password: "moviesDatabase@123",
    database: "movies_database",
  });
  try {
    const [movies]: any = await dbConnection.execute("select * from movie", []);
    const [genre]: any = await dbConnection.execute("select * from genre", []);
    const [genreMovie]: any = await dbConnection.execute(
      "select * from genre_movie",
      []
    );
    const [countries]: any = await dbConnection.execute(
      "select * from country",
      []
    );
    const [characters]: any = await dbConnection.execute(
      "select * from characters",
      []
    );

    const result = await movies?.map((el: any) => {
      const genres: Genre[] = [];
      const chars: Character[] = [];
      genreMovie.map((gm: any) => {
        if (el.movie_id === gm.movie_id) {
          genre.map((g: any) => {
            if (g.genre_id === gm.genre_id) {
              genres.push({
                genreId: g.genre_id,
                genreName: g.genre_name,
              } as Genre);
            }
          });
        }
      });
      characters.map((c: any) => {
        if (c.movie_id === el.movie_id) {
          chars.push({
            characterId: c.character_id,
            characterName: c.character_name,
            actorName: c.actor_name,
          } as Character);
        }
      });
      const country: Country = countries.filter((c: any) => {
        if (c.country_id === el.country_id) {
          return {
            countryId: c.country_id,
            countryName: c.country_name,
          } as Country;
        }
      });
      const movie: Movie = {
        id: el.movie_id,
        title: el.movie_name,
        rating: el.rating,
        country: country,
        genre: genres,
        characters: chars,
      };
      return movie;
    });

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  } finally {
    dbConnection.end();
  }
}
