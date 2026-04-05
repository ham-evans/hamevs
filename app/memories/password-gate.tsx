"use client";

import { useState } from "react";
import { verifyPassword } from "./actions";

export default function PasswordGate({
  children,
  isAuthed,
}: {
  children: React.ReactNode;
  isAuthed: boolean;
}) {
  const [authed, setAuthed] = useState(isAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(false);
          const ok = await verifyPassword(password);
          if (ok) {
            setAuthed(true);
          } else {
            setError(true);
          }
        }}
        className="flex flex-col items-center gap-4"
      >
        <label htmlFor="password" className="text-sm text-fg/50">
          password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-fg/20 bg-transparent px-3 py-2 text-sm text-fg outline-none focus:border-fg"
          autoFocus
        />
        {error && <p className="text-sm text-fg/50">wrong password</p>}
        <button
          type="submit"
          className="text-sm text-fg/50 underline underline-offset-4 hover:text-fg"
        >
          enter
        </button>
      </form>
    </main>
  );
}
