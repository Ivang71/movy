# Outsourced Insurance and Real Estate Operations Services: Candidates for an AI-Native Services Firm (US, as of October 2026)

Scope note: ~22 recurring back-office services across insurance and real estate were enumerated and scored against the eight fixed criteria. Evidence is from vendor pricing pages, state regulators, trade/academic sources and practitioner guides fetched October 2026. Older sources are dated inline. Market-size databases (IBISWorld, Grand View, Mordor) blocked automated fetches, so dollar market sizes are a documented gap except where a primary or trade source gave a figure. The web-search budget for this session was exhausted after the first search round; subsequent evidence came from direct fetches of known URLs, so several targeted gaps (listed per section) could not be closed.

---

## Key Question 1: Which insurance back-office services carry outcome-tied pricing, need no adjuster license, and are served by fragmented small providers?

### Takeaway
Only two insurance services are genuinely outcome-priced: subrogation recovery (15–33% contingency on recoveries) and workers' comp medical bill review (20–30% of savings). Subrogation is served by a fragmented mix of law firms and recovery vendors and needs no adjuster license per the sources found (though litigation requires lawyers and collection-licensing was not verified), while bill review is dominated by large cost-containment vendors. Every other insurance service (TPA claims, COI tracking, premium audit, policy checking, submission intake, loss runs, independent adjusting, agency VAs) is priced per claim, per vendor, per policy or per hour, and the licensed ones (TPA, independent adjusting) are the most regulated.

### Cited Findings

