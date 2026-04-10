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
import { linkYouTubeAccount } from "@/services/db/youtube";

/**
 * @url https://ui.shadcn.com/blocks/signup
 */
export function YouTubeLinkForm({
  className,
  userId,
  ...props
}: React.ComponentProps<"div"> & {
  userId: string;
}) {
  async function handleSubmit(
    prevState: { message: string } | null,
    formData: FormData,
  ) {
    try {
      const cookie = formData.get("Cookie") as string;
      const authorization = formData.get("Authorization") as string;

      await linkYouTubeAccount(userId, cookie, authorization);
      return { message: "YouTube account linked successfully!" };
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to link YouTube account. Please try again.",
      };
    }
  }

  const [error, formAction, pending] = useActionState(handleSubmit, null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Link YouTube Account</CardTitle>
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
                  placeholder="Cookie header"
                  required
                />
                <FieldDescription>
                  Enter the Cookie header from a request to music.youtube.com.
                  Found in the Network tab of your browser&apos developer tools.
                </FieldDescription>
              </Field>
              <Field data-disabled={pending}>
                <FieldLabel htmlFor="Authorization">Authorization</FieldLabel>
                <Input
                  id="Authorization"
                  name="Authorization"
                  type="text"
                  placeholder="SAPISIDHASH ..."
                  required
                />
                <FieldDescription>
                  Enter the Authorization header from a request to
                  music.youtube.com. Found in the Network tab of your
                  browser&apos developer tools.
                </FieldDescription>
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending && <Spinner />} Link YouTube Account
                  </Button>
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
