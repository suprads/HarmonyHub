import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Sign out the current user if they are signed in.
  if (session) {
    const result = await auth.api.signOut({
      headers: await headers(),
    });
    console.log("Logged out successfully? ", result.success);
  }

  redirect("/login");
}
