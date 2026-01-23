// Import this file to load environment variables outside of the Next.js
// runtime.
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const projectDir = process.cwd();
loadEnvConfig(projectDir);
