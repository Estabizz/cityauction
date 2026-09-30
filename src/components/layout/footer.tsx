import Link from "next/link";

export function Footer() {
  return (
    <footer className="estabizz-footer">
      <div className="estabizz-container">
        <div className="footer-top-grid">
          {/* Brand Intro Column */}
          <div className="footer-intro space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#091118] border border-[#b49361]/80 text-[#d9c39c] flex items-center justify-center font-serif text-2xl font-bold">
                C
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-white leading-none">
                  CityAuction
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#aeb9c1] mt-1">
                  Auction · Assets · Capital · Resolution
                </div>
              </div>
            </div>

            <p className="text-xs text-[#aab3ba] leading-relaxed max-w-sm pt-2">
              CityAuction is an auction and asset opportunity ecosystem connecting buyers,
              investors, institutional sellers, developers and strategic capital.
            </p>

            <p className="text-xs text-[#d5bd95] font-semibold">
              A venture of Estabizz Fintech Private Limited
            </p>

            <div className="footer-contact-box text-xs space-y-1">
              <strong className="text-white block font-semibold">Contact CityAuction</strong>
              <div className="text-[#aab3ba]">
                <a href="tel:+919825669668" className="hover:text-white transition-colors">
                  +91 98256 69668
                </a>
              </div>
              <div className="text-[#aab3ba]">
                <a href="mailto:info@estabizz.com" className="hover:text-white transition-colors">
                  info@estabizz.com
                </a>
              </div>
              <span className="text-[11px] text-gray-400 block pt-1 leading-normal">
                Gyan Marg, PDPU Road, Raysan, Gandhinagar, Gujarat – India
              </span>
            </div>
          </div>

          {/* Col 1: Explore Auctions */}
          <div>
            <h4>Explore Auctions</h4>
            <Link href="/auctions">All Opportunities</Link>
            <Link href="/auctions?auctionType=SARFAESI">SARFAESI Auctions</Link>
            <Link href="/auctions?auctionType=DRT">DRT Auctions</Link>
            <Link href="/auctions?auctionType=ARC">ARC Auctions</Link>
            <Link href="/auctions?auctionType=IBC">IBC / Liquidation</Link>
          </div>

          {/* Col 2: Buyer Services */}
          <div>
            <h4>Buyer Services</h4>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/#alerts">Personalised Alerts</Link>
            <Link href="/how-it-works">Before You Bid</Link>
            <Link href="/how-it-works">Due Diligence Support</Link>
            <Link href="/#contact">Investor Desk</Link>
          </div>

          {/* Col 3: Institutional */}
          <div>
            <h4>Institutional</h4>
            <Link href="/liquidate-an-asset">Liquidate an Asset</Link>
            <Link href="/liquidate-an-asset#services">Institutional Services</Link>
            <Link href="/liquidate-an-asset#dataroom">Buyer Data Room</Link>
            <Link href="/#contact">Institutional Desk</Link>
          </div>

          {/* Col 4: Special Opportunities */}
          <div>
            <h4>Special Opportunities</h4>
            <Link href="/customs-auction">Customs Auctions</Link>
            <Link href="/next-chapter">Next Chapter</Link>
            <Link href="/next-chapter#companies">Companies / Business Sale</Link>
            <Link href="/next-chapter#developers">Projects / JV Opportunities</Link>
            <Link href="/auctions?category=OTHER">Going Concern Opportunities</Link>
          </div>

          {/* Col 5: Company */}
          <div>
            <h4>Company</h4>
            <Link href="/about">About CityAuction</Link>
            <Link href="/how-it-works">How CityAuction Works</Link>
            <Link href="/#contact">Contact Us</Link>
            <Link href="/resources/faqs">FAQs</Link>
            <Link href="/resources">Insights & Resources</Link>
          </div>
        </div>

        {/* Regulatory Platform Disclosure */}
        <div className="disclosure-box">
          <strong className="text-[#c9d2d7] block mb-1">Platform Disclosure:</strong>
          CityAuction operates as an auction-information, marketplace, buyer-discovery and
          transaction-support platform. Unless expressly stated for a particular transaction,
          CityAuction is not the owner, lender, secured creditor, Liquidator, Recovery Officer,
          Customs authority, auctioning authority or e-auction service provider in respect of a
          listed asset. Auctions and statutory sale processes are conducted by the competent
          institution, authorised stakeholder or appointed auction platform, as applicable. Users
          should independently review the relevant notice, title, encumbrances, possession status,
          dues, litigation, physical condition, eligibility, compliance requirements and other
          material matters before participating. Professional legal, valuation, financing or other
          specialised services, where offered, remain subject to engagement with appropriately
          eligible professionals or institutions and their applicable terms.
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          <div>
            © 2026 CityAuction. A venture of Estabizz Fintech Private Limited. All rights
            reserved.
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs text-[#aab3ba]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>·</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
            <span>·</span>
            <Link href="/risk-disclosure" className="hover:text-white transition-colors">
              Risk Disclosure
            </Link>
            <span>·</span>
            <Link
              href="/verified-information-policy"
              className="hover:text-white transition-colors"
            >
              Verified Information Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
