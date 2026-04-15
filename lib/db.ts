import { neon } from "@neondatabase/serverless";

export type Brew = {
  id: string;
  bean_name: string;
  grams: number;
  brew_time: number;
  grind_setting: number;
  comments: string | null;
  created_at: string;
};

export async function getBrews(): Promise<Brew[]> {
  if (!process.env.POSTGRES_URL) {
    return [];
  }
  const sql = neon(process.env.POSTGRES_URL);
  const rows = await sql`
    SELECT id, bean_name, grams, brew_time, grind_setting, comments, created_at
    FROM brews
    ORDER BY created_at DESC
  `;
  return rows as Brew[];
}
