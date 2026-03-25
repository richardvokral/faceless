type Props = {
  email: string;
  name: string | null;
  logtoUserId: string;
  mediaSubscriptionActive: boolean;
  fashionPointsBalance: number;
};

export default function ProfileCard({
  email,
  name,
  logtoUserId,
  mediaSubscriptionActive,
  fashionPointsBalance,
}: Props) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-6">
      <h2 className="mb-4 text-lg font-semibold">Your Profile</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-foreground/60">Email</dt>
          <dd className="font-medium">{email}</dd>
        </div>
        {name && (
          <div className="flex justify-between">
            <dt className="text-foreground/60">Name</dt>
            <dd className="font-medium">{name}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-foreground/60">User ID</dt>
          <dd className="font-mono text-xs">{logtoUserId}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-foreground/60">Media Subscription</dt>
          <dd>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                mediaSubscriptionActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {mediaSubscriptionActive ? "Active" : "Inactive"}
            </span>
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-foreground/60">Fashion Points</dt>
          <dd className="text-lg font-bold">{fashionPointsBalance}</dd>
        </div>
      </dl>
    </div>
  );
}
