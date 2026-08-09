# SubTracker Setup & Testing Guide

## 1. Prerequisites

- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/).
- **Node.js** & **pnpm**: Ensure you have Node 18+ and pnpm installed.

Verify Docker is running:

```bash
docker --version
```

---

## 2. Start PostgreSQL Database

From the **project root** (`/Users/Ashi/Desktop/SubTracker`):

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container named `sub_tracker_db` on port **5432**.

---

## 3. Install Dependencies

```bash
pnpm install
```

---

## 4. Reset & Seed the Database

**⚠️ IMPORTANT:** We recently migrated all IDs to auto-incrementing sequential integers starting at `100100101`. To apply this safely, run the following:

```bash
# 1. Create a migration without applying it
npx prisma migrate dev --create-only --name init_seq --schema packages/db/prisma/schema.prisma

# 2. Append the sequence modification script to the bottom of the newly generated migration file
# Find the new folder inside packages/db/prisma/migrations/ and add this to the bottom of migration.sql:
# ALTER SEQUENCE "users_id_seq" RESTART WITH 100100101;
# ALTER SEQUENCE "roles_id_seq" RESTART WITH 100100101;
# ALTER SEQUENCE "subscriptions_id_seq" RESTART WITH 100100101;
# ALTER SEQUENCE "schedules_id_seq" RESTART WITH 100100101;
# ALTER SEQUENCE "channels_id_seq" RESTART WITH 100100101;

# 3. Apply the migration and reset the DB
npx prisma migrate dev --schema packages/db/prisma/schema.prisma

# 4. Generate the Prisma Client
pnpm --filter @sub-tracker/db run db:generate

# 5. Seed the Database
pnpm --filter @sub-tracker/db run db:seed
```

---

## 5. Start the API Server

```bash
pnpm dev
```

You should see:

```
🚀 API server running on http://localhost:4000
```

---

## 6. Testing with Postman

1. Open Postman.
2. Click **Import** and select the `SubTracker_Postman_Collection.json` file in the root directory.
3. Check the terminal where you ran `db:seed`. It outputted a command to generate a JWT.
4. Run that command in a new terminal in the project root:
   ```bash
   pnpm --filter @sub-tracker/api exec node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({ userId: 100100101, roleId: 100100101 }, 'super-secret-jwt-key-sub-tracker', { expiresIn: '24h' }))"
   ```
5. Copy the output.
6. Open the **SubTracker API** Postman collection, click the **Variables** tab, and paste the token into the `token` variable's "Current Value".
7. Make sure to click **Save** (Cmd/Ctrl + S).

You can now easily test all API endpoints!

---

## 7. Viewing the Database

To view and edit your database visually right in your browser, you can use Prisma Studio.

Run this command in a new terminal window:

```bash
pnpm --filter @sub-tracker/db run db:studio
```

This will start a local server and open your default web browser to `http://localhost:5555`. From there, you can interact with all your database tables visually!

---

## Useful Commands Reference

| Command                                       | Description                            |
| --------------------------------------------- | -------------------------------------- |
| `docker compose up -d`                        | Start PostgreSQL                       |
| `docker compose down`                         | Stop PostgreSQL                        |
| `pnpm --filter @sub-tracker/db run db:studio` | Open visual DB browser (Prisma Studio) |
| `pnpm dev`                                    | Start the dev server                   |
