import { redirect } from "next/navigation";
import { getUser, isAdmin } from "@/lib/auth";
import {
  searchUsers,
  toggleSubscription,
  adminGrantBenefit,
  getAdminLog,
} from "./actions";
import UserSearch from "@/components/admin/user-search";
import ActionLog from "@/components/admin/action-log";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const email = user.email as string;

  if (!isAdmin(email)) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="text-foreground/60">
          You do not have admin access. Contact an administrator if you believe
          this is an error.
        </p>
      </div>
    );
  }

  const adminLog = await getAdminLog();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Panel</h1>

      <div className="space-y-6">
        <div className="rounded-xl border border-foreground/10 bg-background p-6">
          <h2 className="mb-4 text-lg font-semibold">User Management</h2>
          <UserSearch
            searchAction={searchUsers}
            toggleAction={toggleSubscription}
            grantAction={adminGrantBenefit}
          />
        </div>

        <ActionLog actions={adminLog} />
      </div>
    </div>
  );
}
