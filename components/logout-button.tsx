"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type LogoutButtonProps = React.ComponentProps<typeof Button>;

export default function LogoutButton({
  onClick,
  children,
  ...buttonProps
}: LogoutButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={async (event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const { error, data } = await authClient.signOut();

        if (data?.success) {
          router.push("/login");
        } else if (error) {
          console.error("Failed to logout of account:", error);
        } else {
          console.error("Logout failed for unknown reasons.");
        }
      }}
      {...buttonProps}
    >
      {children ?? "Logout"}
    </Button>
  );
}
