import { query } from "@/app/lib/mysql";
export const dynamic = "force-dynamic";
export async function GET() {
  const res = await query("select * from genre", []);
  return Response.json(res);
}
