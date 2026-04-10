import { Table, TableBody, TableCell } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/services/auth/server";
import { genNotificationMsg } from "@/services/db/notification";
import NotificationTableRow from "./notification-table-row";

export default async function NotificationsPage() {
  const { user } = await verifySession();

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col items-center justify-items-center gap-6 sm:p-20">
      <header>
        <h1 className="text-4xl font-bold m-0 p-[auto]">Notifications</h1>
      </header>
      <main className="flex items-center">
        {notifications.length > 0 ? (
          <Table>
            <TableBody>
              {notifications.map((n) => (
                <NotificationTableRow
                  key={n.id}
                  id={n.id}
                  read={n.read}
                  type={n.type}
                  infoId={n.infoId}
                >
                  <TableCell>{genNotificationMsg(n.type, n.infoId)}</TableCell>
                </NotificationTableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No notifications found.</p>
        )}
      </main>
    </div>
  );
}
