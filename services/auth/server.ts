import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * @throws APIError
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function validateSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}
