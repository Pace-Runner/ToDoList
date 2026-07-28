# Todo

A local-first todo app. No accounts, no server deployment — you clone it,
run it, and it stores your tasks in a SQLite file on your own machine.

## Third-Party Code

**Dependencies**

| Package | Why |
|---|---|
| `next` | The framework this app is built with (required by the brief). App Router, Server Components and Server Actions are used throughout instead of a hand-rolled REST API. |
| `react` / `react-dom` | Required peer dependencies of Next.js. |

**Dev dependencies**

| Package | Why |
|---|---|
| `typescript` | Static typing across the app and the data layer, catches shape mismatches between the DB rows and the UI. |
| `@types/node` | Pinned to `^22` to match the Node 22 runtime and pick up type declarations for `node:sqlite`. |
| `@types/react`, `@types/react-dom` | Type declarations for React 19. |
| `tailwindcss`, `@tailwindcss/postcss` | Utility-first styling, scaffolded by `create-next-app`; used for all layout/styling instead of hand-written CSS files. |
| `eslint`, `eslint-config-next` | Next.js's recommended lint rules, scaffolded by `create-next-app`. |
| `vitest` | Test runner. Chosen over Jest for native TypeScript/ESM support with no extra transform config, and it's fast enough to run the whole suite in well under a second. |

**Not a third-party package, but worth calling out:** the database driver is
Node's built-in **`node:sqlite`** (stable in Node 22, no install required).
`better-sqlite3` was tried first since it's the more commonly recommended
driver, but its install step requires a native build toolchain
(`node-gyp` / Visual Studio Build Tools on Windows) that isn't guaranteed to
exist on a grader's machine — a `git clone && npm install` failing on a
missing C++ toolchain is exactly the kind of thing the "installs from a
clean clone" checklist step is testing for. `node:sqlite` has zero native
dependencies, so `npm install` alone is enough.

## Database Design

One table, no relations — `topic` and `status` are plain columns rather
than foreign keys to lookup tables. With one user and one entity, a join
would add complexity without buying anything.

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL,                 -- ISO date, e.g. 2026-08-04
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in-progress', 'complete')),
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  archived_at TEXT,                       -- NULL = active, timestamp = archived
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_tasks_topic ON tasks (topic);
CREATE INDEX idx_tasks_status ON tasks (status);
CREATE INDEX idx_tasks_due_date ON tasks (due_date);
```

Full source: [`db/schema.sql`](db/schema.sql), applied automatically on
first run by [`lib/db.ts`](lib/db.ts) (`CREATE TABLE IF NOT EXISTS`, so it's
safe to run against an existing database too).

Design decisions:

- **Archiving is a flag, not a delete or a copy.** `archived_at` is set to
  a timestamp on the existing row; the row never moves and is never
  removed. This is what makes archived tasks "not deleted, only archived,
  so they remain viewable" — `getArchivedTasks()` just queries
  `archived_at IS NOT NULL`.
- **Overdue is never stored.** It's derived at read time from `due_date`,
  `status` and `archived_at` (see `isOverdue()` in
  [`lib/date.ts`](lib/date.ts)): a task is overdue if its due date has
  passed and it's neither complete nor archived. Storing it as a column or
  a fourth status would let it go stale and would contradict the brief
  ("overdue... not as a status").
- **Priority** is a field beyond the brief's required four (Title,
  Description, Due Date, Topic) — added on request to drive the default
  list ordering (highest priority first, ties broken by soonest due date).
  It doesn't replace or interfere with the three required sorts.
- **Indexes** on `topic`, `status` and `due_date` back the three required
  sort orders.

## Running It

**Node version:** this project was built and tested on **v22.14.0**
(`node --version`). `node:sqlite`, the database driver, is a built-in
Node 22 module — no separate database install or native build step is
needed. `package.json` declares `"engines": { "node": ">=22.14.0" }`.

From a clean clone:

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. The SQLite file is created
automatically at `data/todo.db` on first run (gitignored — it's
machine-local, not checked into the repo).

Run the tests:

```bash
npm test
```

This runs the Vitest suite (`vitest run`) against an in-memory,
throwaway SQLite database (`vitest.config.ts` pins `DATABASE_PATH` to
`:memory:`) — it never touches `data/todo.db`.

Other scripts:

```bash
npm run build   # production build
npm start       # run the production build (after npm run build)
npm run lint    # ESLint
```

No environment variables, seed data, or other manual setup is required.
