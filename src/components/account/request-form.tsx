"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { textareaClass, labelClass } from "@/components/ui/styles";
import { Send } from "lucide-react";
import { Field, FormAlert, SelectField, SubmitButton, postJson } from "./auth-ui";

const TYPES = [
  { value: "support", label: "A question or help with an auction" },
  { value: "data-access", label: "Send me a copy of my data" },
  { value: "data-deletion", label: "Delete my account and data" },
];

export function RequestForm() {
  const router = useRouter();
  const [type, setType] = useState("support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (type === "support" && message.trim().length < 5) {
      setResult({ ok: false, message: "Please tell us how we can help." });
      return;
    }
    setLoading(true);
    setResult(null);
    const { ok, data } = await postJson<{ reference?: string }>("/api/user/requests", { type, subject, message });
    setLoading(false);
    if (ok) {
      setResult({ ok: true, message: `Request received${data.reference ? ` · Reference ${data.reference}` : ""}. Track its progress in My enquiries.` });
      setSubject("");
      setMessage("");
      router.refresh();
    } else setResult({ ok: false, message: data.error || "Couldn't send your request. Please try again." });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {result && <FormAlert kind={result.ok ? "success" : "error"}>{result.message}</FormAlert>}
      <SelectField id="type" label="What do you need?" options={TYPES} value={type} onChange={(e) => setType(e.target.value)} />
      {type === "support" && <Field id="subject" label="Subject" maxLength={150} placeholder="e.g. Help with EMD for auction CA-GU-2026-1001" value={subject} onChange={(e) => setSubject(e.target.value)} />}
      <div>
        <label htmlFor="message" className={labelClass}>
          {type === "support" ? "Message" : "Anything we should know? (optional)"}
        </label>
        <textarea
          id="message"
          rows={4}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={textareaClass}
        />
      </div>
      {type === "data-deletion" && (
        <p className="text-xs text-[#59636a]">
          We&apos;ll confirm with you before deleting anything. Some records may have to be kept for legal reasons; we&apos;ll tell you which.
        </p>
      )}
      <div className="sm:max-w-xs">
        <SubmitButton loading={loading} loadingText="Sending…">
          <Send className="h-4 w-4" />
          <span>Send request</span>
        </SubmitButton>
      </div>
    </form>
  );
}
