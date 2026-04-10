"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Circle, MoreHorizontalIcon } from "lucide-react";
import { notificationFriendRequestAction, changeToRead } from "./actions";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { NotificationType } from "@/generated/prisma/enums";

type NotificationTableRowProps = {
  children: React.ReactNode;
  id: bigint;
  read: boolean;
  type: NotificationType;
  infoId: string;
};

export default function NotificationTableRow({
  children,
  id,
  read,
  type,
  infoId,
}: NotificationTableRowProps) {
  const [readNotification, setReadNotification] = useState(read);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // const [deleted, setDeleted] = useState(false);

  const handleAcceptFriendRequest = async () => {
    setAccepting(true);

    try {
      const result = await notificationFriendRequestAction(
        { id, type, infoId },
        "accept",
      );

      if (!result.success) {
        alert(result.error ?? "Failed to accept friend request.");
        return;
      }

      setAccepted(true);
      setReadNotification(true);
      setDismissed(true);
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      alert("Failed to accept friend request.");
    } finally {
      setAccepting(false);
    }
  };

  const handleRejectFriendRequest = async () => {
    setRejecting(true);

    try {
      const result = await notificationFriendRequestAction(
        { id, type, infoId },
        "reject",
      );

      if (!result.success) {
        alert(result.error ?? "Failed to reject friend request.");
        return;
      }

      setRejected(true);
      setReadNotification(true);
      setDismissed(true);
    } catch (error) {
      console.error("Failed to reject friend request:", error);
      alert("Failed to reject friend request.");
    } finally {
      setRejecting(false);
    }
  };

  if (dismissed) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>
        {!readNotification && (
          <Circle
            className="fill-destructive stroke-destructive stroke-1"
            width={12}
            height={12}
          />
        )}
      </TableCell>
      {children}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {type === "FRIEND_REQUEST" && !accepted && !rejected && (
              <>
                <DropdownMenuItem
                  disabled={accepting || rejecting}
                  onClick={handleAcceptFriendRequest}
                >
                  {accepting ? "Accepting..." : "Accept Friend Request"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={accepting || rejecting}
                  onClick={handleRejectFriendRequest}
                  variant="destructive"
                >
                  {rejecting ? "Rejecting..." : "Reject Friend Request"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() =>
                changeToRead({ id, read: readNotification }).then(() =>
                  setReadNotification(true),
                )
              }
            >
              Mark as Read
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                deleteNotification({ id }).then(() => setDeleted(true))
              }
            >
              Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
