"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Circle, MoreHorizontalIcon } from "lucide-react";
import { changeToRead } from "./actions";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type NotificationTableRowProps = {
  children: React.ReactNode;
  id: bigint;
  read: boolean;
};

export default function NotificationTableRow({
  children,
  id,
  read,
}: NotificationTableRowProps) {
  const [readNotification, setReadNotification] = useState(read);
  // const [deleted, setDeleted] = useState(false);

  return (
    <TableRow className="cursor-pointer">
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
            <DropdownMenuItem
              onClick={() =>
                changeToRead({ id, read }).then(() => setReadNotification(true))
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
