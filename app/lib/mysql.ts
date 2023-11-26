import mysql from "mysql2/promise";

export async function query(query: string, values: any) {
  const dbConnection = await mysql.createConnection({
    host: "139.177.193.166",
    user: "pp2",
    password: "moviesDatabase@123",
    database: "movies_database",
  });
  try {
    const [result]: any = await dbConnection.execute(query, values);
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  } finally {
    dbConnection.end();
  }
}
