"use client";

type Props = {
  onSignOut: () => Promise<void>;
};

export default function SignOutButton({ onSignOut }: Props) {
  return (
    <form action={onSignOut}>
      <button
        type="submit"
        className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
      >
        Sign Out
      </button>
    </form>
  );
}
