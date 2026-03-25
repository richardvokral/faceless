"use client";

import { handleSignOut } from "@/app/actions";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
      >
        Sign Out
      </button>
    </form>
  );
}
