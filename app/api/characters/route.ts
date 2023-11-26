import { query } from "@/app/lib/mysql";

export async function GET() {
  const res = await query("select * from characters", []);
  return Response.json(res);
}
