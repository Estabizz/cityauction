"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function FinancialInstitutionLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [institutionId, setInstitutionId] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (mode === "password") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: institutionId,
            password,
          }),
        });

        const data = await res.json();
        if (data.success) {
          router.push("/admin/dashboard");
        } else {
          setStatus(data.error || "Authentication failed. Please verify credentials with your recovery cell.");
        }
      } else {
        setStatus("OTP delivery service: A 6-digit verification code has been dispatched to your registered institutional handset.");
      }
    } catch {
      setStatus("Secure gateway error. Please verify network connection or call institutional support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbf9f5] min-h-screen text-[#182129] font-sans antialiased">
      {/* Top Utility Bar */}
      <div className="topbar">
        <div className="container flex justify-between items-center py-2 text-xs">
          <div>
            <strong>CityAuction Institutional Access</strong> · A venture of Estabizz Fintech Private Limited
          </div>
          <div>
            <a href="mailto:info@estabizz.com" className="hover:text-white">Institutional Support</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header border-b border-[#e6dfd4] bg-[#fbf9f5]">
        <div className="container header-row flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="CityAuction Logo" className="h-16 sm:h-20 w-auto object-contain" />
          </Link>

          <Link href="/institutional-services" className="back text-xs text-[#59636a] hover:text-[#7f623b] flex items-center gap-1 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Institutional Services
          </Link>
        </div>
      </header>

      {/* Login Shell */}
      <main className="min-h-[calc(100vh-116px)] flex items-center py-12" style={{ background: "radial-gradient(circle at 18% 20%, rgba(180, 147, 97, 0.15), transparent 24%), linear-gradient(135deg, #0a1218 0%, #10202b 58%, #172d39 100%)" }}>
        <div className="estabizz-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <section className="text-white">
            <div className="eyebrow-text !text-[#d9c39c]">Financial Institution Portal</div>
            <h1 className="font-serif-heading mt-4 leading-tight text-white" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 600 }}>
              Institutional Access.<br />
              <em className="not-italic" style={{ color: "#d9c39c", fontWeight: 400 }}>Built Around the Mandate.</em>
            </h1>

            <p className="text-[#c5cfd5] text-base sm:text-lg mt-6 max-w-xl leading-relaxed">
              Secure access for Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals and Financial Institutions managing assets, mandates, buyer enquiries, documents, inspections and institutional reporting through CityAuction.
            </p>

            <div className="quote-block mt-8 text-[#d9c39c]">
              “One secure workspace for the market-facing side of institutional asset resolution.”
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                <strong className="block text-white mb-2">Role-Based Access</strong>
                <span className="text-sm text-[#aeb9c1]">Access can be structured for authorised users, teams and institutional responsibilities.</span>
              </div>
              <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                <strong className="block text-white mb-2">Controlled Documents</strong>
                <span className="text-sm text-[#aeb9c1]">Seller-approved files and data-room materials can be permissioned by workflow.</span>
              </div>
              <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                <strong className="block text-white mb-2">Buyer Funnel Visibility</strong>
                <span className="text-sm text-[#aeb9c1]">Review enquiries, inspection requests, lead status and participation readiness.</span>
              </div>
              <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                <strong className="block text-white mb-2">Institutional MIS</strong>
                <span className="text-sm text-[#aeb9c1]">Track agreed asset, campaign and buyer-engagement activity through one interface.</span>
              </div>
            </div>
          </section>

          {/* Right Column: Card */}
          <section className="bg-[rgba(251,249,245,0.99)] border border-white/25 rounded-[30px] p-[34px] shadow-2xl relative" aria-labelledby="loginTitle">
            <div className="card-head flex justify-between items-start gap-4">
              <div>
                <div className="eyebrow-text">Secure Sign In</div>
                <h2 id="loginTitle" className="font-serif-heading font-semibold text-[#182129] mt-1" style={{ fontSize: "1.75rem", lineHeight: 1.2 }}>
                  Institution Login
                </h2>
                <p className="text-xs text-[#6f777d] mt-2">
                  Use the credentials assigned to your authorised institutional account.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#edf4ef] text-[#416b58] text-[11px] font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#416b58]" /> Secure Access
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6 p-1.5 bg-[#efeae1] rounded-xl" role="tablist">
              <button
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${mode === "password" ? "bg-white text-[#182129] shadow-sm" : "text-[#7f8a92] hover:text-[#182129]"}`}
                type="button"
                onClick={() => { setMode("password"); setStatus(null); }}
              >
                Password
              </button>
              <button
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${mode === "otp" ? "bg-white text-[#182129] shadow-sm" : "text-[#7f8a92] hover:text-[#182129]"}`}
                type="button"
                onClick={() => { setMode("otp"); setStatus(null); }}
              >
                OTP
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="field-custom">
                <label htmlFor="institutionId">Institution ID / Registered Email</label>
                <input
                  id="institutionId"
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  autoComplete="username"
                  required
                  placeholder="Institution ID or official email"
                />
              </div>

              {mode === "password" ? (
                <>
                  <div className="field-custom">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrap">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="toggle-pwd-btn"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#657078] pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="accent-[#b49361]"
                      />
                      Remember this device
                    </label>
                    <Link href="/forgot-password" className="text-[#80643d] font-bold hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    className="btn-pill btn-dark w-full mt-4 flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials...
                      </>
                    ) : (
                      "Sign In to Institution Portal"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="field-custom">
                    <label htmlFor="mobile">Registered Mobile / Email</label>
                    <input
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter registered mobile or email"
                      required
                    />
                  </div>

                  <button
                    className="btn-pill btn-gold w-full mt-4 flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Transmitting OTP...
                      </>
                    ) : (
                      "Send Secure OTP"
                    )}
                  </button>
                </>
              )}

              {status && (
                <div className="text-xs p-3 rounded-lg bg-[#f8f4ed] text-[#705a3d] border border-[#e6dfd4] mt-3 leading-relaxed">
                  {status}
                </div>
              )}
            </form>

            <div className="divider my-5 text-center relative flex items-center justify-center text-[11px] text-[#9a9fa2]">
              <span className="bg-[#fbf9f5] px-3 z-10 font-bold uppercase tracking-wider">First-Time Access</span>
              <div className="absolute inset-x-0 h-[1px] bg-[#e6dfd4]" />
            </div>

            <div className="first-access-box">
              <strong>New Institutional User?</strong>
              <p>
                Institutional access should be created only after onboarding / authorisation by the Bank, NBFC, ARC, Liquidator, Insolvency Professional or other registered institution.
              </p>
              <Link href="/institutional-services#institutional-desk" className="text-xs font-bold text-[#80643d] hover:underline block mt-2">
                Request Institutional Access →
              </Link>
            </div>

            <div className="security-note-box">
              <strong>Security Notice:</strong> CityAuction will never ask you to share your password, OTP or authentication code over a phone call, WhatsApp message or unsolicited email. Always verify the domain before signing in.
            </div>

            <div className="text-center text-xs text-[#5e686f] mt-4">
              Need assistance? <a href="tel:+919825669668" className="font-bold text-[#182129]">+91 98256 69668</a> ·{" "}
              <a href="mailto:info@estabizz.com" className="font-bold text-[#80643d]">info@estabizz.com</a>
            </div>

            <div className="text-center text-[11px] text-[#889197] mt-3">
              By signing in, you agree to the <Link href="/terms" className="underline">Terms &amp; Conditions</Link>,{" "}
              <Link href="/privacy-policy" className="underline">Privacy Policy</Link> and applicable institutional access terms.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
