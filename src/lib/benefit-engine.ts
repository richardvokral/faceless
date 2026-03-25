import { prisma } from "./db";

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const BENEFIT_POINTS = 100;

export async function grantMonthlyBenefit(
  logtoUserId: string
): Promise<{ success: boolean; message: string }> {
  const customer = await prisma.customerState.findUnique({
    where: { logtoUserId },
  });

  if (!customer) {
    return { success: false, message: "Customer not found." };
  }

  if (!customer.mediaSubscriptionActive) {
    return {
      success: false,
      message: "Media subscription is not active.",
    };
  }

  const period = getCurrentPeriod();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.benefitEvent.create({
        data: {
          logtoUserId,
          eventType: "benefit_granted",
          pointsDelta: BENEFIT_POINTS,
          source: "media_subscription",
          period,
        },
      });

      await tx.customerState.update({
        where: { logtoUserId },
        data: {
          fashionPointsBalance: { increment: BENEFIT_POINTS },
        },
      });
    });

    return {
      success: true,
      message: `+${BENEFIT_POINTS} fashion points granted for ${period}.`,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        message: `Benefit already granted for ${period}.`,
      };
    }
    throw error;
  }
}
