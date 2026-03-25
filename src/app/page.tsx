import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import SignInButton from "@/components/sign-in-button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          Group Pass Alpha
        </h1>
        <p className="max-w-md text-lg text-foreground/60">
          Cross-brand loyalty platform. Sign in to access your dashboard,
          benefits, and connected businesses.
        </p>
      </div>
      <SignInButton />
    </div>
  );
}
