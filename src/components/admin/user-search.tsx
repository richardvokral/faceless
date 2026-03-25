"use client";

import { useState } from "react";
import UserDetail from "./user-detail";

type Customer = {
  logtoUserId: string;
  email: string;
  name: string | null;
  mediaSubscriptionActive: boolean;
  fashionPointsBalance: number;
  createdAt: Date;
};

type Props = {
  searchAction: (formData: FormData) => Promise<Customer[]>;
  toggleAction: (targetUserId: string, active: boolean) => Promise<void>;
  grantAction: (
    targetUserId: string
  ) => Promise<{ success: boolean; message: string }>;
};

export default function UserSearch({
  searchAction,
  toggleAction,
  grantAction,
}: Props) {
  const [results, setResults] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  async function handleSearch(formData: FormData) {
    setSearching(true);
    try {
      const users = await searchAction(formData);
      setResults(users);
      setSelected(null);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-4">
      <form action={handleSearch} className="flex gap-2">
        <input
          name="email"
          type="text"
          placeholder="Search by email..."
          className="flex-1 rounded-lg border border-foreground/20 bg-transparent px-4 py-2 text-sm focus:border-foreground/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/80 disabled:opacity-50"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="rounded-xl border border-foreground/10 bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10 text-left text-foreground/60">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Subscription</th>
                <th className="px-4 py-2">Points</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) => (
                <tr
                  key={user.logtoUserId}
                  className="border-b border-foreground/5 last:border-0"
                >
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.name || "—"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.mediaSubscriptionActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {user.mediaSubscriptionActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {user.fashionPointsBalance}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelected(user)}
                      className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <UserDetail
          user={selected}
          toggleAction={toggleAction}
          grantAction={grantAction}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
