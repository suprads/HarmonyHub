import styles from "./page.module.css";
import LoginForm from "./login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className={styles.page}>
      <main>
        <header>
          <h1>Login</h1>
        </header>
        {session ? (
          <>
            <p>{`Logged in as ${session.user.email}`}</p>
            <Link href="/logout">
              <button>Logout</button>
            </Link>
          </>
        ) : (
          <>
            <LoginForm loginAction={login} />
            <p>
              Need to <Link href="/sign-up">sign up</Link>?
            </p>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * @returns An error message if an error occurred.
 */
async function login(prevState: unknown, formData: FormData) {
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
      const { message } = error;
      return { message };
    }
  }

  // Refreshes page to display log in info.
  if (signInSuccess) redirect("/login");
}
