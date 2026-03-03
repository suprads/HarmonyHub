import { auth } from "@/lib/auth";
import { verifySession } from "@/services/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  const session = await verifySession();

  const result = await auth.api.signOut({
    headers: await headers(),
  });

  console.log("Logged out successfully? ", result.success);

  redirect("/login");
}
