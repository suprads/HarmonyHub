import "client-only";
import { authClient } from "@/lib/auth-client";

export async function getSession() {
  return await authClient.getSession();
}
