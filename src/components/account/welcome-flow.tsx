"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { postJson } from "./auth-ui";
import { RequirementForm } from "./requirement-form";

// The optional preferences step right after sign-up. Saving or skipping both
// lead on to the dashboard (or wherever the buyer was headed).
export function WelcomeFlow({ hasEmail, next }: { hasEmail: boolean; next: string }) {
  const [skipping, setSkipping] = useState(false);

  async function skip() {
    setSkipping(true);
    await postJson("/api/user/onboarding", {});
    window.location.assign(next);
  }

  return (
    <div className="space-y-4">
      <RequirementForm
        hasEmail={hasEmail}
        completeOnboarding
        submitLabel="Save & continue"
        onSaved={() => window.location.assign(next)}
      />
      <div className="text-center">
        <button type="button" onClick={skip} disabled={skipping} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#59636a] hover:text-[#182129] cursor-pointer disabled:opacity-60">
          {skipping && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Skip for now, I&apos;ll do this later
        </button>
      </div>
    </div>
  );
}
