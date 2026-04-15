"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

export async function updateBrew(
  id: string,
  formData: FormData,
): Promise<void> {
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
    UPDATE brews
    SET
      bean_name = ${beanName},
      grams = ${Number.parseFloat(dose)},
      brew_time = ${brewTimeSeconds},
      grind_setting = ${Number.parseInt(grindSetting, 10)},
      comments = ${comments || null}
    WHERE id = ${id}
  `;

  revalidatePath("/");
}

export async function deleteBrew(id: string): Promise<void> {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }

  const sql = neon(process.env.POSTGRES_URL);
  await sql`DELETE FROM brews WHERE id = ${id}`;

  revalidatePath("/");
}

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
