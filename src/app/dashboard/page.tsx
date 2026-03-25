import { redirect } from "next/navigation";
import { getUser, ensureCustomerState } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { grantMonthlyBenefit } from "@/lib/benefit-engine";
import ProfileCard from "@/components/profile-card";
import BenefitHistory from "@/components/benefit-history";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const logtoUserId = user.sub;
  const email = (user.email as string) || "unknown";
  const name = (user.name as string) || null;

  const customer = await ensureCustomerState(logtoUserId, email, name);

  const events = await prisma.benefitEvent.findMany({
    where: { logtoUserId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  async function claimBenefit() {
    "use server";
    const result = await grantMonthlyBenefit(logtoUserId);
    if (!result.success) {
      throw new Error(result.message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="space-y-6">
        <ProfileCard
          email={customer.email}
          name={customer.name}
          logtoUserId={customer.logtoUserId}
          mediaSubscriptionActive={customer.mediaSubscriptionActive}
          fashionPointsBalance={customer.fashionPointsBalance}
        />

        {customer.mediaSubscriptionActive && (
          <div className="rounded-xl border border-foreground/10 bg-background p-6">
            <h2 className="mb-3 text-lg font-semibold">Claim Benefit</h2>
            <p className="mb-4 text-sm text-foreground/60">
              Your media subscription is active. Claim your monthly fashion
              points bonus.
            </p>
            <form action={claimBenefit}>
              <ClaimButton />
            </form>
          </div>
        )}

        <BenefitHistory events={events} />
      </div>
    </div>
  );
}

function ClaimButton() {
  return (
    <button
      type="submit"
      className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
    >
      Claim +100 Fashion Points
    </button>
  );
}
