import { query } from "@/app/lib/mysql";
import { PostDataMovie } from "@/app/types/PostData";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data: any = await query("select * from movie", []);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}
export async function POST(req: Request) {
  let affectedRows = 0;
  try {
    const body: PostDataMovie = await req.json();
    console.log(body);

    const movieRes: any = await query(
      "INSERT INTO movie(movie_name, rating, country, release_date) values(?,?,?,DATE(?));",
      [body.title, body.rating, body.country, body.releaseDate]
    );
    affectedRows += movieRes.affectedRows;
    if (movieRes.affectedRows === 1 && movieRes.insertId) {
      for (let i = 0; i < body.genres.length; i++) {
        const genreMovieRes: any = await query(
          "INSERT INTO genre_movie(movie_id, genre_id) values(?,?);",
          [movieRes.insertId, body.genres[i]]
        );
        affectedRows += genreMovieRes.affectedRows;
      }
      for (let i = 0; i < body.characters.length; i++) {
        const charactersRes: any = await query(
          "INSERT INTO characters(movie_id, actor_name, character_name) values(?, ?, ?);",
          [
            movieRes.insertId,
            body.characters[i].actorName,
            body.characters[i].characterName,
          ]
        );
        affectedRows += charactersRes.affectedRows;
      }
    }
    console.log(affectedRows);
    return Response.json({ affectedRows: affectedRows, body: body });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}
