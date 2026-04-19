import { verifySession } from "@/services/auth/server";

export default function SettingsPage() {
  verifySession();
  return (
    <div className="page">
      <main>
        <h1>Settings Page</h1>
      </main>
    </div>
  );
}
