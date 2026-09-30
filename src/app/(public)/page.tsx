"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Search State
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState("");
  const [budget, setBudget] = useState("");
  const [channel, setChannel] = useState("");

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (assetType) {
      const typeMap: Record<string, string> = {
        Residential: "RESIDENTIAL",
        Commercial: "COMMERCIAL",
        Industrial: "INDUSTRIAL",
        "Land / Plot": "LAND",
        "Plant & Machinery": "OTHER",
        "Business / Going Concern": "OTHER",
      };
      params.set("category", typeMap[assetType] || assetType.toUpperCase());
    }
    if (channel) {
      const channelMap: Record<string, string> = {
        SARFAESI: "SARFAESI",
        DRT: "DRT",
        ARC: "NPA",
        "IBC / Liquidation": "NPA",
        Customs: "OTHER",
        "Government / Court": "OTHER",
      };
      params.set("auctionType", channelMap[channel] || "SARFAESI");
    }
    if (budget) {
      if (budget === "Below ₹25 Lakh") params.set("maxPrice", "2500000");
      if (budget === "₹25–50 Lakh") {
        params.set("minPrice", "2500000");
        params.set("maxPrice", "5000000");
      }
      if (budget === "₹50 Lakh–₹1 Crore") {
        params.set("minPrice", "5000000");
        params.set("maxPrice", "10000000");
      }
      if (budget === "₹1–5 Crore") {
        params.set("minPrice", "10000000");
        params.set("maxPrice", "50000000");
      }
      if (budget === "₹5 Crore+") params.set("minPrice", "50000000");
    }

    router.push(`/auctions?${params.toString()}`);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactMobile,
          email: contactEmail || "not-provided@cityauction.com",
          subject: enquiryType || "General Auction & Asset Enquiry",
          message: contactMessage || "No message provided",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setContactStatus(
          "Thank you. Your enquiry has been received and routed to the relevant CityAuction desk. An advisor will contact you within 1 business day."
        );
        setContactName("");
        setContactMobile("");
        setContactEmail("");
        setEnquiryType("");
        setContactMessage("");
      } else {
        setContactStatus(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      setContactStatus(
        "Enquiry captured successfully. Our team will contact you shortly."
      );
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main id="mainContent">
      {/* 1. HERO SECTION */}
      <section className="hero-wrapper">
        <div className="estabizz-container hero-grid">
          <div>
            <div className="eyebrow-text">The auction & asset opportunity ecosystem</div>
            <h1 className="font-serif-heading text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[0.92] text-white mt-4 tracking-tight">
              See Beyond the Auction.<br />
              <em className="text-[#dbc39a] not-italic font-medium">
                Discover What It Could Become.
              </em>
            </h1>

            <p className="hero-copy-text">
              Discover institutional auction assets. Evaluate opportunities. Reach serious
              buyers. Liquidate assets. Explore Customs auctions. Find capital, investors or
              strategic partners for businesses and projects.
            </p>

            <div className="hero-promise-box">
              Every asset has a story. The right buyer, capital or strategy can change what
              happens next.
            </div>

            <div className="hero-routes-tags">
              <Link href="/auctions" className="hero-route-tag hover:border-[#d9c39c] transition-colors">
                Buy / Invest
              </Link>
              <Link href="/liquidate-an-asset" className="hero-route-tag hover:border-[#d9c39c] transition-colors">
                Liquidate an Asset
              </Link>
              <Link href="/customs-auction" className="hero-route-tag hover:border-[#d9c39c] transition-colors">
                Customs Auctions
              </Link>
              <Link href="/next-chapter" className="hero-route-tag hover:border-[#d9c39c] transition-colors">
                Company / Project Capital
              </Link>
            </div>

            <div className="actions-row">
              <Link className="btn-pill btn-gold" href="/auctions">
                Explore Auction Opportunities
              </Link>
              <a className="btn-pill btn-ghost" href="#help">
                See Where CityAuction Can Help
              </a>
            </div>
          </div>

          {/* Search Card */}
          <form className="hero-card-box" onSubmit={handleSearchSubmit}>
            <div className="eyebrow-text">Find an opportunity</div>
            <h3 className="font-serif-heading text-2xl font-semibold mt-2 text-[#182129]">
              Start with What You Are Looking For.
            </h3>
            <p className="text-xs text-[#6f777d] mt-1">
              Search institutional auction opportunities by location, asset class, budget and channel.
            </p>

            <div className="search-form-grid">
              <div className="field-custom">
                <label htmlFor="location">Location</label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select location</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Delhi">Delhi / NCR</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div className="field-custom">
                <label htmlFor="assetType">Asset Type</label>
                <select
                  id="assetType"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                >
                  <option value="">Select asset type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Land / Plot">Land / Plot</option>
                  <option value="Plant & Machinery">Plant & Machinery</option>
                  <option value="Business / Going Concern">Business / Going Concern</option>
                </select>
              </div>

              <div className="field-custom">
                <label htmlFor="budget">Budget</label>
                <select
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Any budget</option>
                  <option value="Below ₹25 Lakh">Below ₹25 Lakh</option>
                  <option value="₹25–50 Lakh">₹25–50 Lakh</option>
                  <option value="₹50 Lakh–₹1 Crore">₹50 Lakh–₹1 Crore</option>
                  <option value="₹1–5 Crore">₹1–5 Crore</option>
                  <option value="₹5 Crore+">₹5 Crore+</option>
                </select>
              </div>

              <div className="field-custom">
                <label htmlFor="channel">Auction Channel</label>
                <select
                  id="channel"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                >
                  <option value="">All channels</option>
                  <option value="SARFAESI">SARFAESI</option>
                  <option value="DRT">DRT</option>
                  <option value="ARC">ARC</option>
                  <option value="IBC / Liquidation">IBC / Liquidation</option>
                  <option value="Customs">Customs</option>
                  <option value="Government / Court">Government / Court</option>
                </select>
              </div>
            </div>

            <button className="btn-pill btn-dark w-full mt-4" type="submit">
              Search Opportunities
            </button>
            <div className="text-[11px] text-gray-500 mt-2 text-center">
              Connected to 12,000+ active statutory Indian bank & NPA opportunities.
            </div>
          </form>
        </div>
      </section>

      {/* 2. CREDIBILITY & METRICS */}
      <div className="metrics-wrapper">
        <div className="estabizz-container">
          <div className="metrics-card-grid">
            <div className="metric-box">
              <strong>Since 2016</strong>
              <span>Journey in auction-market services</span>
            </div>
            <div className="metric-box">
              <strong>100+</strong>
              <span>Banks & institutions across our experience</span>
            </div>
            <div className="metric-box">
              <strong>5,000+</strong>
              <span>Auction properties / opportunities across our experience</span>
            </div>
            <div className="metric-box">
              <strong>5,000+</strong>
              <span>Buyer & investor network</span>
            </div>
          </div>
          <div className="metrics-note-text">
            Figures reflect cumulative promoter/team experience and network, including
            engagements prior to the launch of CityAuction.
          </div>
        </div>
      </div>

      {/* 3. WHERE CITYAUCTION CAN HELP */}
      <section className="estabizz-section white-bg" id="help">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Where CityAuction can help you</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                What Brings You to CityAuction?
              </h2>
              <p className="lead-text mt-3">
                Whatever side of the opportunity you are on, start here.
              </p>
            </div>
          </div>

          <div className="help-grid-custom">
            <article className="help-card-box">
              <div>
                <small>01 · Buyers & Investors</small>
                <h3>I Want to Buy an Auction Asset</h3>
                <p>
                  Discover residential, commercial, industrial, land, machinery and other
                  institutional auction assets across multiple legal and sale channels.
                </p>
              </div>
              <Link href="/auctions">Explore Auctions →</Link>
            </article>

            <article className="help-card-box">
              <div>
                <small>02 · Investor Desk</small>
                <h3>I Found an Asset and Need Help Evaluating It</h3>
                <p>
                  Access optional auction-notice interpretation, legal due diligence,
                  title/encumbrance review, valuation, inspection and bidder-support services.
                </p>
              </div>
              <Link href="/how-it-works">Understand the Journey →</Link>
            </article>

            <article className="help-card-box">
              <div>
                <small>03 · Personalised Alerts</small>
                <h3>I Don&apos;t Want to Keep Searching Every Day</h3>
                <p>
                  Create a mandate around location, asset class, institution, budget or auction
                  type and receive matched opportunities through supported channels.
                </p>
              </div>
              <a href="#alerts">Create Your Mandate →</a>
            </article>

            <article className="help-card-box">
              <div>
                <small>04 · Banks / NBFCs / ARCs / Liquidators</small>
                <h3>I Need Buyers for an Asset</h3>
                <p>
                  Structured asset presentation, buyer discovery, bidder engagement, inspection
                  coordination, auction connectivity and institutional MIS.
                </p>
              </div>
              <Link href="/liquidate-an-asset">Open Institutional Desk →</Link>
            </article>

            <article className="help-card-box">
              <div>
                <small>05 · Customs Opportunities</small>
                <h3>I Want to Explore Customs Auction Goods</h3>
                <p>
                  Understand Customs lots, MSTC process, inspection, EMD, bidding, compliance,
                  payment and lifting before participating through the authorised route.
                </p>
              </div>
              <Link href="/customs-auction">Enter Customs Auction →</Link>
            </article>

            <article className="help-card-box">
              <div>
                <small>06 · Companies & Developers</small>
                <h3>My Company or Project Needs a Buyer, Investor or JV Partner</h3>
                <p>
                  For businesses or projects facing capital pressure but still holding
                  value—explore company sale, project sale, JV, investor induction, asset
                  monetisation or promoter exit.
                </p>
              </div>
              <Link href="/next-chapter">Explore Next Chapter →</Link>
            </article>
          </div>

          <div className="quote-block">
            “An auction may be one route to value. CityAuction is built around the wider question:
            what is the right next move for the asset?”
          </div>
        </div>
      </section>

      {/* 4. FEATURED OPPORTUNITIES */}
      <section className="estabizz-section ivory-bg" id="auctions">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Explore live opportunities</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                Start with the Asset You Understand.
              </h2>
              <p className="lead-text mt-3">
                CityAuction should never invent inventory for presentation. These gateways are
                designed to route visitors into the live auction marketplace.
              </p>
            </div>
          </div>

          <div className="opp-grid-custom">
            <article className="opp-card-custom">
              <div className="opp-img-box one" />
              <div className="opp-body-box">
                <div className="opp-top-box">
                  <span className="opp-type-label">Residential & Commercial</span>
                  <span className="opp-badge-label">Live Marketplace</span>
                </div>
                <h3 className="font-serif-heading text-xl font-bold mt-2 text-[#182129]">
                  Property Auction Opportunities
                </h3>
                <p className="text-xs text-[#6f777d] mt-2">
                  Explore residential, commercial, office, retail and mixed-use auction assets
                  across supported locations and institutions.
                </p>
                <div className="opp-foot-box">
                  <span className="text-gray-500">Search live inventory</span>
                  <Link href="/auctions?category=RESIDENTIAL">Explore Properties →</Link>
                </div>
              </div>
            </article>

            <article className="opp-card-custom">
              <div className="opp-img-box two" />
              <div className="opp-body-box">
                <div className="opp-top-box">
                  <span className="opp-type-label">Land & Development</span>
                  <span className="opp-badge-label">Live Marketplace</span>
                </div>
                <h3 className="font-serif-heading text-xl font-bold mt-2 text-[#182129]">
                  Land & Development Opportunities
                </h3>
                <p className="text-xs text-[#6f777d] mt-2">
                  Discover plots, land parcels, development sites and larger asset-backed
                  opportunities suitable for investors and developers.
                </p>
                <div className="opp-foot-box">
                  <span className="text-gray-500">Search live inventory</span>
                  <Link href="/auctions?category=LAND">Explore Land →</Link>
                </div>
              </div>
            </article>

            <article className="opp-card-custom">
              <div className="opp-img-box three" />
              <div className="opp-body-box">
                <div className="opp-top-box">
                  <span className="opp-type-label">Industrial & Business</span>
                  <span className="opp-badge-label">Live Marketplace</span>
                </div>
                <h3 className="font-serif-heading text-xl font-bold mt-2 text-[#182129]">
                  Industrial & Business Assets
                </h3>
                <p className="text-xs text-[#6f777d] mt-2">
                  Factories, warehouses, plant & machinery, industrial land and selected business /
                  going-concern opportunities.
                </p>
                <div className="opp-foot-box">
                  <span className="text-gray-500">Search live inventory</span>
                  <Link href="/auctions?category=INDUSTRIAL">Explore Industrial →</Link>
                </div>
              </div>
            </article>
          </div>

          <div className="actions-row mt-8">
            <Link className="btn-pill btn-dark" href="/auctions">
              View All Auction Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CLOSING SOON */}
      <section className="estabizz-section white-bg" id="closing-soon">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Time-sensitive opportunities</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                Closing Soon.
              </h2>
              <p className="lead-text mt-3">
                A production feed should surface auctions whose inspection, EMD or bidding
                deadlines are approaching—without using artificial countdowns or fabricated
                urgency.
              </p>
            </div>
          </div>

          <div className="why-grid-custom">
            <article className="why-card-box">
              <h3>EMD Deadline Approaching</h3>
              <p>
                Route buyers directly to live opportunities whose EMD window is nearing closure.
              </p>
              <div className="mt-4">
                <Link className="btn-pill btn-light text-xs" href="/auctions?sort=closing_soon">
                  View EMD Deadlines
                </Link>
              </div>
            </article>

            <article className="why-card-box">
              <h3>Inspection Window Closing</h3>
              <p>
                Surface assets where physical inspection remains possible but the permitted
                window is limited.
              </p>
              <div className="mt-4">
                <Link className="btn-pill btn-light text-xs" href="/auctions?sort=date_asc">
                  View Inspection Deadlines
                </Link>
              </div>
            </article>

            <article className="why-card-box">
              <h3>Auction Closing Soon</h3>
              <p>
                Show live auctions approaching their scheduled close, subject to the auction
                platform&apos;s extension rules.
              </p>
              <div className="mt-4">
                <Link className="btn-pill btn-light text-xs" href="/auctions?status=CLOSING_SOON">
                  View Closing Soon
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 6. SEARCH BY ASSET TYPE */}
      <section className="estabizz-section ivory-bg" id="asset-types">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Explore by asset</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                Search the Way Buyers Actually Think.
              </h2>
              <p className="lead-text mt-3">
                Some buyers start with the legal route. Many start with the asset itself.
              </p>
            </div>
          </div>

          <div className="universe-grid-custom">
            {[
              { type: "Residential", desc: "Flats, houses, villas and residential projects.", href: "/auctions?category=RESIDENTIAL" },
              { type: "Commercial", desc: "Offices, retail, commercial premises and mixed-use assets.", href: "/auctions?category=COMMERCIAL" },
              { type: "Industrial", desc: "Factories, warehouses and industrial premises.", href: "/auctions?category=INDUSTRIAL" },
              { type: "Land", desc: "Plots, development land and larger land parcels.", href: "/auctions?category=LAND" },
              { type: "Plant & Machinery", desc: "Industrial equipment, machinery and production assets.", href: "/auctions?category=OTHER" },
              { type: "Vehicles", desc: "Commercial and other vehicle auction opportunities.", href: "/auctions?category=OTHER" },
              { type: "Warehouse / Logistics", desc: "Storage, logistics and industrial-use assets.", href: "/auctions?category=INDUSTRIAL" },
              { type: "Going Concern", desc: "Selected business and enterprise-sale opportunities.", href: "/auctions?category=OTHER" },
            ].map((item) => (
              <Link
                key={item.type}
                href={item.href}
                className="help-card-box hover:border-[#b49361] transition-all"
                style={{ minHeight: "auto" }}
              >
                <div>
                  <small>Asset</small>
                  <h3 className="text-xl mt-1 text-[#182129]">{item.type}</h3>
                  <p className="text-xs text-[#6f777d] mt-1">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AUCTION UNIVERSE */}
      <section className="estabizz-section dark-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Auction universe</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                One Marketplace. Multiple Auction Channels.
              </h2>
              <p className="lead-text mt-3 text-[#aeb9c1]">
                CityAuction brings together opportunities arising through enforcement, recovery,
                insolvency, liquidation and institutional disposal.
              </p>
            </div>
          </div>

          <div className="universe-grid-custom">
            <article className="universe-card-box">
              <h3>SARFAESI Auctions</h3>
              <p>Secured assets offered by eligible lenders under recovery proceedings.</p>
            </article>
            <article className="universe-card-box">
              <h3>Bank & NBFC NPA Assets</h3>
              <p>Residential, commercial, industrial and other secured assets offered for stressed-credit recovery.</p>
            </article>
            <article className="universe-card-box">
              <h3>ARC Auctions</h3>
              <p>Assets offered by Asset Reconstruction Companies as part of recovery or resolution strategies.</p>
            </article>
            <article className="universe-card-box">
              <h3>DRT / Recovery Officer</h3>
              <p>Assets arising through debt-recovery proceedings and Recovery Officer processes.</p>
            </article>
            <article className="universe-card-box">
              <h3>NCLT & IBC Opportunities</h3>
              <p>Assets and businesses arising through insolvency resolution and liquidation processes.</p>
            </article>
            <article className="universe-card-box">
              <h3>Liquidation Auctions</h3>
              <p>Assets offered by Liquidators and other authorised stakeholders.</p>
            </article>
            <article className="universe-card-box">
              <h3>Customs Auctions</h3>
              <p>Goods and cargo offered through authorised Customs auction/e-tender processes.</p>
            </article>
            <article className="universe-card-box">
              <h3>Government & Court Auctions</h3>
              <p>Selected opportunities arising through government authorities and judicial processes.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS (BUILT FOR BOTH SIDES) */}
      <section className="estabizz-section white-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">How CityAuction works</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                Built for Both Sides of the Transaction.
              </h2>
              <p className="lead-text mt-3">
                A buyer wants clarity before committing capital. An institution wants the asset
                to reach people capable of acquiring it. CityAuction supports both journeys.
              </p>
            </div>
          </div>

          <div className="pathway-grid-custom">
            <article className="pathway-card-box">
              <small>For Buyers & Investors</small>
              <h3>Discover → Understand → Evaluate → Participate → Acquire</h3>
              <p>
                Find relevant opportunities, understand the notice, assess the asset and access
                optional professional support before entering the authorised auction process.
              </p>
              <div className="flow-pills">
                <span>Discover</span>
                <span>Understand</span>
                <span>Evaluate</span>
                <span>Prepare</span>
                <span>Participate</span>
                <span>Complete</span>
              </div>
              <div className="actions-row">
                <Link className="btn-pill btn-dark text-xs" href="/how-it-works">
                  See Buyer Journey
                </Link>
              </div>
            </article>

            <article className="pathway-card-box alt-dark">
              <small>For Institutional Sellers</small>
              <h3>Onboard → Position → Reach → Engage → Connect → Resolve</h3>
              <p>
                Structure the opportunity, improve presentation, reach relevant buyers, manage
                interest and connect eligible participants to the authorised sale route.
              </p>
              <div className="flow-pills">
                <span>Onboard</span>
                <span>Position</span>
                <span>Distribute</span>
                <span>Engage</span>
                <span>Qualify</span>
                <span>Report</span>
              </div>
              <div className="actions-row">
                <Link className="btn-pill btn-gold text-xs" href="/liquidate-an-asset">
                  See Institutional Journey
                </Link>
              </div>
            </article>
          </div>

          <div className="quote-block">
            “An auction notice tells you what is being sold. Understanding tells you whether it
            deserves your capital.”
          </div>
        </div>
      </section>

      {/* 9. ASSET LIQUIDATION & INSTITUTIONAL SERVICES */}
      <section className="estabizz-section dark-bg" id="institutions">
        <div className="estabizz-container spotlight-grid">
          <div className="spot-copy">
            <div className="eyebrow-text">Asset liquidation & institutional services</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-white mt-3">
              Your Asset Deserves More Than Publication. It Deserves the Right Buyer Market.
            </h2>
            <p className="text-sm text-[#b8c3ca] leading-relaxed mt-4">
              CityAuction supports Banks, NBFCs, ARCs, Liquidators, Insolvency Professionals,
              Financial Institutions, Corporates and asset owners around the authorised sale
              process.
            </p>
            <p className="text-sm text-[#b8c3ca] leading-relaxed mt-3">
              The objective is not merely more visibility. It is relevant visibility—reaching the
              buyer universe that can understand and acquire the asset.
            </p>
            <div className="flow-pills mt-6">
              <span>Asset Onboarding</span>
              <span>Positioning</span>
              <span>Buyer Discovery</span>
              <span>Lead Qualification</span>
              <span>Auction Connectivity</span>
              <span>Institutional MIS</span>
            </div>
            <div className="actions-row mt-6">
              <Link className="btn-pill btn-gold text-xs" href="/liquidate-an-asset">
                Liquidate an Asset
              </Link>
              <a className="btn-pill btn-ghost text-xs" href="#contact">
                Speak with Institutional Desk
              </a>
            </div>
          </div>

          <div className="spotlight-cards-grid">
            <div className="spot-card-box">
              <strong>Asset Onboarding</strong>Structure asset information, documents and transaction particulars.
            </div>
            <div className="spot-card-box">
              <strong>Asset Presentation</strong>Translate technical information into investor-friendly opportunity profiles.
            </div>
            <div className="spot-card-box">
              <strong>Investor Discovery</strong>Reach relevant businesses, developers, HNIs and strategic buyers.
            </div>
            <div className="spot-card-box">
              <strong>Lead Management</strong>Capture enquiries, inspection requests and bidder intent.
            </div>
            <div className="spot-card-box">
              <strong>Data Room Support</strong>Organise seller-approved information for qualified buyer review.
            </div>
            <div className="spot-card-box">
              <strong>Institutional MIS</strong>Track buyer reach, funnel activity and transaction status.
            </div>
          </div>
        </div>
      </section>

      {/* 10. CITYAUCTION CUSTOMS */}
      <section className="estabizz-section ivory-bg">
        <div className="estabizz-container spotlight-grid">
          <div className="spot-copy">
            <div className="eyebrow-text">CityAuction Customs</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129] mt-3">
              Goods Enter the Auction. Prepared Buyers See the Opportunity.
            </h2>
            <p className="text-sm text-[#6f777d] leading-relaxed mt-4">
              Customs auctions require more than finding a low starting price. Buyers need to
              understand the lot, inspection window, eligibility, compliance, EMD, bidding
              mechanics, post-bid payment and lifting obligations.
            </p>
            <p className="text-sm text-[#6f777d] leading-relaxed mt-3">
              CityAuction Customs is designed to make those opportunities easier to discover and
              harder to misunderstand—while the authorised Customs/MSTC process remains the
              official route for bidding and completion.
            </p>
            <div className="actions-row mt-6">
              <Link className="btn-pill btn-dark text-xs" href="/customs-auction">
                Explore Customs Auctions
              </Link>
            </div>
          </div>

          <div className="spotlight-cards-grid">
            <div className="spot-card-box">
              <strong>Customs Lot Discovery</strong>Search by port, goods category, auction stage and opportunity type.
            </div>
            <div className="spot-card-box">
              <strong>MSTC Process Guidance</strong>Understand registration, EMD, bidding and post-bid steps.
            </div>
            <div className="spot-card-box">
              <strong>Inspection Readiness</strong>Know what to verify before bidding on “as-is-where-is” goods.
            </div>
            <div className="spot-card-box">
              <strong>Compliance Intelligence</strong>Identify product-specific approvals, NOCs or restrictions that may matter.
            </div>
          </div>
        </div>
      </section>

      {/* 11. NEXT CHAPTER */}
      <section className="estabizz-section white-bg">
        <div className="estabizz-container spotlight-grid">
          <div className="spot-copy">
            <div className="eyebrow-text">CityAuction Next Chapter</div>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129] mt-3">
              Some Assets Need a Buyer.<br />
              Some Businesses Need a Next Chapter.
            </h2>
            <p className="text-sm text-[#6f777d] leading-relaxed mt-4">
              A project can stop because capital stopped. A business can face financial pressure
              while still owning substantial value.
            </p>
            <p className="text-sm text-[#6f777d] leading-relaxed mt-3">
              Sometimes the answer is not another auction. It is the right investor, partner,
              developer or new owner.
            </p>
            <div className="quote-block">
              “We do not begin with what went wrong. We begin with what still holds value.”
            </div>
            <div className="actions-row mt-6">
              <Link className="btn-pill btn-dark text-xs" href="/next-chapter">
                Explore Next Chapter
              </Link>
            </div>
          </div>

          <div className="spotlight-cards-grid">
            <div className="spot-card-box">
              <strong>For Companies</strong>Business sale, investor induction, asset monetisation, strategic partner or promoter exit.
            </div>
            <div className="spot-card-box">
              <strong>For Developers</strong>Project sale, JV, development partner, completion capital or sponsor transition.
            </div>
            <div className="spot-card-box">
              <strong>For Investors</strong>Strategic acquisitions, land-backed opportunities and special-situation investments.
            </div>
            <div className="spot-card-box">
              <strong>Private Mandates</strong>Confidential or NDA-led outreach where the situation should not be publicly marketed.
            </div>
          </div>
        </div>
      </section>

      {/* 12. PERSONALISED ALERTS */}
      <section className="estabizz-section ivory-bg" id="alerts">
        <div className="estabizz-container">
          <div className="alerts-box-custom">
            <div className="alerts-copy-box">
              <div className="eyebrow-text">Personalised auction alerts</div>
              <h3 className="font-serif-heading text-2xl sm:text-4xl font-semibold text-white mt-3">
                Define the Opportunity Once. Let CityAuction Keep Looking.
              </h3>
              <p className="text-xs text-[#b7c1c8] leading-relaxed mt-3">
                Property. Industrial asset. Customs lot. Business. Project. Tell us the mandate—not
                just the search terms. When matching opportunities are identified through supported
                inventory and workflows, CityAuction can surface them through enabled channels.
              </p>
              <div className="quote-block text-sm">
                “Create the mandate once. Spend your time evaluating—not repeatedly searching.”
              </div>
            </div>

            <div className="alerts-form-box">
              <h3 className="font-serif-heading text-2xl font-semibold text-[#182129]">
                Build Your Opportunity Mandate
              </h3>
              <div className="alert-tags-grid">
                <div className="alert-tag-item">City / Location</div>
                <div className="alert-tag-item">Asset Category</div>
                <div className="alert-tag-item">Investment Budget</div>
                <div className="alert-tag-item">Bank / Institution</div>
                <div className="alert-tag-item">Auction Type</div>
                <div className="alert-tag-item">Reserve Price Range</div>
                <div className="alert-tag-item">Customs Goods Category</div>
                <div className="alert-tag-item">Company / Project Opportunity</div>
              </div>
              <div className="actions-row mt-6">
                <a className="btn-pill btn-dark text-xs" href="#contact">
                  Create an Opportunity Alert
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. WHY CITYAUCTION */}
      <section className="estabizz-section white-bg">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Why CityAuction</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                The Market Has Information. What It Often Lacks Is Connection.
              </h2>
              <p className="lead-text mt-3">
                CityAuction is being built to connect information, assets, buyers, institutions and
                strategic capital—without pretending that one portal or one listing can replace
                judgement, due diligence or the authorised transaction process.
              </p>
            </div>
          </div>

          <div className="why-grid-custom">
            <article className="why-card-box">
              <h3>Opportunity Over Distress</h3>
              <p>
                An asset may have entered the market through recovery, liquidation or financial
                pressure. Its future value is defined by what the next owner can do with it.
              </p>
            </article>

            <article className="why-card-box">
              <h3>Clarity Over Noise</h3>
              <p>
                More listings do not automatically create better decisions. We focus on
                structuring and explaining the information that matters.
              </p>
            </article>

            <article className="why-card-box">
              <h3>Knowledge Before Participation</h3>
              <p>
                Reserve price alone should never drive an acquisition. Title, possession, dues,
                condition, compliance and transaction terms matter.
              </p>
            </article>

            <article className="why-card-box">
              <h3>Relevant Reach Over Mere Visibility</h3>
              <p>
                For sellers, the objective is to reach people capable of acquiring the asset—not
                simply more people.
              </p>
            </article>

            <article className="why-card-box">
              <h3>Defined Verification</h3>
              <p>
                <span className="verified-info-span font-semibold text-emerald-800">
                  Verified Auction Information{" "}
                  <span className="tip-icon" tabIndex={0} aria-label="Verification explanation">
                    i
                    <span>
                      Key auction particulars have been cross-checked against an
                      institution-provided or published auction notice. This does not
                      independently certify title, possession, encumbrances, valuation or physical
                      condition.
                    </span>
                  </span>
                </span>{" "}
                means source-level verification—not automatic certification of title, possession or
                market value.
              </p>
            </article>

            <article className="why-card-box">
              <h3>Human Judgement Remains Central</h3>
              <p>
                Technology can reduce friction and organise information. The investment or sale
                decision remains with the relevant parties.
              </p>
            </article>
          </div>

          <div className="actions-row mt-8">
            <Link className="btn-pill btn-dark" href="/about">
              About CityAuction
            </Link>
            <Link className="btn-pill btn-light" href="/how-it-works">
              How CityAuction Works
            </Link>
          </div>
        </div>
      </section>

      {/* 14. CONTACT CITYAUCTION */}
      <section className="estabizz-section ivory-bg" id="contact">
        <div className="estabizz-container">
          <div className="section-head-grid">
            <div>
              <div className="eyebrow-text">Contact CityAuction</div>
            </div>
            <div>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-semibold tracking-tight text-[#182129]">
                Tell Us What You Are Trying to Find, Sell, Resolve or Take Forward.
              </h2>
              <p className="lead-text mt-3">
                Whether you are an investor, institutional seller, developer, Liquidator, company
                promoter or first-time auction buyer, start with the situation. We will route the
                enquiry to the relevant CityAuction desk.
              </p>
            </div>
          </div>

          <div className="contact-wrap-box">
            <div className="contact-info-panel">
              <div className="eyebrow-text">CityAuction</div>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-semibold mt-3 text-white">
                A venture of Estabizz Fintech Private Limited
              </h2>
              <p className="text-xs text-[#b8c3ca] leading-relaxed mt-3">
                Auction discovery, investor support, institutional asset liquidation, Customs
                auction intelligence and strategic opportunity pathways.
              </p>

              <div className="contact-items-list text-xs">
                <div className="contact-item-row">
                  <small>Phone</small>
                  <strong>
                    <a href="tel:+919825669668" className="hover:underline">
                      +91 98256 69668
                    </a>
                  </strong>
                </div>

                <div className="contact-item-row">
                  <small>Email</small>
                  <strong>
                    <a href="mailto:info@estabizz.com" className="hover:underline">
                      info@estabizz.com
                    </a>
                  </strong>
                </div>

                <div className="contact-item-row">
                  <small>Office</small>
                  <strong className="leading-snug">
                    Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India
                  </strong>
                </div>

                <div className="contact-item-row">
                  <small>What can we discuss?</small>
                  <strong className="leading-snug">
                    Auction Opportunity · Due Diligence · Liquidation · Customs Auction · Company /
                    Project Next Chapter
                  </strong>
                </div>
              </div>

              <div className="actions-row mt-6">
                <a className="btn-pill btn-gold text-xs" href="tel:+919825669668">
                  Call CityAuction
                </a>
                <a
                  className="btn-pill btn-ghost text-xs"
                  href="https://wa.me/919825669668"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
                <a
                  className="btn-pill btn-ghost text-xs"
                  href="mailto:info@estabizz.com?subject=Book%20a%20CityAuction%20Discussion"
                >
                  Book a Discussion
                </a>
              </div>
            </div>

            {/* Live Enquiry Form */}
            <form className="contact-form-panel" onSubmit={handleContactSubmit}>
              <div className="eyebrow-text">Start a conversation</div>
              <h3 className="font-serif-heading text-2xl font-semibold mt-2 text-[#182129]">
                How Can CityAuction Help?
              </h3>
              <p className="text-xs text-[#6f777d] mt-1">
                Choose the area closest to your requirement. All enquiries are routed securely.
              </p>

              {contactStatus && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{contactStatus}</span>
                </div>
              )}

              <div className="contact-inputs-grid">
                <div className="field-custom">
                  <label htmlFor="contactName">Name</label>
                  <input
                    id="contactName"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="field-custom">
                  <label htmlFor="contactMobile">Mobile</label>
                  <input
                    id="contactMobile"
                    inputMode="tel"
                    required
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="field-custom">
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>

                <div className="field-custom">
                  <label htmlFor="enquiryType">I Need Help With</label>
                  <select
                    id="enquiryType"
                    required
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                  >
                    <option value="">Select requirement</option>
                    <option value="Buying / Investing in Auction Asset">Buying / Investing in Auction Asset</option>
                    <option value="Due Diligence / Investor Support">Due Diligence / Investor Support</option>
                    <option value="Personalised Auction Alert">Personalised Auction Alert</option>
                    <option value="Liquidating an Asset">Liquidating an Asset</option>
                    <option value="Customs Auction">Customs Auction</option>
                    <option value="Company Sale / Investor / Promoter Exit">Company Sale / Investor / Promoter Exit</option>
                    <option value="Developer Project Sale / JV / Investor">Developer Project Sale / JV / Investor</option>
                    <option value="Institutional Partnership">Institutional Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="field-custom full">
                  <label htmlFor="contactMessage">Tell Us the Situation</label>
                  <textarea
                    id="contactMessage"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us what you are looking for, what asset/project/company is involved, location and what outcome you want to explore."
                  />
                </div>
              </div>

              <button
                className="btn-pill btn-dark w-full mt-4 flex items-center justify-center gap-2"
                type="submit"
                disabled={contactLoading}
              >
                {contactLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Enquiry...
                  </>
                ) : (
                  <>
                    Submit Enquiry
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
