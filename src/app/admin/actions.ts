"use server";

import { getUser, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { grantMonthlyBenefit } from "@/lib/benefit-engine";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");
  const email = user.email as string;
  if (!isAdmin(email)) throw new Error("Not authorized");
  return email;
}

export async function searchUsers(formData: FormData) {
  await requireAdmin();
  const query = (formData.get("email") as string)?.trim();
  if (!query) return [];
  return prisma.customerState.findMany({
    where: { email: { contains: query, mode: "insensitive" } },
    take: 20,
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleSubscription(
  targetUserId: string,
  active: boolean
) {
  const adminEmail = await requireAdmin();

  await prisma.customerState.update({
    where: { logtoUserId: targetUserId },
    data: { mediaSubscriptionActive: active },
  });

  const eventType = active
    ? "subscription_activated"
    : "subscription_deactivated";

  await prisma.benefitEvent.create({
    data: {
      logtoUserId: targetUserId,
      eventType,
      pointsDelta: 0,
      source: "admin",
    },
  });

  await prisma.adminAction.create({
    data: {
      adminEmail,
      actionType: eventType,
      targetUserId,
      payloadJson: { active },
    },
  });

  revalidatePath("/admin");
}

export async function adminGrantBenefit(targetUserId: string) {
  const adminEmail = await requireAdmin();

  const result = await grantMonthlyBenefit(targetUserId);

  await prisma.adminAction.create({
    data: {
      adminEmail,
      actionType: "benefit_granted",
      targetUserId,
      payloadJson: { result },
    },
  });

  revalidatePath("/admin");
  return result;
}

export async function getAdminLog() {
  await requireAdmin();
  return prisma.adminAction.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
