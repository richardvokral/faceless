"use server";

import { signIn, signOut } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export async function handleSignIn() {
  // Validate env vars before attempting sign-in
  if (!process.env.LOGTO_APP_ID) {
    throw new Error("Missing LOGTO_APP_ID environment variable");
  }
  if (!process.env.LOGTO_APP_SECRET) {
    throw new Error("Missing LOGTO_APP_SECRET environment variable");
  }
  if (!process.env.LOGTO_ENDPOINT) {
    throw new Error("Missing LOGTO_ENDPOINT environment variable");
  }
  if (!process.env.LOGTO_COOKIE_SECRET) {
    throw new Error("Missing LOGTO_COOKIE_SECRET environment variable");
  }

  await signIn(logtoConfig);
}

export async function handleSignOut() {
  await signOut(logtoConfig);
}
