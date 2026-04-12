"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

type LinkServiceButtonProps = {
  provider: string;
  scopes?: string[];
};

export function LinkServiceButton({
  provider,
  scopes,
}: LinkServiceButtonProps) {
  return (
    <Button
      className="w-full"
      onClick={async () => {
        const linkResult = await authClient.linkSocial({
          provider: provider,
          scopes: scopes,
          callbackURL: "http://127.0.0.1:3000/settings/services",
        });

        if (linkResult && linkResult.data?.redirect && linkResult.data?.url) {
          redirect(linkResult.data.url);
        }
        if (linkResult && linkResult.error) {
          console.error("Error linking account:", linkResult.error.message);
        }
      }}
    >
      Link Spotify Account
    </Button>
  );
}

type UnlinkServiceButtonProps = {
  provider: string;
};

export function UnlinkServiceButton({ provider }: UnlinkServiceButtonProps) {
  return (
    <Button
      className="w-full"
      onClick={async () => {
        const unlinkResult = await authClient.unlinkAccount({
          providerId: provider,
        });

        if (unlinkResult && unlinkResult.error) {
          console.error("Error unlinking account:", unlinkResult.error.message);
        }

        redirect("/settings/services");
      }}
    >
      Unlink Spotify Account
    </Button>
  );
}
