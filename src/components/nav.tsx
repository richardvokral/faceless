import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import SignOutButton from "./sign-out-button";

export default async function Nav() {
  const user = await getUser();
  const userEmail = user?.email as string | undefined;
  const admin = isAdmin(userEmail);
  const accountCenterUrl = process.env.LOGTO_ACCOUNT_CENTER_URL;

  return (
    <nav className="border-b border-foreground/10 bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            Group Pass Alpha
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              {admin && (
                <Link
                  href="/admin"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Admin
                </Link>
              )}
              {accountCenterUrl && (
                <a
                  href={accountCenterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  Account Settings
                </a>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-xs text-foreground/50">{userEmail}</span>
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
