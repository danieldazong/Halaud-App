import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("aloud.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS preferences (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

export function getPreference(key: string): string | null {
  const row = db.getFirstSync<{ value: string }>(
    "SELECT value FROM preferences WHERE key = ?",
    [key],
  );
  return row?.value ?? null;
}

export function setPreference(key: string, value: string): void {
  db.runSync(
    "INSERT INTO preferences (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, value],
  );
}

export function deletePreference(key: string): void {
  db.runSync("DELETE FROM preferences WHERE key = ?", [key]);
}

export function clearAllPreferences(): void {
  db.runSync("DELETE FROM preferences");
}
