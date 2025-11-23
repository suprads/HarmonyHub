// Import this file to load environment variables outside of the Next.js
// runtime.
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);
