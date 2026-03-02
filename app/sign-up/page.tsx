import { auth } from "@/lib/auth";
import { SignupForm } from "@/components/signup-form";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  return (
    <div className="font-sans flex items-center justify-items-center sm:p-20">
      <main className="flex flex-col items-center justify-items-center w-full">
        <div className="w-full max-w-sm">
          <SignupForm signupAction={signUp} />
        </div>
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
  const name = formData.get("name") as string;

  let signUpSuccess = false;

  try {
    await auth.api.signUpEmail({
      body: {
        email: email,
        name: name,
        password: password,
        handle: handle,
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
