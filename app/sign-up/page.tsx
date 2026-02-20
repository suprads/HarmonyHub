import styles from "./page.module.css";
import { auth } from "@/lib/auth";
import SignUpForm from "./sign-up-form";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  return (
    <div className={styles.page}>
      <main>
        <header>
          <h1>Sign Up</h1>
        </header>
        <SignUpForm signUpAction={signUp} />
      </main>
    </div>
  );
}

/**
 * @returns An error message if an error occurred.
 */
async function signUp(prevState: unknown, formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const handle = formData.get("handle") as string;
  const password = formData.get("password") as string;
  let signUpSuccess = false;

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        name: "",
        handle,
        password,
      },
      headers: await headers(),
    });
    signUpSuccess = true;
  } catch (error) {
    if (error instanceof APIError) {
      const { message } = error;
      return { message };
    }
  }

  if (signUpSuccess) redirect("/login");
}
