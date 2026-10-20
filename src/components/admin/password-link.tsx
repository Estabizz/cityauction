"use client";

import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { fmtDateTime, sendJson } from "./hooks";
import { Button } from "./ui";

interface LinkResult {
  email: string;
  isActive: boolean;
  url: string;
  expiresAt: string;
}

// "Generate password link" button plus the copy box it reveals. Used on the
// Users page and on password-reset leads.
export function PasswordLinkTool({ userId, onCreated }: { userId: string; onCreated?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LinkResult | null>(null);
  const [copied, setCopied] = useState(false);

  const create = async () => {
    if (result && !window.confirm("Create a new link? The previous link will stop working.")) return;
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      setResult(await sendJson<LinkResult>(`/api/admin/users/${userId}/password-link`, "POST", {}));
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the link.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", result.url);
    }
  };

  return (
    <div className="space-y-2">
      <Button variant="gold" busy={busy} onClick={create}>
        <KeyRound className="h-3.5 w-3.5" /> {result ? "Generate a new link" : "Generate password link"}
      </Button>
      {error && <p className="text-xs text-red-700">{error}</p>}
      {result && (
        <div className="rounded-xl border border-[#e8d7b5] bg-[#fbf6ec] p-3 text-xs text-[#5e4b2a]">
          <p className="mb-2">
            Send this link to <strong>{result.email}</strong>. It works once and expires {fmtDateTime(result.expiresAt)}.
            {!result.isActive && " This account is deactivated, so activate it too or they will not be able to sign in."}
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={result.url}
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 rounded-lg border border-[#e6dfd4] bg-white px-2 py-1.5 font-mono text-[11px]"
            />
            <Button variant="primary" onClick={copy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
