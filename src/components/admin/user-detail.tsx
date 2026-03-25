"use client";

import { useState } from "react";

type Customer = {
  logtoUserId: string;
  email: string;
  name: string | null;
  mediaSubscriptionActive: boolean;
  fashionPointsBalance: number;
};

type Props = {
  user: Customer;
  toggleAction: (targetUserId: string, active: boolean) => Promise<void>;
  grantAction: (
    targetUserId: string
  ) => Promise<{ success: boolean; message: string }>;
  onClose: () => void;
};

export default function UserDetail({
  user,
  toggleAction,
  grantAction,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleToggle() {
    setLoading(true);
    setMessage(null);
    try {
      await toggleAction(user.logtoUserId, !user.mediaSubscriptionActive);
      setMessage(
        `Subscription ${!user.mediaSubscriptionActive ? "activated" : "deactivated"}.`
      );
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Error toggling subscription");
    } finally {
      setLoading(false);
    }
  }

  async function handleGrant() {
    setLoading(true);
    setMessage(null);
    try {
      const result = await grantAction(user.logtoUserId);
      setMessage(result.message);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Error granting benefit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-foreground/10 bg-background p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manage User</h3>
        <button
          onClick={onClose}
          className="text-sm text-foreground/50 hover:text-foreground"
        >
          Close
        </button>
      </div>

      <dl className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-foreground/60">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-foreground/60">User ID</dt>
          <dd className="font-mono text-xs">{user.logtoUserId}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-foreground/60">Points</dt>
          <dd className="font-bold">{user.fashionPointsBalance}</dd>
        </div>
      </dl>

      <div className="flex gap-3">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
            user.mediaSubscriptionActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {user.mediaSubscriptionActive
            ? "Deactivate Subscription"
            : "Activate Subscription"}
        </button>
        <button
          onClick={handleGrant}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          Grant Benefit
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm text-foreground/70">{message}</p>
      )}
    </div>
  );
}
