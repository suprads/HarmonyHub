import { LoginForm } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="font-sans flex items-center justify-items-center sm:p-20">
      <main className="flex flex-col items-center justify-items-center w-full">
        {session ? (
          <>
            <p>{`Logged in as ${session.user.email}`}</p>
            <Link href="/logout">
              <Button>Logout</Button>
            </Link>
          </>
        ) : (
          <>
            <div className="w-full max-w-sm">
              <LoginForm loginAction={login} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * @returns An error message if an error occurred.
 */
async function login(
  prevState: { message: string } | undefined,
  formData: FormData,
) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let signInSuccess = false;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
    signInSuccess = true;
  } catch (error) {
    if (error instanceof APIError) {
      console.error(error.message);
      return { message: error.message };
    }
  }

  // Refreshes page to display log in info.
  if (signInSuccess) redirect("/login");
}

const spotifySignIn = async () => {
  await authClient.signIn.social({
    provider: "spotify",
  });
};
