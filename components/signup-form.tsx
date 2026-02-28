"use client";

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
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useActionState } from "react";

/**
 * @url https://ui.shadcn.com/blocks/signup
 */
export function SignupForm({
  className,
  signupAction,
  ...props
}: React.ComponentProps<"div"> & {
  signupAction: (
    prevState: { message: string } | undefined,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
}) {
  const [error, formAction, pending] = useActionState(signupAction, undefined);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
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
                <FieldLabel htmlFor="handle">Username</FieldLabel>
                <Input
                  id="handle"
                  name="handle"
                  type="text"
                  placeholder="username123"
                  required
                />
              </Field>
              <Field data-disabled={pending}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>
              {/* <Field data-disabled={pending}>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field> */}
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending && <Spinner />} Create Account
                  </Button>
                  {/* <Button variant="outline" type="button" disabled={pending}>
                    Sign up with Spotify
                  </Button> */}
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
                {error?.message && <FieldError>{error?.message}</FieldError>}
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
