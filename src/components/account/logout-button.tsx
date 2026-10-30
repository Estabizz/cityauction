"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

export async function logout(redirectTo = "/") {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST", cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return "Couldn't log out. Please try again.";
    // Navigate only after the server confirms that the HttpOnly cookie is cleared.
    window.location.assign(redirectTo);
    return null;
  } catch {
    return "Couldn't reach the server to log out. Please try again.";
  }
}

export function LogoutButton({ className, label = "Log out" }: { className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        setError(null);
        const failure = await logout();
        if (failure) { setError(failure); setBusy(false); }
      }}
      className={className}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      <span>{label}</span>
    </button>
    {error && <p role="alert" className="max-w-xs px-3 py-2 text-xs text-red-700">{error}</p>}
    </>
  );
}
