type BenefitEvent = {
  id: string;
  eventType: string;
  pointsDelta: number;
  source: string | null;
  period: string | null;
  createdAt: Date;
};

type Props = {
  events: BenefitEvent[];
};

const eventTypeLabels: Record<string, string> = {
  subscription_activated: "Subscription Activated",
  subscription_deactivated: "Subscription Deactivated",
  benefit_granted: "Benefit Granted",
  points_redeemed: "Points Redeemed",
};

export default function BenefitHistory({ events }: Props) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-foreground/10 bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold">Benefit History</h2>
        <p className="text-sm text-foreground/60">No events yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-6">
      <h2 className="mb-4 text-lg font-semibold">Benefit History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-left text-foreground/60">
              <th className="pb-2 pr-4">Event</th>
              <th className="pb-2 pr-4">Points</th>
              <th className="pb-2 pr-4">Source</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b border-foreground/5 last:border-0"
              >
                <td className="py-2 pr-4">
                  {eventTypeLabels[event.eventType] || event.eventType}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      event.pointsDelta > 0
                        ? "text-green-600 dark:text-green-400"
                        : event.pointsDelta < 0
                          ? "text-red-600 dark:text-red-400"
                          : ""
                    }
                  >
                    {event.pointsDelta > 0 ? "+" : ""}
                    {event.pointsDelta}
                  </span>
                </td>
                <td className="py-2 pr-4 text-foreground/60">
                  {event.source || "—"}
                </td>
                <td className="py-2 text-foreground/60">
                  {new Date(event.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
