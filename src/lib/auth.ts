import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "./logto";
import { prisma } from "./db";

export async function getUser() {
  if (!process.env.LOGTO_APP_ID || !process.env.LOGTO_COOKIE_SECRET) {
    return null;
  }
  try {
    const context = await getLogtoContext(logtoConfig);
    if (!context.isAuthenticated || !context.claims) {
      return null;
    }
    return context.claims;
  } catch {
    return null;
  }
}

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

export async function ensureCustomerState(
  logtoUserId: string,
  email: string,
  name?: string | null
) {
  return prisma.customerState.upsert({
    where: { logtoUserId },
    create: {
      logtoUserId,
      email,
      name: name || null,
      mediaSubscriptionActive: false,
      fashionPointsBalance: 0,
    },
    update: {
      email,
      name: name || undefined,
    },
  });
}
