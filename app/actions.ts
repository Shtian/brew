"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function createBrew(formData: FormData): Promise<void> {
  const beanName = formData.get("bean_name") as string;
  const dose = formData.get("dose") as string;
  const brewTimeRaw = formData.get("brew_time") as string;
  const grindSetting = formData.get("grind_setting") as string;
  const comments = formData.get("comments") as string | null;

  // Parse mm:ss into integer seconds
  const parts = brewTimeRaw.split(":");
  const minutes = Number.parseInt(parts[0] ?? "0", 10);
  const seconds = Number.parseInt(parts[1] ?? "0", 10);
  const brewTimeSeconds = minutes * 60 + seconds;

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }

  const sql = neon(process.env.POSTGRES_URL);
  await sql`
    INSERT INTO brews (bean_name, grams, brew_time, grind_setting, comments)
    VALUES (
      ${beanName},
      ${Number.parseFloat(dose)},
      ${brewTimeSeconds},
      ${Number.parseInt(grindSetting, 10)},
      ${comments || null}
    )
  `;

  revalidatePath("/");
}
