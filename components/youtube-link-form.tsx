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
import { linkYouTubeAccount } from "@/services/db/youtubedb";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  async function handleSubmit(
    prevState: { message: string } | null,
    formData: FormData,
  ) {
    try {
      const headerRequest = formData.get("headerRequest") as string;
      const parsedHeaderRequest = JSON.parse(headerRequest);

      if (!parsedHeaderRequest?.requestHeaders?.headers) {
        throw new Error(
          "Invalid header request. Please enter a valid JSON string.",
        );
      }

      const headers: { name: string; value: string }[] =
        parsedHeaderRequest.requestHeaders.headers;

      const cookie = headers.find(
        (h) => h.name.toLowerCase() === "cookie",
      )?.value;
      const authorization = headers.find(
        (h) => h.name.toLowerCase() === "authorization",
      )?.value;

      if (!cookie || !authorization) {
        throw new Error(
          "Missing required headers. Please ensure both Cookie and Authorization headers are included.",
        );
      }

      await linkYouTubeAccount(userId, cookie, authorization);
      router.refresh();
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
                {error?.message && <FieldError>{error?.message}</FieldError>}
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
