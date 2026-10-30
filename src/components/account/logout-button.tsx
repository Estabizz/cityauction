"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

export async function logout(redirectTo = "/") {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    // Full load so every part of the page forgets the old session.
    window.location.assign(redirectTo);
  }
}

export function LogoutButton({ className, label = "Log out" }: { className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void logout();
      }}
      className={className}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      <span>{label}</span>
    </button>
  );
}
