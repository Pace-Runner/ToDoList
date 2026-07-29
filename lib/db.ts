import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "todo.db");
const BUSY_TIMEOUT_IN_MILLISECONDS = 5000;

/**
 * Enables WAL journaling and a busy timeout on a freshly opened
 * connection. Next's build step collects page data across several
 * worker processes that each open this same database file concurrently;
 * WAL lets readers and a writer coexist, and the busy timeout makes a
 * competing writer wait for the lock instead of failing immediately
 * with SQLITE_BUSY.
 *
 * @param connection - the just-opened database connection to configure.
 */
function configureConcurrency(connection: DatabaseSync): void {
  // busy_timeout must be set first: switching journal mode itself needs a
  // brief exclusive lock, and without a timeout already in effect, a
  // competing process mid-switch fails that statement immediately instead
  // of waiting for it.
  connection.exec(`PRAGMA busy_timeout = ${BUSY_TIMEOUT_IN_MILLISECONDS};`);
  connection.exec("PRAGMA journal_mode = WAL;");
}

/**
 * Opens the SQLite database at DATABASE_PATH (or data/todo.db by
 * default), creating its containing folder and applying the schema if
 * needed, and returns the connection. Pass DATABASE_PATH=":memory:" for
 * a throwaway, in-memory database — used by the test suite so tests
 * never touch the real data file.
 *
 * @returns an open, schema-applied database connection.
 */
function createConnection(): DatabaseSync {
  const dbPath = process.env.DATABASE_PATH ?? DEFAULT_DB_PATH;

  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const connection = new DatabaseSync(dbPath);
  configureConcurrency(connection);

  const schema = fs.readFileSync(
    path.join(process.cwd(), "db", "schema.sql"),
    "utf-8",
  );
  connection.exec(schema);
  return connection;
}

const db = createConnection();

export default db;
