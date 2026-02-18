// This file is used to handle all authentication-related API routes using
// better-auth. The [...all] in the filename allows better-auth to handle
// multiple routes (e.g., /api/auth/login, /api/auth/logout, etc.).
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