**Third-party claims administration (self-insured employers, MGAs)**
- Typical workers' comp TPA per-claim fees: indemnity $995–$1,200, medical-only $130–$150; on 1,000 claims the total ranges from $346,250 to $612,000 depending on how claims are classified; the claims fee now covers roughly 60% of a TPA's expenses — [PRIMA (Public Risk Management Association)](https://primacentral.org/education/podcasts-blog/workers-compensation-self-insurance-avoiding-the-pricing-pitfalls-part-1-of-2/)
- Example economics: $1,000 per claim x 10 lost-time claims = $10,000/yr for a small self-insured; a large employer with 150 lost-time claims pays ~$150,000/yr; a "higher quality" TPA at $1,500/case adds $75,000; many buyers treat TPA service "as a commodity with virtually no difference from vendor to vendor" — [IRMI](https://www.irmi.com/articles/expert-commentary/third-party-administrators-quality-versus-price)
- Per-claim fee is the most popular choice among self-insureds; service lengths are offered as 12-month, 24-month, life-of-partnership or life-of-claim (1996 paper; structure persists per PRIMA/IRMI above) — [Casualty Actuarial Society, Jeng 1996](https://www.casact.org/sites/default/files/database/dpp_dpp96_96dpp137.pdf)
- Health-plan TPAs charge a base per-employee-per-month fee plus percentage-of-savings fees; out-of-network "shared savings" can be "up to 50% of the difference between the billed rate and the paid rate" (e.g., $30,000 fee on a $100,000 claim negotiated to $1,500); one independent TPA caps such fees at $25,000; in some regions there is "maybe one TPA in your geographic area, maybe two"; small employers are told "go pound sand" when they demand transparency — [PMC / Paying in the dark (2025–26)](https://pmc.ncbi.nlm.nih.gov/articles/PMC13505514/)
- Nearly two-thirds of covered workers are in self-funded health plans; TPAs treat provider contracts as proprietary and rarely disclose them to employers — [Georgetown CHIR](https://chir.georgetown.edu/third-party-administrators-the-middlemen-of-self-funded-health-insurance/)
- Licensing: NAIC Model Law 90-1 requires TPAs that underwrite, adjust or settle life/annuity/health claims to be licensed; most states require minimum net worth (some $50,000) and a surety bond — [CGAA summary](https://www.cgaa.org/article/third-party-administrator-license); Washington requires every TPA handling self-insured employers' claims to be licensed (no fee) and lists "certified claim administrators" per WAC 296-15-360 — [WA L&I FAQ](https://lni.wa.gov/insurance/self-insurance/third-party-administrator-licensing/third-party-administrator-licensing-faq); New York requires non-carrier TPAs to "be licensed to adjust claims by the New York State Department of Financial Services," post a Self-Insurer's Representative's Bond, and designate a qualifying officer who passes a written exam and oral review (3-year license, no fee) — [NY WCB](https://www.wcb.ny.gov/content/main/TPA/HowToBecomeTPA.jsp); Oregon charges $45 per 2-year TPA license, requires $500,000 minimum E&O, and exempts workers' comp TPAs from the TPA license but requires them to register with the Workers' Compensation Division and hold a general lines adjuster license — [Oregon DFR](https://dfr.oregon.gov/business/licensing/insurance/license-types/pages/third-party-administrator.aspx); Oklahoma: "No person shall act as an administrator unless the person holds a valid license" — [Oklahoma Insurance Dept](https://www.oid.ok.gov/regulated-entities/regulated-industry-services/third-party-administrators/); Connecticut requires licensing or registration — [CT CID](https://portal.ct.gov/cid/licensing/licensing-resource-library/third-party-administrators)

**Certificate of insurance (COI) tracking / vendor compliance**
- Self-service COI platforms cost $3–$10 per vendor per year; full-service $10–$30. CertFocus: self-service $6–$8/vendor/yr with a $7,500 annual minimum, full-service $13–$29 with a $10,000 minimum, vendor-pay $85–$150/vendor/yr, implementation $3,500–$4,800. Competitors: C2COI $15–$40, myCOI $30–$60, SmartCompliance $40–$80 per vendor. Total spend tiers: entry $800–$2,000/yr (<50 vendors), professional $2,500–$10,000 (50–500 vendors), enterprise $10,000–$50,000+. Buyers: contractors, construction companies, property managers — [Vertikal RMS pricing guide (2026)](https://www.vertikalrms.com/article/how-much-does-coi-tracking-software-cost-2026-pricing-guide/)
- bcs charges ~$0.95/vendor/month with a free tier up to 25 vendors and ships a "RiskBot" AI agent; Jones (full-service, CRE and construction) has raised ~$40M including a $15M Series B in Jan 2025 and claims 99.7–99.9% audit accuracy with AI agents; TrustLayer uses RPA and partners with Nationwide; CertFocus launched its "Hawk-I" AI tool in June 2025; myCOI/illumend has "Lumie" AI; "every platform now uses AI marketing language" — [BCS comparison (2026)](https://www.getbcs.com/blog/top-certificate-of-insurance-tracking-companies)
- Enterprise contractor-prequalification platforms charge subcontractors $450–$900/yr (Avetta) and $875+ (ISNetworld) (search-snippet level, from Vertikal's platform comparison) — [Vertikal RMS platform comparison](https://www.vertikalrms.com/article/best-coi-tracking-software-2026-top-coi-platforms-for-contractors/)

**Premium audit services**
- Outsourced premium audit support is sold per FTE ("subscription per FTE, fully loaded per-FTE managed teams, and engagement-based pricing"), claiming 30–50% loaded-cost reduction vs domestic capacity; clients are carriers, MGAs and brokers; tasks include payroll/sales exposure review, subcontractor verification, class-code checks — [OwnGCC](https://owngcc.com/feeds/service/insurance-premium-audit-outsourcing)
- Premium audit coordination BPO targets carriers "managing large audit volumes," MGAs with delegated authority and wholesalers; no pricing published — [SelectSys](https://www.selectsys.com/insurance-bpo/premium-audit-coordination)
- Vendor-run audits are delivered as remote/phone, virtual and on-site; carriers are the buyer; outsourcing "converts fixed costs into a predictable operational expense" — [ISG](https://isg-se.com/how-outsourced-premium-audits-reduce-risk-and-overhead/)

**Subrogation recovery**
- Outsourced subrogation vendors typically work at "contingency fees...15–30% of recovery"; "$15–20 billion in recoverable subrogation dollars goes uncollected annually"; Arbitration Forums members filed 2.4 million demands worth $26.3 billion in 2024; Travelers recovered $6.9 billion over ten years; AI vendors named: Shift Technology (30% more opportunities identified), CCC Intelligent Solutions, CLARA Analytics, EXL — [InsuranceIndustry.ai](https://insuranceindustry.ai/billions-left-behind-how-ai-rewrites-the-economics-of-subrogation/)
- A 33% contingency is presented as standard; 15% and 18% are "cut-rate"; recovery vendors (as opposed to law firms) "owe no fiduciary duty"; "a genuine threat of litigation must always be hanging" to settle at full value (2015) — [Claims Journal](https://www.claimsjournal.com/news/national/2015/11/05/266822.htm)
- Common attorney subrogation fee: 25% if no suit filed, 33⅓% if suit filed — [Matthiesen, Wickert & Lehrer FAQ](https://www.mwl-law.com/faqs/)
- Health-plan subrogation: vendors "typically work, at least in part, on a contingency fee and receive a percentage of recoveries"; recoveries were roughly 0.2–0.3% of benefit payments (est. $1.7–$2.5B in 2010); 78% of surveyed plans processed subrogation internally and ~11% of cases went to external vendors (DOL/EBSA report, data 2009–2011) — [US DOL EBSA](https://www.dol.gov/sites/dolgov/files/EBSA/researchers/analysis/health-and-welfare/healthcare-subrogation-trends-and-practices.pdf)
- Overpayment-recovery vendors for health plans charge 20–30% of recoveries — [Withum](https://www.withum.com/resources/overpayment-recovery-the-often-overlooked-oversight-responsibility-of-plan-sponsors/)

**Policy checking for brokers**
- Patra AI SaaS subscriptions "start at $99/month" with unlimited user seats and a 14-day trial, covering a 900+ point checklist, 12 commercial lines and "85% of commercial insurance policy volume" (Jan 21, 2026); SaaS customers report >85% time reductions; one customer cut annual policy-checking expense by $300,000; full-service clients are on "fixed transactional pricing"; 99.5% verified accuracy — [Fintech Global (Jan 2026)](https://fintech.global/2026/01/21/patra-ai-expands-automation-to-cover-85-of-commercial-policies/); "every subscription includes guided human verification" — [Patra blog](https://www.patracorp.com/resources/blogs/ai-subscription-pricing-for-agencies/)
- ReSource Pro launched AI-driven "Policy Insights ExpressCheck" in May 2024; the company has 9,000+ employees, 1,000+ carrier/broker/MGA clients and >95% retention — [ReSource Pro](https://www.resourcepro.com/news/resource-pro-unveils-new-ai-driven-policy-checking-service/)

**Submission intake and quoting support (agencies, MGAs)**
- Patra sells MGAs "Quote Compare AI" (70% faster quote turnaround), policy checking against delegated-authority parameters (75% time reduction) and policy data extraction (99%+ accuracy), from "AI-only" to "full-service managed solutions with E&O coverage"; no pricing disclosed — [Patra delegated authority blog](https://www.patracorp.com/insights/blogs/empower-delegated-authority-programs-with-patra-ai/)
- Sixfold (AI submission reading, loss runs, SOVs, risk scoring) lists Guardian, Zurich North America, AXIS, Generali, Skyward Specialty and Mosaic as customers and claims 50% underwriting-efficiency gains; no pricing — [Sixfold](https://www.sixfold.ai/)
- Federato ("AI-native insurance core platform") raised a $100M Series D with Goldman Sachs participation; customers include QBE, Nationwide, Ryan Specialty, Acrisure, Accelerant — [Federato](https://www.federato.ai/)
- Agency VA firms sell "quoting through bind" at $2,349/month per managed VA team tier — [AssistIQ comparison](https://assistiq.io/best-insurance-virtual-assistant-companies)

**Loss run retrieval**
- Loss Run Pro: $29/user/month (150 AOR requests/month), 5,000+ carriers/MGAs, 7,000+ users, 1M+ quarterly requests, 35+ of the top-100 agencies — [Loss Run Pro](https://lossrunpro.com/); RequestLossRun: $15/seat/month, unlimited AOR requests — [RequestLossRun](https://www.requestlossrun.com/)
- Loss-run processing (carrier/MGA side): ReSource Pro charges per document or retainer with 24–48 hour turnaround vs AI tools in minutes; SortSpoke claims 70% reduction in processing time; LossRunGuru is pay-per-use — [SortSpoke](https://sortspoke.com/blog/best-loss-run-processing-tools)

**Medical bill review (workers' comp)**
- Bill review is "typically between 20–30% of the savings"; a $200,000 bill cut to $50,000 at 20% yields a $30,000 fee; self-insured employers bear it as an allocated claim expense — [Risk Management Monitor](https://www.riskmanagementmonitor.com/the-cost-of-savings-checking-medical-bill-review-charges/)
- Historical percent-of-savings ranged 15%–40%; per-bill pricing $9–$15 and per-line $0.70–$1.25; 75–80 million bills nationally per year; payors spent an estimated $12–16 billion on bill review over a decade — [WorkCompCentral](https://ww3.workcompcentral.com/columns/show/id/92b0e40ca7452f0bcad23b5038fa7057j)
- Chubb passes repricing fees at cost, averaging 2.1% of savings for policyholders; employers should expect 20–30% savings on billed medical — [Chubb](https://www.chubb.com/us-en/claims/workers-compensation-claims-services.html); [IRMI](https://www.irmi.com/articles/expert-commentary/achieving-workers-compensation-savings-through-medical-bill-repricing)
- Large incumbents market bill review directly: Enlyte (Mitchell), Optum, Rising Medical, Zurich — [Enlyte](https://www.enlyte.com/solutions/casualty/cost-containment-services/bill-review-workers-comp); [Optum](https://workcompauto.optum.com/industries/workers-compensation/medical-bill-review.html)

**Independent adjusting**
- Fee schedule example: $415 per claim under $14,500, $640 above; adjusters receive 55–70% of the schedule; auto appraisers $50–$90 per claim; licenses for NY, CA, NM and HI improve an adjuster's leverage — [IA Path](https://iapath.com/independent-adjuster-fee-schedule/)
- Day rates $250–$900 in storm deployments; desk review/audit $85–$120 per file-hour; CAT example $375/day plus $185 per file above 8/day; Florida caps public adjuster fees at 10% of non-emergency settlements — [Insurance Adjuster Authority](https://insuranceadjusterauthority.com/adjuster-fee-schedules-and-billing/); [AdjusterPro](https://adjusterpro.com/insurance-adjuster-income/)
- Oregon requires a general lines adjuster license for anyone adjusting workers' comp claims outside an authorized insurer — [Oregon DFR](https://dfr.oregon.gov/business/licensing/insurance/license-types/pages/third-party-administrator.aspx)

**Insurance agency back-office / virtual assistants**
- Published monthly pricing: AssistIQ $897 (20 hrs/wk) or $1,497 (40 hrs/wk); WAGS $1,300 full-time; PeopleBlue $1,499–$2,499; ClearDesk from $2,500; Agency VA $2,349 (licensed and unlicensed teams); hourly: Agency Aid $9–$15, Call Force Global $12–$18, Elevate Teams $14.35–$17.25; tasks are certificate issuance, endorsements, renewals, ACORD apps, policy checking; most providers restrict VAs to "unlicensed scope" — [AssistIQ (self-published ranking)](https://assistiq.io/best-insurance-virtual-assistant-companies)
- Market ranges: $8–$25/hour; retainers $700–$1,500/month; domestic full-time $3,200–$8,000/month vs offshore $1,280–$3,200 — [Silkee Solutions](https://silkeesolutions.com/insurance-virtual-assistant-cost-hourly/); [Stealth Agents](https://stealthagents.com/virtual-assistant-for-insurance-agency)

### Inferences
- Subrogation is the one insurance lane that satisfies all three conditions in the question (outcome-tied, no adjuster license cited, fragmented vendors), but the sources are explicit that credible recoveries depend on a litigation threat, so a law-firm partner (not an adjuster) is the needed "licensed partner."
- Medical bill review is outcome-tied and digital but is sold by carriers/TPAs as a bundled allocated expense, and the named vendors are large (Enlyte, Optum, CorVel-class); a 2–4 person entrant would need a TPA or self-insured channel partner.
- TPA work has the highest per-client revenue but the heaviest licensing (entity license, bond, qualifying officer exam, adjuster licenses in NY/OR), so one licensed partner is not sufficient in multi-state operation.
- COI tracking, policy checking and loss-run retrieval have already been converted to SaaS at $15–$99/month or $1–$30/vendor/year, which removes the service margin.
- Agency VA work is the most fragmented and reachable insurance lane but is hourly/FTE-priced; AI is being layered on by the same VA shops, and Patra/ReSource Pro set the ceiling.

### Gaps
- No per-audit fee for outsourced premium audits (physical vs phone/virtual) was found; vendors (SelectSys, ISG, OwnGCC) publish only FTE/engagement models. Named incumbents (Afirm, Davies, US-Reports) could not be searched after the search budget was exhausted.
- No source found for insured-side workers' comp premium-overcharge recovery (contingency on refunds); treat as unverified.
- No source quantifying historical per-policy prices for outsourced policy checking (pre-AI) to measure the compression against Patra's $99/month.
- No state-by-state count of adjuster-licensing states (AdjusterPro licensing pages returned 403); only NY, CA, NM, HI, TX, OR, WA, FL references were captured.
- No source on collection-agency licensing for non-attorney subrogation vendors.
- MGA-specific outsourcing pricing (per submission) not found.

---

## Key Question 2: Which real estate services are mostly digital, outcome-priced, and not yet absorbed by the big property management platforms?

### Takeaway
Three real estate services are both predominantly digital and priced on outcomes: tenant-side CAM/lease audits (33–50% of recovered overcharges), property tax appeals (25–50% of first-year savings) and, partly, HOA delinquent-assessment collections (owner-paid/contingency; evidence thin). Percentage-of-rent property management and percentage-of-revenue STR management are outcome-tied but carry physical work (maintenance, turnovers) and, for long-term rentals, broker licensing. Lease abstraction, transaction coordination, tenant screening, title search and RUBS are per-unit labor or software prices that AI/SaaS have already compressed or platforms already own.

### Cited Findings

**Property management back office (small landlords/managers)**
- "The property manager earns a management fee, typically eight to twelve percent of collected rent" (NARPM comment letter to FTC, April 2026, as quoted) — [LeaseRunner](https://www.leaserunner.com/blog/how-much-do-property-managers-charge)
- National average management fee 8.49% of rent (722 branches, 80 metros; iPropertyManagement, updated Sept 2022); range 3.75%–14%; 75.3% price as a percentage of rent; flat-fee average $101.04/unit/month; tenant placement 70.6% of one month's rent; lease renewal avg $231.77; setup avg $185.24; inspections avg $106.72; maintenance markup 10–15% (or up to 25%); the top 20 companies hold 7.15% of US rented homes (2024) — [RapidEye summary of iPM/DoorLoop/APM data](https://rapideyeinspections.com/research/property-management-fee-statistics/)
- NARPM's 2022 Financial Benchmark Study: 85–90% of firms use percentage-of-rent pricing; all-in cost 18–20% of gross rent in year one, ~12% in renewal years — [LeaseRunner](https://www.leaserunner.com/blog/how-much-do-property-managers-charge)
- Remote-staffing vendor Anequim reports 1,300+ remote employees placed with 1,000+ property management clients across 50 states, covering maintenance work-order triage, vendor coordination, leasing follow-ups and accounting; pricing not published — [Anequim](https://www.anequim.net/)
- Rollups: Long Lake (General Catalyst "Creation Strategy") raised ~$670M, acquired 18 property/HOA management businesses and reached $100M EBITDA in under two years, with AI agents handling resident inquiries and drafting board materials (April 2026) — [Capital & Clarity](https://capitalandclarity.substack.com/p/the-general-catalyst-behind-15-billion); a second tally lists Long Lake as "HOA/Multi-vertical," 30+ acquisitions, and the $6.3B acquisition of American Express Global Business Travel (May 2026) — [Capital Founders playbook](https://www.capitalfounders.io/playbooks/ai-enabled-roll-ups/chapters/capital-and-players/); UK analogue Dwelly raised £69m led by General Catalyst to roll up letting agencies (8 acquired, £200m+ GMV) — [Sifted](https://sifted.eu/articles/dwelly-general-catalyst-funding-round-rollup-property)

**Lease abstraction and lease administration (commercial tenants)**
- Outsourced abstraction $200–$600 per lease with 24–72 hour turnaround and "outputs varied wildly"; in-house $150–$400 of analyst labor (3–8 hours); AI $0.50–$5 compute per lease plus $15,000–$75,000 annual platform licence; 95%+ accuracy on standard fields; a customer cut review from ~2 hours to 17 minutes per lease — [Kolena](https://www.kolena.com/blog/lease-abstraction-with-ai/)
- Offshore providers $5–$25 per lease (NTrust/REmaapAI, RE BackOffice), US-based $15–$50, in-house $25–$75+; traditional turnaround 2–5 business days; AI first drafts in minutes (March 2026) — [Moraine CRE](https://morainecre.com/resources/comparisons/lease-abstraction-services)
- Basic abstracts (50–60 fields) $150–$200, full-service $250–$400; REBO volume pricing "typically $75–$175 per lease" (search-snippet level; page unreachable) — [Lextract](https://lextract.io/resources/articles/how-much-does-lease-abstraction-cost)
- Leasecake (lease administration SaaS) prices at "less than 1% of rent" for multi-location tenants — [Leasecake](https://www.leasecake.com/pricing)
- Abstria's illustrative model: $175–$300 per outsourced abstract vs $15–$30 AI processing; competitors named Prophia, Kira, Trullion — [Abstria](https://www.abstria.com/blog/lease-abstraction-services-comparison)

**CAM reconciliation / lease audit**
- Tenant-side CAM audit firms "typically charge contingency fees of 30 to 50% of recovered overcharges," with splits from 50/50 to 65/35; tenants commonly recover 3–5% of annual occupancy costs — [CommercialLeaseCost](https://commercialleasecost.com/cam-reconciliation-commercial-lease/); [Wikipedia: Lease audit](https://en.wikipedia.org/wiki/Lease_audit)
- National Lease Advisors: $250 fixed initial review (waived for lease-administration clients), then 33% of recovered savings; hourly available; targets tenants with large portfolios — [National Lease Advisors](https://nationalleaseadvisors.com/lease-audit/)
- "Most CAM audit services operate on a contingency fee basis...payment is contingent upon successful recovery" — [Springbord](https://www.springbord.com/blog/cam-recovery-audit-explained-how-tenants-identify-and-recover-cam-overpayments/)
- RE BackOffice targets multi-location retailers with "50, 200, or 1,000 locations" (franchisees of Wendy's, Subway, Domino's, etc.) and claims unaudited CAM costs retailers "hundreds of thousands of dollars"; no pricing — [REBO blog](https://blog.rebolease.com/how-cam-reconciliation-helps-retailers-identify-and-recover-overcharges-across-store-locations/)

**HOA / community association management**
- Per-door fees commonly $10–$30/month; high-end full-service $30–$50+; small communities face $1,500–$3,000 monthly minimums; Florida fees run 20–40% above the national average due to post-Surfside compliance and CAM licensing — [PricingLink](https://pricinglink.com/knowledge-base/hoa-condo-association-management/how-much-charge-hoa-condo-door/); [MatchHOA](https://www.matchhoa.com/guides/what-management-costs)
- Florida requires a licensed Community Association Manager for any association over 10 units or with a budget over $100,000; boards rebid every 3–5 years; termination usually 60–90 days' notice — [Tenant Evaluation guide](https://blog.tenantevaluation.ai/association-management-pricing-guide/)
- A 200-unit HOA at $18/door = $3,600/month (~$43,000/yr); contracts are 12-month with CPI or fixed escalators; some firms front-load year-one discounts — [Edison Association Management](https://edisonassociationmanagement.com/blog/hoa-management-fees)
- Initiation fees range from a couple of thousand dollars to $30,000; "remote" (financial/administrative only) tiers exist below full-service — [iPropertyManagement](https://ipropertymanagement.com/guides/hoa-management-fees); [HOAManagement.com](https://www.hoamanagement.com/hoa-management-fees/)
- 3,000–4,000 new community associations are being added nationwide in 2026 (CAI Foundation, data as of Dec 31, 2025) — [Foundation for Community Association Research](https://foundation.caionline.org/)

**Title search and abstracting**
- Flat-fee menu: property detail $29, lien report $95, abstract $95, full lien report $195, chain of title $375, expanded/preliminary search $385; performed by "professional abstractors" against county records, with microfilm pulled "at the counter" — [US Title Records](https://www.ustitlerecords.com/title-search-cost/)
- NC example: limited search $55, full 30-year search $85 — [Title Abstracting](http://www.titleabstracting.com/searches)
- Pippin Title sells nationwide (50-state) title searches to title agents, underwriters, lenders and law firms with "as little as 24 hours" turnaround via "proprietary search technology" plus a "nationwide network of ground searchers," integrated with Resware, SoftPro, Qualia; custom quotes — [Pippin Title](https://www.pippintitle.com/)

**Escrow and closing processing**
- Escrow fees typically $1.75–$2.15 per $1,000 of price; not set by law in most states — [Clever](https://listwithclever.com/real-estate-blog/escrow-fees/); Arizona filed schedules show a $175 flat resale escrow fee at one agency and $1,300 for basic residential escrow with purchase mortgage at another, plus $100/hour for unusual work — [AZ DIFI filings: New Land Title](https://difi.az.gov/sites/default/files/0910075_New_Land_Title_Agency_LLC_RF.pdf), [Ontitle Escrow](https://difi.az.gov/sites/default/files/0923900_Ontitle_Escrow_Inc_RF.pdf)
- Washington: escrow agents are licensed under RCW 18.44; a Designated Escrow Officer must pass the Escrow Officer Examination ($168) and the company pays $179.26 application/renewal — [WA DFI](https://dfi.wa.gov/escrow-agents/licensing); California's Escrow Law (Fin. Code §17000 et seq.) covers escrow agents, joint control agents and internet escrow agents, with surety bond forms required — [CA DFPI](https://dfpi.ca.gov/escrow-law/)

**Real estate transaction coordination**
- Human/virtual TC $300–$500 per closed file ("national average in 2026"); in-house TC salary $44,000–$72,000; ListedKit AI $14.99 per intake (first free), "a team doing 20 deals a month is looking at roughly $300 versus $6,000–10,000 monthly"; "some state licensing rules affect what software can and cannot do in a transaction" — [ListedKit](https://www.listedkit.com/resources/ai-vs-virtual-transaction-coordinator)
- Transactly $399/file; CloudCoord AI $149/month solo or $499/month team; 12 files/yr: $3,600–$6,000 human vs $1,788 CloudCoord (checked Sept 13, 2026) — [CloudCoordinator](https://cloudcoordinator.io/transaction-coordinator-cost)
- TCs using AI handle 80–120 transactions/yr vs 50–70 manually; tool pricing: ReBillion $29–$99/mo, SkySlope $49–$149, Dotloop $39–$199, Open to Close $99–$399, Brokermint $99–$299, ListedKit $9.99/transaction — [ReBillion (Feb 2026)](https://rebillion.ai/blog/2026/02/28/ai-transaction-coordinator-tools/)

**Tenant screening**
- $30–$50 per applicant typical; SmartMove $25/$40/$47; RentPrep $29/$49; MyRental $24.99/$37.99; California caps application fees at $62.02 (2025) — [iPropertyManagement](https://ipropertymanagement.com/guides/tenant-screening-costs); [Stessa](https://www.stessa.com/blog/tenant-screening-services/); [Connerth PM](https://connerthpm.com/how-much-does-tenant-screening-cost-in-2026/)

**Property tax appeal**
- Ownwell: 25% contingency in Texas, 35% in Georgia/Pennsylvania, "25–35% of your savings every year"; nothing owed if no reduction — [Ownwell Texas](https://www.ownwell.com/blog/property-tax-protest-companies-cost); [Ownwell Georgia](https://www.ownwell.com/blog/georgia-property-tax-appeal-services-cost); Ownwell reports $774 average annual savings, 88% success rate (2025), 9 states (CA, CO, FL, GA, IL, NY, PA, TX, WA), investors First Round, Wonder Ventures, Founders Collective, Long Journey — [Ownwell About](https://www.ownwell.com/about)
- Competitors: O'Connor & Associates "half of first-year savings" (commercial in 45 states); NTPTS 40%; Texas Protax 40% with $50/parcel minimum; AppealDesk $49 flat fee in all 50 states with an "AI-generated evidence packet"; AppealSeal $100 flat (CA); average savings $1,000–$3,000/yr — [AppealDesk comparison](https://www.appealdesk.com/compare/best-property-tax-appeal-services)
- Texas: "People who assist clients with property tax consulting services or with expert testimony in many cases must be licensed by TDLR" (pre-license education and exam) — [TDLR Property Tax Consultants](https://www.tdlr.texas.gov/ptc/ptc.htm)

**Utility billing for multifamily (RUBS)**
- RUBS setup $0–$500 per property and 50–75% cheaper than submetering; Minnesota caps resident admin fees at $8/month and utility-recovery admin fee at $15/month — [1st Select (MN)](https://www.1stselect.net/what-is-rubs); [MRI Software](https://www.mrisoftware.com/blog/what-is-a-ratio-utility-billing-system/)
- Only Mississippi and Massachusetts do not permit RUBS; the billing vendor remits "all collected amounts and late fees...reduced only by our service fee"; residents pay — [AABS](https://aabs1.com/rubs/)
- Conservice sells expense management, submetering, waste and telecom under a "Utility Experts" team-plus-software model; no pricing published — [Conservice](https://www.conservice.com/)

**Short-term rental management back office**
- Full-service managers 20–30% of gross bookings (up to 35%): Vacasa 25–35%, AvantStay up to 35%, Casago 18%, RedAwning 18%; "half managers" (Evolve) 10–15% covering marketing and messaging while owners keep cleaning/maintenance; AI-assisted TIDY 3.9% with a $19 monthly minimum; on a $100k/yr listing the manager earns $20–30k (traditional), $10–15k (half), ~$3.9k (AI-assisted) — [TIDY (2026)](https://www.tidy.com/blog/a-guide-to-short-term-rental-management-fees)
- AirDNA 2025: commission fees 15–30%; per-booking $50–$150; flat $100–$500/month; full service includes coordinating "routine upkeep and urgent fixes through local contractors" — [Hostfully](https://www.hostfully.com/blog/short-term-rental-management-fees/)
- Co-hosts: messaging-only 10–15%, full-operations 20–25% — [Hostaway](https://www.hostaway.com/blog/airbnb-management-fees-a-complete-breakdown/)

### Inferences
- Tenant-side lease/CAM audit is the cleanest fit in real estate: 100% document work, contingency pricing, no license cited, boutique providers, and AI materially lowers the cost of reading leases and reconciliations without (so far) lowering the contingency rate.
- Property tax appeal is outcome-priced and digital, but residential ARPU is small ($774 avg savings x 25–35% = roughly $190–$270 per property per year) and a $49 flat-fee AI product already exists; commercial/investor portfolios are where the >$20k/client threshold is plausible.
- Long-term rental PM's percentage fee is intact (8–12%) and the market is extremely fragmented (top 20 = 7.15%), but a remote firm must either hold a broker license via a partner or sell to PMs as a back-office vendor, which turns pricing back into labor/FTE (Anequim model).
- STR "half manager" (Evolve-style) at 10–15% of revenue is the one percentage-of-revenue model deliverable remotely; TIDY's 3.9% AI-assisted tier is direct evidence of compression at the bottom.
- HOA management's recurring per-door revenue ($18/door x 200 units = $43k/yr) crosses the revenue threshold and AI rollups (Long Lake) validate margin expansion, but on-site duties, Florida CAM licensing and board sales cycles make it a poor fit for a remote 2–4 person team without acquisitions.

### Gaps
- No pricing found for landlord-side CAM reconciliation outsourcing (per reconciliation/per lease).
- Leasecake, Occupier, Prophia and EliseAI do not publish per-unit pricing; funding figures were not retrievable.
- No source on which states beyond Florida require CAM licenses, which states license abstractors (Oklahoma board returned 503 twice), or which states require broker licenses for STR/long-term PM.
- RUBS vendor per-unit service fees (Conservice, Zego, Livable) not published.
- HOA delinquent-assessment collections (Axela model) could not be verified; the vendor page returned no content.
- No US PM-rollup data beyond Long Lake (Evernest/PURE/Mynd pages did not disclose acquisition counts or investors).

---

## Key Question 3: Where is AI already collapsing the price, and where is it not and why?

### Takeaway
Price collapse is documented in transaction coordination ($300–$500/file to $14.99/file), policy checking (full-service to $99/month SaaS), loss-run retrieval ($15–$29/user/month), lease abstraction ($200–$600 to $5–$50 offshore and $0.50–$5 AI compute), COI tracking ($0.95/vendor/month) and the bottom tier of STR management (3.9%). Prices are holding where the fee is tied to a recovered dollar (subrogation 15–33%, bill review 20–30%, CAM audit 33–50%, tax appeal 25–50%), where regulation and liability sit on the provider (TPA, adjusting, escrow), or where physical labor remains (maintenance, turnovers, field audits).

### Cited Findings
- Transaction coordination: human TC $300–$500/file vs ListedKit $14.99/intake; "roughly $300 versus $6,000–10,000 monthly" for a 20-deal team — [ListedKit](https://www.listedkit.com/resources/ai-vs-virtual-transaction-coordinator); CloudCoord $149/month vs $3,600–$6,000/yr human at 12 files — [CloudCoordinator](https://cloudcoordinator.io/transaction-coordinator-cost); but human TC fees are still quoted at $300–$500 "national average in 2026," i.e., the human price has not yet fallen; the AI alternative sits beside it — same sources. AI raises TC throughput from 50–70 to 80–120 files/yr — [ReBillion](https://rebillion.ai/blog/2026/02/28/ai-transaction-coordinator-tools/)
- Policy checking: Patra SaaS from $99/month with unlimited seats, 85% time reduction, one client saving $300,000/yr — [Fintech Global](https://fintech.global/2026/01/21/patra-ai-expands-automation-to-cover-85-of-commercial-policies/); ReSource Pro ExpressCheck (2024) — [ReSource Pro](https://www.resourcepro.com/news/resource-pro-unveils-new-ai-driven-policy-checking-service/)
- Loss runs: SaaS at $15–$29/user/month with 1M+ quarterly requests on one platform — [Loss Run Pro](https://lossrunpro.com/); [RequestLossRun](https://www.requestlossrun.com/); AI loss-run extraction "minutes (5X faster)" vs ReSource Pro's 24–48 hours — [SortSpoke](https://sortspoke.com/blog/best-loss-run-processing-tools)
- Lease abstraction: $200–$600 outsourced vs $0.50–$5 AI compute (plus platform licence) — [Kolena](https://www.kolena.com/blog/lease-abstraction-with-ai/); offshore $5–$25 — [Moraine CRE](https://morainecre.com/resources/comparisons/lease-abstraction-services)
- COI tracking: $0.95/vendor/month with AI agents and a free tier; all seven leading vendors market AI — [BCS](https://www.getbcs.com/blog/top-certificate-of-insurance-tracking-companies); AI verification "reduces manual costs" — [Vertikal](https://www.vertikalrms.com/article/how-much-does-coi-tracking-software-cost-2026-pricing-guide/)
- STR: AI-assisted manager at 3.9% of bookings vs 20–35% full-service — [TIDY](https://www.tidy.com/blog/a-guide-to-short-term-rental-management-fees)
- Property tax: $49 flat-fee AI evidence packets (AppealDesk) alongside 25–50% contingency incumbents — [AppealDesk](https://www.appealdesk.com/compare/best-property-tax-appeal-services)
- Subrogation: AI vendors (Shift, CCC, CLARA) raise identified opportunities by 30% but the article links AI to carriers' "pricing power," not to lower vendor contingency; outsourced contingency remains 15–30% — [InsuranceIndustry.ai](https://insuranceindustry.ai/billions-left-behind-how-ai-rewrites-the-economics-of-subrogation/); lower contingency does not raise net recovery; litigation threat required — [Claims Journal](https://www.claimsjournal.com/news/national/2015/11/05/266822.htm)
- Bill review: percent-of-savings still 20–30% — [Risk Management Monitor](https://www.riskmanagementmonitor.com/the-cost-of-savings-checking-medical-bill-review-charges/)
- Property management: percentage fee still 8–12% (NARPM to FTC, April 2026) — [LeaseRunner](https://www.leaserunner.com/blog/how-much-do-property-managers-charge); HOA fees intact while Long Lake uses AI agents to expand margins to $100M EBITDA — [Capital & Clarity](https://capitalandclarity.substack.com/p/the-general-catalyst-behind-15-billion)
- Regulatory/liability floors: TPA entity licensing, bonds, qualifying-officer exams and adjuster licensing — [NY WCB](https://www.wcb.ny.gov/content/main/TPA/HowToBecomeTPA.jsp), [Oregon DFR](https://dfr.oregon.gov/business/licensing/insurance/license-types/pages/third-party-administrator.aspx); escrow officer exams and bonds — [WA DFI](https://dfi.wa.gov/escrow-agents/licensing); Patra sells E&O-covered full service above its AI-only tier — [Patra](https://www.patracorp.com/insights/blogs/empower-delegated-authority-programs-with-patra-ai/)
- Physical floors: STR traditional managers run "local field teams" for cleaning/maintenance — [TIDY](https://www.tidy.com/blog/a-guide-to-short-term-rental-management-fees); premium audits include on-site visits — [ISG](https://isg-se.com/how-outsourced-premium-audits-reduce-risk-and-overhead/); title searchers pull microfilm "at the counter" — [US Title Records](https://www.ustitlerecords.com/title-search-cost/); field adjusting fee schedules — [IA Path](https://iapath.com/independent-adjuster-fee-schedule/)

### Inferences
- Collapse happens where the deliverable is a document check with no money at stake for the vendor (TC, policy check, loss runs, abstracts, COIs): the buyer can accept 95–99.5% accuracy with a human review step and SaaS captures the value.
- Prices hold where the vendor is paid from a recovered dollar; AI there improves the vendor's margin (more files per analyst) rather than cutting the client's price, because the client's alternative is zero recovery, not a cheaper tool.
- The "human TC still $300–$500" datapoint suggests compression is a two-tier market (AI tier at 3–5% of human price, human tier flat) rather than a uniform decline; the same pattern appears in STR (3.9% vs 20–35%) and tax appeals ($49 vs 25–50%).

### Gaps
- No time series of outsourced TC, policy-check or abstraction prices exists in the sources; compression is inferred from current side-by-side pricing, not from documented declines.
- No evidence yet that AI has lowered contingency percentages in subrogation, CAM audit or tax appeals; the absence may reflect lag rather than durability.

---

## Key Question 4: What do clients pay per year in each category, with sources?

### Takeaway
Only TPA claims administration, medical bill review for mid-size self-insureds, HOA management (200+ doors), subrogation portfolios, multi-location CAM audits, full-service STR (per listing $20–30k) and PM for landlords with 15+ doors routinely exceed $20,000 per client per year; COI tracking, loss runs, policy-check SaaS, tenant screening, residential tax appeals, RUBS and transaction coordination for individual agents sit in the hundreds to low thousands.

### Cited Findings
- TPA (WC self-insured): 10 lost-time claims x $1,000 = $10,000/yr; 150 claims = $150,000/yr — [IRMI](https://www.irmi.com/articles/expert-commentary/third-party-administrators-quality-versus-price); 1,000 claims = $346,250–$612,000 — [PRIMA](https://primacentral.org/education/podcasts-blog/workers-compensation-self-insurance-avoiding-the-pricing-pitfalls-part-1-of-2/)
- COI tracking: $800–$2,000/yr (<50 vendors), $2,500–$10,000 (50–500), $10,000–$50,000+ enterprise; CertFocus minimums $7,500–$10,000/yr — [Vertikal](https://www.vertikalrms.com/article/how-much-does-coi-tracking-software-cost-2026-pricing-guide/)
- Subrogation: fee is 15–33% of recoveries; a $90,000 claim at 33% yields $29,700 to the vendor (per Claims Journal arithmetic) — [Claims Journal](https://www.claimsjournal.com/news/national/2015/11/05/266822.htm)
- Bill review: $30,000 fee on a single $150,000 saving at 20% — [Risk Management Monitor](https://www.riskmanagementmonitor.com/the-cost-of-savings-checking-medical-bill-review-charges/); or $9–$15 per bill — [WorkCompCentral](https://ww3.workcompcentral.com/columns/show/id/92b0e40ca7452f0bcad23b5038fa7057j)
- Policy checking: from $1,188/yr ($99/month) SaaS — [Fintech Global](https://fintech.global/2026/01/21/patra-ai-expands-automation-to-cover-85-of-commercial-policies/)
- Loss runs: $180–$348/user/yr — [RequestLossRun](https://www.requestlossrun.com/); [Loss Run Pro](https://lossrunpro.com/)
- Agency VA: $10,764–$30,000/yr per dedicated VA ($897–$2,500/month) — [AssistIQ](https://assistiq.io/best-insurance-virtual-assistant-companies)
- Independent adjusting: $415–$640 per property claim to the IA firm — [IA Path](https://iapath.com/independent-adjuster-fee-schedule/)
- Property management: 8–12% of rent plus placement (70.6% of a month) and renewal ($231.77) fees; all-in 18–20% of gross rent in year one — [RapidEye](https://rapideyeinspections.com/research/property-management-fee-statistics/); [LeaseRunner](https://www.leaserunner.com/blog/how-much-do-property-managers-charge)
- Lease abstraction: $200–$600 per lease outsourced; AI platforms $15,000–$75,000/yr licence — [Kolena](https://www.kolena.com/blog/lease-abstraction-with-ai/); Leasecake "<1% of rent" — [Leasecake](https://www.leasecake.com/pricing)
- CAM audit: $250 initial review then 33% of recoveries — [National Lease Advisors](https://nationalleaseadvisors.com/lease-audit/); tenants recover 3–5% of occupancy costs — [CommercialLeaseCost](https://commercialleasecost.com/cam-reconciliation-commercial-lease/)
- HOA: $10–$30/door/month; $1,500–$3,000 monthly minimums ($18,000–$36,000/yr); 200 units at $18 = ~$43,000/yr; initiation up to $30,000 — [PricingLink](https://pricinglink.com/knowledge-base/hoa-condo-association-management/how-much-charge-hoa-condo-door/); [Edison](https://edisonassociationmanagement.com/blog/hoa-management-fees); [iPropertyManagement](https://ipropertymanagement.com/guides/hoa-management-fees)
- Title search: $29–$385 per report — [US Title Records](https://www.ustitlerecords.com/title-search-cost/)
- Escrow: $1.75–$2.15 per $1,000 of price; $175–$1,300 flat examples — [Clever](https://listwithclever.com/real-estate-blog/escrow-fees/); [AZ DIFI](https://difi.az.gov/sites/default/files/0923900_Ontitle_Escrow_Inc_RF.pdf)
- Transaction coordination: $300–$500 per closed file; 12 files = $3,600–$6,000/yr; AI $14.99–$29.98 per file — [CloudCoordinator](https://cloudcoordinator.io/transaction-coordinator-cost); [ListedKit](https://www.listedkit.com/best-tc-software)
- Tenant screening: $25–$75 per applicant — [iPropertyManagement](https://ipropertymanagement.com/guides/tenant-screening-costs)
- Property tax appeal: 25–35% of ~$774 average savings (≈$190–$270 per residential property per year); $1,000–$3,000 average savings in other guides; AppealDesk $49 flat — [Ownwell About](https://www.ownwell.com/about); [AppealDesk](https://www.appealdesk.com/compare/best-property-tax-appeal-services)
- RUBS: residents pay a capped admin fee (MN: $8/month); vendor keeps a "service fee" from collections — [1st Select](https://www.1stselect.net/what-is-rubs); [AABS](https://aabs1.com/rubs/)
- STR: $10,000–$30,000 per $100k listing depending on model — [TIDY](https://www.tidy.com/blog/a-guide-to-short-term-rental-management-fees)

### Inferences
- A remote firm charging contingency on CAM audits would need multi-location tenants: at 3–5% of occupancy cost recovered and a 33–50% fee, a tenant spending $1M/yr on occupancy yields roughly $10,000–$25,000 of fee per audit cycle.
- Subrogation and bill review ARPU are driven by claim volume, so the buyer is a self-insured employer, TPA or small carrier rather than a "small business"; the sales motion is B2B2B.
- Services with sub-$5,000 ARPU (COI, loss runs, screening, residential tax appeals, single-agent TC) can only reach $20k/client by bundling or by moving upmarket (portfolios, brokerages, enterprises).

### Gaps
- No published per-client annual revenue for premium audit outsourcing, MGA submission intake, landlord-side CAM reconciliation, RUBS vendors or HOA collections.
- Commercial property-tax-appeal fee sizes (per parcel) were not found beyond O'Connor's "half of first-year savings."

---

## Key Question 5: US market size and growth, and AI-native startup or rollup activity

### Takeaway
Quantified market sizes were only partially retrievable: subrogation demand volume ($26.3B filed in 2024, $15–20B uncollected), bill review (75–80M bills/yr, $12–16B spent per decade), self-funded health (two-thirds of covered workers) and HOA formation (3,000–4,000 new associations in 2026). The documented rollup/startup activity is concentrated in HOA/property management (General Catalyst's Long Lake, Dwelly), COI tracking (Jones), underwriting intake (Federato, Sixfold), policy checking (Patra, ReSource Pro), tax appeals (Ownwell) and TC (ListedKit, CloudCoord, ReBillion).

### Cited Findings
- General Catalyst has committed ~$1.5B to AI rollups and "co-created roughly a dozen" vehicles in "healthcare, accounting, insurance, customer service, property management, construction"; Long Lake ($670M, 18 acquisitions, $100M EBITDA) is the property-management case study; total capital identified for the strategy is $3B+ (GC $1.5B, Thrive Holdings $1B+, plus Bessemer, Lightspeed, 8VC, Slow Ventures) — [Capital & Clarity](https://capitalandclarity.substack.com/p/the-general-catalyst-behind-15-billion); [Capital Founders](https://www.capitalfounders.io/playbooks/ai-enabled-roll-ups/chapters/capital-and-players/)
- Other GC vehicles: Crescendo (call centers), Titan MSP ($74M, Aug 2025), Eudia (legal), Accrual ($75M, accounting); Thrive's Crete/Current (accounting, $500M acquisition budget) — [Capital Founders](https://www.capitalfounders.io/playbooks/ai-enabled-roll-ups/chapters/capital-and-players/)
- Subrogation: 2.4M demands / $26.3B (2024); $15–20B uncollected/yr — [InsuranceIndustry.ai](https://insuranceindustry.ai/billions-left-behind-how-ai-rewrites-the-economics-of-subrogation/)
- Bill review: 75–80M bills/yr; $12–16B spent over a decade — [WorkCompCentral](https://ww3.workcompcentral.com/columns/show/id/92b0e40ca7452f0bcad23b5038fa7057j)
- Self-funded health: nearly two-thirds of covered workers — [Georgetown CHIR](https://chir.georgetown.edu/third-party-administrators-the-middlemen-of-self-funded-health-insurance/)
- HOA: 3,000–4,000 new associations in 2026 — [CAI Foundation](https://foundation.caionline.org/)
- PM fragmentation: top 20 firms hold 7.15% of rented homes (2024) — [RapidEye](https://rapideyeinspections.com/research/property-management-fee-statistics/)
- Startups: Jones ~$40M (COI); Federato $100M Series D; Ownwell (First Round et al.); Patra (CB Insights profile) — [BCS](https://www.getbcs.com/blog/top-certificate-of-insurance-tracking-companies); [Federato](https://www.federato.ai/); [Ownwell](https://www.ownwell.com/about); [CB Insights: Patra](https://www.cbinsights.com/company/patra-2)
- Loss-run SaaS scale: 1M+ quarterly requests, 7,000+ users — [Loss Run Pro](https://lossrunpro.com/)

### Inferences
- The presence of a $670M AI rollup in HOA/PM signals that the category's margin expansion is being captured by acquirers, not by new remote vendors; a 2–4 person firm competes with Long Lake's AI agents only as a supplier to the ~93% of rented homes outside the top 20 managers.
- Carrier-side AI (Federato, Sixfold, Shift, CCC) is sold to carriers and MGAs, leaving the self-insured employer / small TPA / commercial tenant segments relatively unaddressed by venture-backed tools.

### Gaps
- IBISWorld (405), Grand View (403), Mordor (404), CNBC and PitchBook (403) blocked fetches; no dollar market size for US property management, TPA/claims adjusting, HOA management, title abstracting or premium audit could be cited.
- CAI Foundation's statistical page did not render the numeric counts (associations, units, assessments).
- Funding amounts for Sixfold, TrustLayer, Prophia, Leasecake, Occupier, EliseAI and Ownwell could not be retrieved.
- No source confirms which US property management rollups beyond Long Lake are PE/VC-backed (Evernest page unhelpful).

---

## Scoring table and top 3 (synthesis)

### Takeaway
Scored on the eight criteria (1 = worst, 5 = best for the stated thesis; "AI compression" scored 5 when price is holding, 1 when already collapsed; "licensing" scored 5 when none is needed), the highest-scoring services are tenant-side CAM/lease audit, property tax appeal (investor/commercial focus), subrogation recovery, and medical bill review, with percentage-of-rent property management and STR co-hosting close behind on fragmentation and reachability but penalized by physical work and licensing.

### Cited Findings
- All scores below are derived from the citations in Key Questions 1–5; no new sources.

### Inferences

Scoring key: C1 outcome-tied pricing; C2 annual revenue per client >$20k; C3 digital share; C4 fragmentation (5 = many small providers, 1 = platform/startup dominated); C5 licensing (5 = none, 1 = entity license + exams/bonds); C6 buyer reachability/sales cycle; C7 AI price compression (5 = price intact, 1 = collapsed); C8 market size/growth/rollup momentum.

| Service | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | Total /40 |
|---|---|---|---|---|---|---|---|---|---|
| CAM reconciliation / lease audit (tenant-side, contingency) | 5 | 4 | 5 | 4 | 5 | 3 | 4 | 3 | 33 |
| Property tax appeal (commercial/investor portfolios) | 5 | 3 | 5 | 4 | 3 | 5 | 2 | 4 | 31 |
| Subrogation recovery (self-insureds, TPAs, small carriers, health plans) | 5 | 4 | 4 | 3 | 3 | 2 | 4 | 5 | 30 |
| Medical bill review (WC) | 5 | 5 | 5 | 1 | 3 | 2 | 3 | 5 | 29 |
| Property management back office (small landlords) | 4 | 3 | 3 | 5 | 2 | 4 | 3 | 5 | 29 |
| STR management back office / co-host | 5 | 3 | 3 | 5 | 3 | 4 | 2 | 3 | 28 |
| Insurance agency VA / back office | 1 | 3 | 5 | 5 | 4 | 5 | 2 | 3 | 28 |
| HOA / community association management | 2 | 4 | 3 | 4 | 2 | 3 | 4 | 5 | 27 |
| Transaction coordination | 3 | 2 | 5 | 5 | 4 | 5 | 1 | 2 | 27 |
| HOA delinquent collections (evidence thin) | 5 | 2 | 5 | 3 | 2 | 3 | 4 | 3 | 27 |
| TPA claims administration (self-insured WC / MGAs) | 2 | 5 | 4 | 3 | 1 | 3 | 4 | 4 | 26 |
| Submission intake / quoting support (agencies, MGAs) | 2 | 3 | 5 | 2 | 3 | 3 | 2 | 4 | 24 |
| RUBS utility billing | 2 | 2 | 5 | 2 | 4 | 3 | 3 | 3 | 24 |
| COI tracking / vendor compliance | 1 | 2 | 5 | 2 | 5 | 4 | 1 | 3 | 23 |
| Policy checking for brokers | 1 | 3 | 5 | 1 | 5 | 4 | 1 | 3 | 23 |
| Escrow / closing processing | 2 | 3 | 4 | 4 | 1 | 3 | 3 | 3 | 23 |
| Lease abstraction / administration | 1 | 2 | 5 | 2 | 5 | 3 | 1 | 3 | 22 |
| Title search / abstracting | 1 | 3 | 4 | 3 | 3 | 3 | 2 | 3 | 22 |
| Premium audit (carrier-side) | 1 | 4 | 3 | 2 | 4 | 2 | 3 | 3 | 22 |
| Loss run retrieval | 1 | 1 | 5 | 1 | 5 | 4 | 1 | 2 | 20 |
| Independent adjusting | 2 | 3 | 2 | 3 | 1 | 2 | 4 | 3 | 20 |
| Tenant screening | 1 | 1 | 5 | 1 | 2 | 4 | 2 | 2 | 18 |

Top 3 (weighting C1, C3, C4, C5 most heavily per the brief):

1. **Tenant-side CAM reconciliation / lease audit.** It is the only service in either vertical where pricing is a contingency on recovered dollars (30–50%, National Lease Advisors 33% + $250), the work is entirely documents (leases, CAM statements, invoices), no license is cited by any source, and providers are boutiques (National Lease Advisors, Springbord, REBO, regional CPA practices) rather than platforms. AI lowers the cost of abstracting leases (Kolena: $0.50–$5 compute; Moraine: minutes per draft) and reconciling statements, so a small team can underwrite many audits cheaply while the fee stays tied to recovery. Strongest counter-evidence: revenue is lumpy and partly one-off (an audit yields a reconciliation adjustment, not a subscription), the "3–5% of occupancy costs" recovery claim comes from vendors' own marketing, buyers are mid-market CFOs/real-estate directors with slow cycles, and offshore shops (REBO, Springbord) already compete on price for the abstraction layer; landlord pushback requires negotiation skill the team lacks.

2. **Property tax appeal, focused on investor and commercial portfolios.** Contingency pricing of 25–50% of savings is universal (Ownwell 25–35%, O'Connor 50%, NTPTS/Texas Protax 40%), the evidence packet is fully digital, the buyer (owner/investor) is directly reachable, and Ownwell's 88% success rate shows the product works at scale. Strongest counter-evidence: residential ARPU is tiny (~$190–$270 per property on $774 average savings), AppealDesk already sells a $49 AI evidence packet nationwide, Ownwell is venture-funded and multi-state, Texas requires TDLR-licensed property tax consultants (and other states have their own rules not verified here), hearings are seasonal and jurisdiction-specific, and savings depend on assessor behavior the firm cannot control.

3. **Subrogation recovery for self-insureds, small TPAs/MGAs and health plans.** Contingency of 15–33% is the industry norm, $15–20B goes uncollected annually, the identification and demand work is document- and data-driven, and the vendor landscape is a fragmented mix of law firms and recovery shops. AI (Shift, CCC, CLARA) has so far been sold to carriers to find more claims, not to cut vendor contingencies, and the DOL report shows most health plans still process subrogation internally, leaving "second-pass sweep" work for outsiders. Strongest counter-evidence: the Claims Journal and MWL sources insist that recoveries require a credible litigation threat, which means a law-firm partner and attorney fee splits; collection-agency licensing for non-attorney vendors was not verified; buyers are carriers/TPAs/plans with long procurement cycles rather than small businesses; and "cut-rate" vendors at 15–18% have already commoditized the low end.

Runner-up worth noting: percentage-of-rent property management for small landlords scores well on fragmentation (top 20 firms = 7.15%) and outcome pricing (8–12% of collected rent) but requires a broker license in most states, has a physical maintenance/showing component, and is being consolidated by AI rollups (Long Lake, $670M; Dwelly in the UK) that use the same AI agents a small entrant would.

### Gaps
- Scores for C8 (market size) rest on partial data because market-research databases blocked access; C5 scores for CAM audit, tax appeal (outside Texas), subrogation (collections licensing) and STR (state broker rules) are provisional pending licensing verification.
