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
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useActionState } from "react";
import { redirect } from "next/navigation";

/**
 * @url https://ui.shadcn.com/blocks/signup
 */
export function YouTubeLinkFormJson({
  className,
  linkAction,
  ...props
}: React.ComponentProps<"div"> & {
  linkAction: (
    prevState: { message?: string; success: boolean },
    formData: FormData,
  ) => Promise<{ message?: string; success: boolean }>;
}) {
  const [state, formAction, pending] = useActionState(linkAction, {
    success: false,
  });

  if (state.success) {
    redirect("/settings/services");
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card {...props}>
        <CardHeader>
          <CardTitle className="text-center">YouTube Music</CardTitle>
          <CardDescription>
            Enter your information below to link your YouTube account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field data-disabled={pending}>
                <FieldLabel htmlFor="headerRequest">Header Request</FieldLabel>
                <Input
                  id="headerRequest"
                  name="headerRequest"
                  type="text"
                  placeholder="Header request"
                  required
                />
                <FieldDescription>
                  Enter the whole header request from a request to
                  music.youtube.com. Found in the Network tab of your
                  browser&apos;s developer tools.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending && <Spinner />} Link YouTube Account
                  </Button>
                </Field>
                {state?.message && <FieldError>{state?.message}</FieldError>}
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function YouTubeLinkFormCookieAuthorization({
  className,
  linkAction,
  ...props
}: React.ComponentProps<"div"> & {
  linkAction: (
    prevState: { message?: string; success: boolean },
    formData: FormData,
  ) => Promise<{ message?: string; success: boolean }>;
}) {
  const [state, formAction, pending] = useActionState(linkAction, {
    success: false,
  });

  if (state.success) {
    redirect("/settings/services");
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card {...props}>
        <CardHeader>
          <CardTitle className="text-center">YouTube Music</CardTitle>
          <CardDescription>
            Enter your information below to link your YouTube account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field data-disabled={pending}>
                <FieldLabel htmlFor="Cookie">Cookie</FieldLabel>
                <Input
                  id="Cookie"
                  name="Cookie"
                  type="text"
                  placeholder="Cookie"
                  required
                />
                <FieldLabel htmlFor="Authorization">Authorization</FieldLabel>
                <Input
                  id="Authorization"
                  name="Authorization"
                  type="text"
                  placeholder="Authorization"
                  required
                />
                <FieldDescription>
                  Enter the Cookie and Authorization values from a request to
                  music.youtube.com. Found in the Network tab of your
                  browser&apos;s developer tools.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending && <Spinner />} Link YouTube Account
                  </Button>
                </Field>
                {state?.message && <FieldError>{state?.message}</FieldError>}
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
