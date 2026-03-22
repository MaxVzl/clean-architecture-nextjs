import { promises as fs } from "fs";
import path from "path";

const DATABASE_DIR = path.join(
  process.cwd(),
  "src/core/infrastructure/database",
);

export async function readJsonArray<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATABASE_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }
  const parsed = JSON.parse(trimmed) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${filename} : le JSON doit être un tableau.`);
  }
  return parsed as T[];
}

export async function writeJsonArray(
  filename: string,
  data: unknown[],
): Promise<void> {
  const filePath = path.join(DATABASE_DIR, filename);
  const text = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, text, "utf-8");
}
