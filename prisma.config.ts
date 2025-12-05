import "./envConfig";
import { defineConfig } from "prisma/config";
import { env } from "process";

export default defineConfig({
  schema: "lib/prisma/schema.prisma",
  migrations: {
    path: "lib/prisma/migrations",
    seed: "tsx lib/prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL ?? "",
  },
});
