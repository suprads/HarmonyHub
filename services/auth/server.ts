import "server-only";
import { auth } from "@/lib/auth";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Get the current user's session server-side.
 * @param context Passthrough to internal Better Auth function if you need to
 * override defaults set by this helper function.
 * @returns The session of the currently logged in user.
 */
export async function getSession(context: { headers?: Headers } = {}) {
  const session = await auth.api.getSession({
    headers: context.headers ? context.headers : await nextHeaders(),
  });

  return session;
}

/**
 * Gets the current session info. If the user doesn't currently have a session,
 * they are redirected to the login page.
 * @returns The session of the currently logged in user.
 */
export async function verifySession() {
  const session = await auth.api.getSession({
    headers: await nextHeaders(),
  });

  if (!session) redirect("/login");

  return session;
}
