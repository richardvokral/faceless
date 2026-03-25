"use client";

type Props = {
  onSignIn: () => Promise<void>;
};

export default function SignInButton({ onSignIn }: Props) {
  return (
    <form action={onSignIn}>
      <button
        type="submit"
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Sign In
      </button>
    </form>
  );
}
