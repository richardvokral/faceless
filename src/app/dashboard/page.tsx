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
  const email = user.email || "unknown";
  const name = user.name || null;

  let customer;
  let events;

  try {
    customer = await ensureCustomerState(logtoUserId, email, name);
    events = await prisma.benefitEvent.findMany({
      where: { logtoUserId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (error) {
    console.error("Dashboard DB error:", error);
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <h2 className="mb-2 font-semibold">Database Error</h2>
          <p className="text-sm">
            Could not connect to the database. This usually means:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm">
            <li>The DATABASE_URL environment variable is not set or incorrect</li>
            <li>The database tables have not been created yet (run <code className="rounded bg-red-100 px-1 dark:bg-red-900">npx prisma db push</code>)</li>
            <li>The Neon database is unreachable</li>
          </ul>
          <p className="mt-3 text-xs opacity-70">
            Error: {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }

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
