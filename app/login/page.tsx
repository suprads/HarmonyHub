import { LoginForm } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import { getSession } from "@/services/auth/server";
import LogoutButton from "./logout-button";

export default async function LoginPage() {
  const session = await getSession();
  // if (session) redirect("/profile");

  return (
    <div className="font-sans flex items-center justify-items-center sm:p-20">
      <main className="flex flex-col items-center justify-items-center w-full">
        {session ? (
          <>
            <p>{`Logged in as ${session.user.email}`}</p>
            <LogoutButton />
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
  prevState: { message?: string; success: boolean },
  formData: FormData,
) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.error(error.message);
      return { message: error.message, success: false };
    }
  }
  return { success: true };
}
