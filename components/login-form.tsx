"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Spinner } from "./ui/spinner";
import { useActionState } from "react";
import { spotifySignIn } from "@/services/auth/client";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * @url https://ui.shadcn.com/blocks/login
 * @url https://github.com/shadcn-ui/ui/blob/fbdf6c02c1172662408cb9d70173737ccef6814f/apps/v4/content/docs/forms/next.mdx#L3
 */
export function LoginForm({
  className,
  loginAction,
  ...props
}: React.ComponentProps<"div"> & {
  loginAction: (
    prevState: { message?: string; success: boolean },
    formData: FormData,
  ) => Promise<{ message?: string; success: boolean }>;
}) {
  const [state, formAction, pending] = useActionState(loginAction, {
    success: false,
  });
  const { refetch } = authClient.useSession();

  if (state.success) {
    // Done so components using the useSession hook will refresh its data.
    refetch();
    redirect("/profile");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field data-disabled={pending}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </Field>
              <Field data-disabled={pending}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link> */}
                </div>
                <Input id="password" name="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending && <Spinner />} Login
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={pending}
                  onClick={spotifySignIn}
                >
                  Login with Spotify
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
              {state?.message && <FieldError>{state?.message}</FieldError>}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
