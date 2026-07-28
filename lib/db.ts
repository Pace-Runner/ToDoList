import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "todo.db");

function createConnection(): DatabaseSync {
  const dbPath = process.env.DATABASE_PATH ?? DEFAULT_DB_PATH;

  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const connection = new DatabaseSync(dbPath);

  // Next's build step collects page data across several worker processes
  // that each open this same file concurrently. WAL mode lets readers and
  // a writer coexist, and busy_timeout makes a competing writer wait for
  // the lock instead of failing immediately with SQLITE_BUSY.
  connection.exec("PRAGMA journal_mode = WAL;");
  connection.exec("PRAGMA busy_timeout = 5000;");

  const schema = fs.readFileSync(
    path.join(process.cwd(), "db", "schema.sql"),
    "utf-8",
  );
  connection.exec(schema);
  return connection;
}

const db = createConnection();

export default db;
