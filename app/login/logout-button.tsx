"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  return (
    <Button
      onClick={async () => {
        const { error, data } = await authClient.signOut();

        if (data?.success) {
          redirect("/login");
        } else if (error) {
          console.error("Failed to logout of account:", error);
        } else {
          console.error("Logout failed for unknown reasons.");
        }
      }}
    >
      Logout
    </Button>
  );
}
