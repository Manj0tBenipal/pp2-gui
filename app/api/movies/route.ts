import { query } from "@/app/lib/mysql";

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
