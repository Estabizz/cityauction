"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Gavel,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  VolumeX,
  ArrowUpRight,
  Sparkles,
  Building2,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { BiddingRoomState, LiveBidRecord } from "@/services/bidding.service";
import { EmdCheckoutModal } from "@/components/payments/emd-checkout-modal";

interface BiddingRoomClientProps {
  initialState: BiddingRoomState;
}

export function BiddingRoomClient({ initialState }: BiddingRoomClientProps) {
  const [state, setState] = useState<BiddingRoomState>(initialState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedBidAmount, setSelectedBidAmount] = useState<number>(initialState.nextMinBid);
  const [customBidInput, setCustomBidInput] = useState<string>(initialState.nextMinBid.toString());
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);
  const [emdModalOpen, setEmdModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialState.timeRemainingSeconds);
  const [serverTime, setServerTime] = useState<string>("");

  const prevHighestBidRef = useRef<number>(initialState.currentHighestBid);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio synthesize sound effects using Web Audio API
  const playChime = useCallback((type: "new_bid" | "outbid" | "win") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "new_bid") {
        // High double ding
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.1); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "outbid") {
        // Warning descending tone
        osc.frequency.setValueAtTime(440.0, now); // A4
        osc.frequency.setValueAtTime(349.23, now + 0.15); // F4
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio context may be restricted by browser until user gesture
    }
  }, [soundEnabled]);

  // Update clock & countdown locally every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));

      const now = new Date();
      setServerTime(
        now.toLocaleTimeString("en-IN", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Poll server state every 3 seconds for real-time live sync
  const fetchLiveState = useCallback(async () => {
    try {
      setSyncing(true);
      const res = await fetch(`/api/bidding/${state.auction.id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.state) {
        const newState: BiddingRoomState = data.state;
        setState(newState);
        setSecondsRemaining(newState.timeRemainingSeconds);

        // Sound alert if highest bid changed
        if (newState.currentHighestBid > prevHighestBidRef.current) {
          const isMeLeading =
            newState.currentHighestBidderAlias === newState.userEligibility.userAlias;
          if (isMeLeading) {
            playChime("new_bid");
          } else {
            playChime("outbid");
          }
          prevHighestBidRef.current = newState.currentHighestBid;
        }

        // Adjust selected next bid if user was lagging
        if (selectedBidAmount < newState.nextMinBid) {
          setSelectedBidAmount(newState.nextMinBid);
          setCustomBidInput(newState.nextMinBid.toString());
        }
      }
    } catch (err) {
      console.error("Polling error:", err);
    } finally {
      setSyncing(false);
    }
  }, [state.auction.id, selectedBidAmount, playChime]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveState();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchLiveState]);

  // Format countdown
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const isUrgent = secondsRemaining > 0 && secondsRemaining <= 300; // Final 5 minutes
  const isExpired = secondsRemaining <= 0;

  // Handle Quick Increment Click
  const handleIncrement = (multiplier: number) => {
    const base = Math.max(state.currentHighestBid, state.auction.reservePrice);
    const amount = base + state.auction.bidIncrement * multiplier;
    setSelectedBidAmount(amount);
    setCustomBidInput(amount.toString());
    setBidError(null);
  };

  // Handle Custom Bid Change
  const handleCustomInputChange = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10) || 0;
    setCustomBidInput(val);
    setSelectedBidAmount(num);
    setBidError(null);
  };

  // Submit Bid API Call
  const executeBid = async () => {
    setSubmittingBid(true);
    setBidError(null);
    setBidSuccess(null);

    try {
      const res = await fetch("/api/bidding/place-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId: state.auction.id,
          amount: selectedBidAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit statutory bid.");
      }

      setConfirmModalOpen(false);
      setBidSuccess(data.message);
      if (data.state) {
        setState(data.state);
        setSecondsRemaining(data.state.timeRemainingSeconds);
        prevHighestBidRef.current = data.state.currentHighestBid;
        setSelectedBidAmount(data.state.nextMinBid);
        setCustomBidInput(data.state.nextMinBid.toString());
      }
      playChime("new_bid");
      setTimeout(() => setBidSuccess(null), 5000);
    } catch (err: any) {
      setBidError(err.message || "An unexpected error occurred placing your bid.");
    } finally {
      setSubmittingBid(false);
    }
  };

  const isUserLeading =
    state.currentHighestBidderAlias === state.userEligibility.userAlias;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Institutional Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb & Auction ID */}
          <div className="flex items-center gap-3">
            <Link
              href={`/auctions/${state.auction.id}`}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              ← Back to Details
            </Link>
            <span className="text-slate-700">|</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {state.auction.auctionNumber}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Live Bidding Active</span>
            </div>
          </div>

          {/* Clock, Status & Sound Toggles */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
              <Clock className="h-3.5 w-3.5 text-primary-400" />
              <span>{serverTime || "Syncing IST..."}</span>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition flex items-center gap-1.5 ${
                soundEnabled
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
              title={soundEnabled ? "Mute audio alerts" : "Enable sound alerts"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden sm:inline text-[11px]">{soundEnabled ? "Audio On" : "Muted"}</span>
            </button>

            {/* User Eligibility Tag */}
            <div className="flex items-center gap-2">
              {state.userEligibility.isAdmitted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-950/70 border border-emerald-600/50 text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  {state.userEligibility.userAlias} (Verified Bidder)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setEmdModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-950/60 border border-amber-600/50 text-amber-300 hover:bg-amber-900/60 transition cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Observer Mode (Deposit EMD)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Urgent 5-Min Extension Warning Banner */}
        {isUrgent && !isExpired && (
          <div className="bg-gradient-to-r from-red-950/90 via-red-900/80 to-amber-950/90 border border-red-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-200">
                  SARFAESI Auto-Extension Window Triggered!
                </h4>
                <p className="text-xs text-red-300/90 mt-0.5">
                  Less than 5 minutes remaining. Any qualifying bid submitted will extend the
                  auction by 5 minutes to prevent last-second sniping.
                </p>
              </div>
            </div>
            {state.autoExtensionCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/30 text-red-200 border border-red-500/40 shrink-0">
                {state.autoExtensionCount} Extension{state.autoExtensionCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Top Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">
              Reserve Price
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-200">
              {formatCurrency(state.auction.reservePrice)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">
              Min Bid Increment
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
              +{formatCurrency(state.auction.bidIncrement)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">
              Total Bids Placed
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-slate-200">
              {state.totalBids} Bids
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">
              Mandatory EMD
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-400">
              {formatCurrency(state.auction.emd)}
            </span>
          </div>
        </div>

        {/* 2-Column Core Bidding Engine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 Cols): Live H1 Display, Countdown & Action Deck */}
          <div className="lg:col-span-2 space-y-6">
            {/* Master Countdown Card */}
            <div
              className={`rounded-2xl border p-6 text-center transition-all ${
                isExpired
                  ? "bg-slate-900 border-slate-800"
                  : isUrgent
                  ? "bg-red-950/40 border-red-600/50 shadow-red-950/50 shadow-2xl ring-1 ring-red-500/30"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-2">
                {isExpired ? "Auction Officially Ended" : "Time Remaining for Live Bidding"}
              </span>

              {isExpired ? (
                <div className="py-2 text-2xl font-bold text-slate-300">
                  AUCTION CLOSED
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 sm:gap-4 font-mono font-bold text-3xl sm:text-5xl text-white py-1">
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 sm:px-4 py-2">
                    <span className="tabular-nums">{String(hours).padStart(2, "0")}</span>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Hours</span>
                  </div>
                  <span className="text-slate-600">:</span>
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 sm:px-4 py-2">
                    <span className="tabular-nums">{String(minutes).padStart(2, "0")}</span>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Mins</span>
                  </div>
                  <span className="text-slate-600">:</span>
                  <div
                    className={`rounded-xl px-3 sm:px-4 py-2 border ${
                      isUrgent
                        ? "bg-red-900/50 border-red-500 text-red-200"
                        : "bg-slate-800/80 border-slate-700/60"
                    }`}
                  >
                    <span className="tabular-nums">{String(seconds).padStart(2, "0")}</span>
                    <span className="text-[10px] text-slate-400 block font-sans uppercase">Secs</span>
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>Closing Date:</span>
                <span className="text-slate-300 font-medium">
                  {new Date(state.auction.endDateTime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
                {state.isAutoExtended && (
                  <span className="text-amber-400 font-semibold">(Auto-Extended)</span>
                )}
              </div>
            </div>

            {/* Current Highest Bid (H1) Card */}
            <div
              className={`rounded-2xl border p-6 relative overflow-hidden transition-all ${
                isUserLeading
                  ? "bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/60 shadow-emerald-950/40 shadow-2xl"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              {isUserLeading && (
                <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 border-b border-l border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  YOU ARE CURRENTLY THE HIGHEST BIDDER (H1)
                </div>
              )}

              <div className="space-y-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Current Highest Bid (H1)
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                    {formatCurrency(state.currentHighestBid)}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Reserve Met
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <span>Leading Bidder:</span>
                  <span
                    className={`font-mono font-bold ${
                      isUserLeading ? "text-emerald-400" : "text-amber-300"
                    }`}
                  >
                    {state.currentHighestBidderAlias}
                    {isUserLeading ? " (You)" : ""}
                  </span>
                  {!isUserLeading && state.userEligibility.isAdmitted && (
                    <span className="text-red-400 font-medium ml-2">
                      (You have been outbid)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bidding Control Panel */}
            {state.userEligibility.isAdmitted ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-primary-400" />
                    <h3 className="font-bold text-white text-base">
                      Place Statutory Bid
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    Min valid bid:{" "}
                    <strong className="text-emerald-400 font-mono">
                      {formatCurrency(state.nextMinBid)}
                    </strong>
                  </span>
                </div>

                {bidSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{bidSuccess}</span>
                  </div>
                )}

                {bidError && (
                  <div className="p-3 bg-red-950/60 border border-red-600/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{bidError}</span>
                  </div>
                )}

                {/* Quick Increment Buttons */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold block">
                    Quick Increment Presets
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[1, 2, 5, 10].map((multiplier) => {
                      const amount =
                        state.currentHighestBid + state.auction.bidIncrement * multiplier;
                      const isSelected = selectedBidAmount === amount;
                      return (
                        <button
                          key={multiplier}
                          type="button"
                          disabled={isExpired}
                          onClick={() => handleIncrement(multiplier)}
                          className={`p-3 rounded-xl border text-left transition ${
                            isSelected
                              ? "bg-primary/20 border-primary text-white ring-1 ring-primary"
                              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                          } disabled:opacity-50 cursor-pointer`}
                        >
                          <span className="block text-[11px] text-slate-400">
                            +{multiplier}x ({formatCurrency(state.auction.bidIncrement * multiplier)})
                          </span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-white block mt-0.5">
                            {formatCurrency(amount)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Bid Input & Primary CTA */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-sm">
                        ₹
                      </span>
                      <input
                        type="text"
                        disabled={isExpired}
                        value={customBidInput}
                        onChange={(e) => handleCustomInputChange(e.target.value)}
                        placeholder={`Min ${state.nextMinBid}`}
                        className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold text-base focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isExpired || selectedBidAmount < state.nextMinBid}
                      onClick={() => setConfirmModalOpen(true)}
                      className="px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      <Gavel className="h-4 w-4" />
                      Submit Statutory Bid
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Statutory Rule: Bids placed are binding irrevocable contracts under SARFAESI Act Rule 9.
                    Server timestamp logged by CityAuction is final.
                  </p>
                </div>
              </div>
            ) : (
              /* Observer Mode Callout */
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30 shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      You are in Observer (View-Only) Mode
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      To place binding bids in this live auction room, you must submit your KYC
                      and deposit the statutory Earnest Money Deposit (EMD) of{" "}
                      <strong className="text-white">
                        {formatCurrency(state.auction.emd)}
                      </strong>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmdModalOpen(true)}
                    className="px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-600 transition shadow-md text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Deposit EMD to Unlock Bidding
                  </button>
                  <Link
                    href="/dashboard/kyc"
                    className="px-4 py-3 bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl hover:bg-slate-700 transition text-xs flex items-center gap-1.5"
                  >
                    Review KYC Documents
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Live Bid Audit Log Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">
                    Live Bidding Stream & Audit Log
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{syncing ? "Updating..." : "Real-Time Ledger"}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="pb-2 font-medium">Time (IST)</th>
                      <th className="pb-2 font-medium">Bidder ID</th>
                      <th className="pb-2 font-medium">Bid Amount</th>
                      <th className="pb-2 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {state.bids.map((bid) => (
                      <tr
                        key={bid.id}
                        className={`transition-colors ${
                          bid.isUserBid ? "bg-primary/10" : "hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="py-2.5 text-slate-400">{bid.timeFormatted}</td>
                        <td className="py-2.5 font-bold">
                          <span
                            className={
                              bid.isUserBid ? "text-emerald-400" : "text-slate-300"
                            }
                          >
                            {bid.bidderAlias}
                            {bid.isUserBid ? " (You)" : ""}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold text-white">
                          {bid.formattedAmount}
                        </td>
                        <td className="py-2.5 text-right">
                          {bid.status === "LEADING" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              H1 (Highest)
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">
                              Surpassed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Collateral Snapshot & Recovery Officer */}
          <div className="space-y-6">
            {/* Collateral Snapshot */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mortgaged Collateral Asset
              </h4>

              {state.auction.primaryImage && (
                <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-800">
                  <img
                    src={state.auction.primaryImage}
                    alt={state.auction.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h5 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                  {state.auction.title}
                </h5>
                <p className="text-xs text-slate-400 mt-1">
                  {state.auction.city}, {state.auction.state}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Possession Type:</span>
                  <span className="font-semibold text-slate-200">
                    {state.auction.possessionStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lender Bank:</span>
                  <span className="font-semibold text-slate-200">
                    {state.auction.organizationName}
                  </span>
                </div>
              </div>

              <Link
                href={`/auctions/${state.auction.id}`}
                target="_blank"
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                Inspect Tender Notices & Docs
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Authorised Recovery Officer Hotline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Authorised Officer Helpline
                </h4>
              </div>

              <div className="text-xs space-y-1">
                <span className="font-bold text-white block">
                  {state.auction.officerName || "Recovery Officer In-Charge"}
                </span>
                <span className="text-slate-400 block text-[11px]">
                  Stressed Assets Recovery Branch (SARB)
                </span>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                {state.auction.officerPhone && (
                  <a
                    href={`tel:${state.auction.officerPhone}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    <span>{state.auction.officerPhone}</span>
                  </a>
                )}
                {state.auction.officerEmail && (
                  <a
                    href={`mailto:${state.auction.officerEmail}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition truncate"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">{state.auction.officerEmail}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Statutory Compliance Rules */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-[11px] text-slate-400 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>SARFAESI Statutory Rules</span>
              </div>
              <p>
                1. <strong>Irrevocable Commitment:</strong> Bids cannot be retracted once submitted.
              </p>
              <p>
                2. <strong>25% Payment Mandate:</strong> The H1 bidder must pay 25% of the total purchase price (including EMD) by the close of the next working day.
              </p>
              <p>
                3. <strong>Anti-Sniping:</strong> All bids submitted within the final 5 minutes trigger an automatic 5-minute extension.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Bid Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/20 text-primary rounded-xl border border-primary/30">
                <Gavel className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Statutory Bid
                </h3>
                <p className="text-xs text-slate-400">
                  {state.auction.auctionNumber}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Your Bid Amount
              </span>
              <span className="text-3xl font-black font-mono text-emerald-400 block tabular-nums">
                {formatCurrency(selectedBidAmount)}
              </span>
              <span className="text-[11px] text-slate-400 block">
                Increment: +{formatCurrency(selectedBidAmount - state.currentHighestBid)}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              By confirming, you submit a legally binding offer under SARFAESI Act Rule 9.
              Failure to honor winning bids incurs forfeiture of the ₹{formatCurrency(state.auction.emd)} EMD.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-800 text-slate-300 font-semibold rounded-xl hover:bg-slate-700 transition text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingBid}
                onClick={executeBid}
                className="flex-1 py-2.5 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 transition shadow text-xs flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {submittingBid ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm & Place Bid
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMD Checkout Modal for Observer Bidders */}
      <EmdCheckoutModal
        isOpen={emdModalOpen}
        onClose={() => setEmdModalOpen(false)}
        auction={{
          id: state.auction.id,
          auctionNumber: state.auction.auctionNumber,
          title: state.auction.title,
          emd: state.auction.emd,
          reservePrice: state.auction.reservePrice,
          bankName: state.auction.organizationName,
        }}
        onSuccess={() => {
          fetchLiveState();
        }}
      />
    </div>
  );
}
