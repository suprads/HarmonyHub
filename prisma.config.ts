import "@dotenvx/dotenvx/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "lib/prisma/schema.prisma",
  migrations: {
    path: "lib/prisma/migrations",
    // seed: "node lib/prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
