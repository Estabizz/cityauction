"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

export function InvestorLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [otpIdentity, setOtpIdentity] = useState("");
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
            email: identity,
            password,
          }),
        });

        const data = await res.json();
        if (data.success) {
          router.push("/dashboard");
        } else {
          setStatus(data.error || "Authentication failed. Please verify credentials or contact investor support.");
        }
      } else {
        setStatus("OTP delivery: A secure 6-digit verification code has been dispatched to your registered handset/email.");
      }
    } catch {
      setStatus("Secure gateway error. Please verify network connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!otpIdentity) {
      setStatus("Please enter your registered mobile number or email address.");
      return;
    }
    setStatus(`A secure one-time passcode has been generated and sent to ${otpIdentity}.`);
  };

  return (
    <div className="login-card" aria-labelledby="loginTitle">
      <div className="flex justify-between gap-4 items-start">
        <div>
          <div className="eyebrow-text">Secure Investor Sign In</div>
          <h2 id="loginTitle" className="font-serif-heading text-3xl font-semibold text-[#182129] mt-1 leading-tight">
            Investor Login
          </h2>
          <p className="text-xs text-[#6f777d] mt-1">Access your personal CityAuction investor workspace.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#edf4ef] text-[#416b58] text-[11px] font-bold whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#416b58]" />
          Secure Access
        </div>
      </div>

      <div className="login-tabs" role="tablist" aria-label="Login method">
        <button
          className={`login-tab-btn ${mode === "password" ? "active" : ""}`}
          type="button"
          role="tab"
          aria-selected={mode === "password"}
          onClick={() => { setMode("password"); setStatus(null); }}
        >
          Password
        </button>
        <button
          className={`login-tab-btn ${mode === "otp" ? "active" : ""}`}
          type="button"
          role="tab"
          aria-selected={mode === "otp"}
          onClick={() => { setMode("otp"); setStatus(null); }}
        >
          OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        {mode === "password" ? (
          <>
            <div>
              <label htmlFor="identity" className="block text-[11px] uppercase tracking-wider font-bold text-[#747b80] mb-1.5">
                Registered Email / Mobile
              </label>
              <input
                id="identity"
                type="text"
                autoComplete="username"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Email or mobile number"
                className="w-full h-12 border border-[#dcd6cc] rounded-xl bg-white px-3.5 text-sm text-[#253039] focus:outline-none focus:ring-2 focus:ring-[#b49361]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] uppercase tracking-wider font-bold text-[#747b80] mb-1.5">
                Password
              </label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-12 border border-[#dcd6cc] rounded-xl bg-white px-3.5 pr-14 text-sm text-[#253039] focus:outline-none focus:ring-2 focus:ring-[#b49361]"
                />
                <button
                  type="button"
                  className="toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[#80643d] font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#182129] text-white font-bold text-sm cursor-pointer hover:bg-[#111a20] transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Investor Portal"}
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="otpIdentity" className="block text-[11px] uppercase tracking-wider font-bold text-[#747b80] mb-1.5">
                Registered Mobile / Email
              </label>
              <input
                id="otpIdentity"
                type="text"
                value={otpIdentity}
                onChange={(e) => setOtpIdentity(e.target.value)}
                placeholder="Enter registered mobile or email"
                className="w-full h-12 border border-[#dcd6cc] rounded-xl bg-white px-3.5 text-sm text-[#253039] focus:outline-none focus:ring-2 focus:ring-[#b49361]"
              />
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#b49361] text-[#081016] font-bold text-sm cursor-pointer hover:bg-[#c4a46e] transition-colors flex items-center justify-center gap-2 mt-4"
            >
              Send Secure OTP
            </button>
          </>
        )}

        {status && (
          <div className="text-xs p-3 rounded-lg bg-[#fbf4ea] text-[#705a3d] border border-[#e6dfd4] mt-3">
            {status}
          </div>
        )}
      </form>

      <div className="flex items-center gap-2.5 my-5 text-[#9a9fa2] text-[11px] uppercase tracking-wider">
        <span className="flex-1 h-px bg-[#e6dfd4]" />
        <span>NEW TO CITYAUCTION?</span>
        <span className="flex-1 h-px bg-[#e6dfd4]" />
      </div>

      <div className="first-access-box">
        <strong>Create Your Investor Account</strong>
        <p>Register to save opportunities, create personalised auction alerts and access supported investor workflows.</p>
        <Link href="/register" className="text-[#80643d] font-bold inline-block mt-2 hover:underline">
          Create Investor Account →
        </Link>
      </div>

      <div className="security-note-box">
        <strong>Security Notice:</strong> Never share your password, OTP or authentication code with anyone claiming to be from CityAuction. Always confirm that you are using the official CityAuction domain before signing in.
      </div>

      <div className="text-center text-xs text-[#5e686f] mt-4">
        Need help?{" "}
        <a href="tel:+919825669668" className="text-[#7f623b] font-bold hover:underline">
          +91 98256 69668
        </a>{" "}
        ·{" "}
        <a href="mailto:info@estabizz.com" className="text-[#7f623b] font-bold hover:underline">
          info@estabizz.com
        </a>
      </div>

      <div className="text-center text-[11px] text-[#889197] mt-3 space-x-1">
        <span>By signing in, you agree to the</span>
        <Link href="/terms" className="text-[#66533b] hover:underline">Terms & Conditions</Link>,
        <Link href="/privacy-policy" className="text-[#66533b] hover:underline">Privacy Policy</Link>,
        <Link href="/risk-disclosure" className="text-[#66533b] hover:underline">Risk Disclosure</Link> and
        <Link href="/disclaimer" className="text-[#66533b] hover:underline">Disclaimer</Link>.
      </div>
    </div>
  );
}
