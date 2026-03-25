type AdminActionEntry = {
  id: string;
  adminEmail: string;
  actionType: string;
  targetUserId: string;
  payloadJson: unknown;
  createdAt: Date;
};

type Props = {
  actions: AdminActionEntry[];
};

export default function ActionLog({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-foreground/10 bg-background p-6">
        <h2 className="mb-4 text-lg font-semibold">Admin Action Log</h2>
        <p className="text-sm text-foreground/60">No actions yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-6">
      <h2 className="mb-4 text-lg font-semibold">Admin Action Log</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-left text-foreground/60">
              <th className="pb-2 pr-4">Admin</th>
              <th className="pb-2 pr-4">Action</th>
              <th className="pb-2 pr-4">Target User</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr
                key={action.id}
                className="border-b border-foreground/5 last:border-0"
              >
                <td className="py-2 pr-4">{action.adminEmail}</td>
                <td className="py-2 pr-4">{action.actionType}</td>
                <td className="py-2 pr-4 font-mono text-xs">
                  {action.targetUserId}
                </td>
                <td className="py-2 text-foreground/60">
                  {new Date(action.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
