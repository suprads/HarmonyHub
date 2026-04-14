import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type LeaderboardRow = {
  id: string;
  name: string;
  handle: string | null;
  image: string | null;
  spotifyPlays: number;
  youtubePlays: number;
  totalPlays: number;
  isCurrentUser: boolean;
};

type LeaderboardTableProps = {
  rows: LeaderboardRow[];
};

function getDisplayName(user: Pick<LeaderboardRow, "name" | "handle">) {
  return user.handle ?? user.name;
}

function getAvatarFallbackText(row: LeaderboardRow) {
  const source = row.handle ?? row.name;
  return source.slice(0, 2).toUpperCase();
}

export default function LeaderboardTable({ rows }: LeaderboardTableProps) {
  const sortedRows = [...rows].sort((left, right) => {
    if (right.totalPlays !== left.totalPlays) {
      return right.totalPlays - left.totalPlays;
    }

    if (right.spotifyPlays !== left.spotifyPlays) {
      return right.spotifyPlays - left.spotifyPlays;
    }

    if (right.youtubePlays !== left.youtubePlays) {
      return right.youtubePlays - left.youtubePlays;
    }

    return getDisplayName(left).localeCompare(getDisplayName(right));
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Today</CardTitle>
        <CardDescription>
          Rankings are based on tracks listened to today from the shared
          listening history.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {sortedRows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="w-32">Spotify</TableHead>
                <TableHead className="w-32">YouTube</TableHead>
                <TableHead className="w-32">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={row.isCurrentUser ? "bg-muted/50" : undefined}
                >
                  <TableCell className="font-semibold">#{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage
                          src={row.image ?? undefined}
                          alt={getDisplayName(row)}
                        />
                        <AvatarFallback>
                          {getAvatarFallbackText(row)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {row.isCurrentUser ? "You" : getDisplayName(row)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {row.handle ?? row.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{row.spotifyPlays}</TableCell>
                  <TableCell>{row.youtubePlays}</TableCell>
                  <TableCell className="font-semibold">
                    {row.totalPlays}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-sm text-muted-foreground">
            No tracks have been listened to yet today.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
