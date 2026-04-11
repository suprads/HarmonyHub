"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const { error, data } = await authClient.signOut();

        if (data?.success) {
          router.push("/login");
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
