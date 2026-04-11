import { auth } from "@/lib/auth";
import { SignupForm } from "@/components/signup-form";
import { headers } from "next/headers";
import { APIError } from "better-auth";
import { redirect } from "next/navigation";
import { getSession } from "@/services/auth/server";
export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect("/login");

  return (
    // <div className="font-sans flex items-center justify-items-center sm:p-20">
    <div className="font-sans flex items-center justify-items-center sm:p-20 bg-background text-foreground min-h-screen">
      <main className="flex flex-col items-center justify-items-center w-full">
        {/* <div className="w-full max-w-sm"> */}
        <div className="w-full max-w-sm bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
          <SignupForm signupAction={signUp} />
        </div>
      </main>
    </div>
  );
}

/**
 * @returns An error message if an error occurred.
 */
async function signUp(
  prevState: { message?: string; success: boolean },
  formData: FormData,
) {
  "use server";

  const email = formData.get("email") as string;
  const handle = formData.get("handle") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

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
  } catch (error) {
    if (error instanceof APIError) {
      console.error(error);
      return { message: error.message, success: false };
    }
  }
  return { success: true };
}
