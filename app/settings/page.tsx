import { verifySession } from "@/services/auth/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  verifySession();
  return (
    <div className="font-sans flex flex-col items-center gap-6 sm:p-20">
      <header>
        <h1 className="text-4xl font-bold">Settings</h1>
      </header>
      <main className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Choose a section to manage your account preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/settings/services">Services</Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/settings/notifications">Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
