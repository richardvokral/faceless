"use client";

import { useActionState } from "react";
import { handleSignIn } from "@/app/actions";

export default function SignInButton() {
  const [error, formAction, isPending] = useActionState(
    async () => {
      try {
        await handleSignIn();
        return null;
      } catch (e) {
        // Next.js redirect throws a special error — rethrow it
        if (
          e &&
          typeof e === "object" &&
          "digest" in e &&
          typeof (e as { digest: unknown }).digest === "string" &&
          (e as { digest: string }).digest.startsWith("NEXT_REDIRECT")
        ) {
          throw e;
        }
        return e instanceof Error ? e.message : "Sign in failed. Check server logs.";
      }
    },
    null
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
      {error && (
        <p className="mt-3 max-w-sm text-center text-sm text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}
