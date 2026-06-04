import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, Building, Handshake, ArrowRight, Package, Globe, CheckCircle } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import StatsCounter from '../components/StatsCounter'
import { PAGE_SEO, buildBreadcrumbSchema } from '../seo/seoConfig'

/* ══════════════════════════════════════════════════════════
   PERFORMANCE HELPERS
══════════════════════════════════════════════════════════ */

// One-time read — Investors is a static page, no resize tracking needed
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

/* ══════════════════════════════════════════════════════════
   DATA  (unchanged)
══════════════════════════════════════════════════════════ */

const models = [
  {
    icon: Building,
    title: 'Contract Manufacturing',
    color: 'from-emerald-600 to-emerald-700',
    desc: 'We produce your formulation using our certified facility. Perfect for FMCG brands looking for high-volume, cost-effective production.',
    benefits: ['Your recipe, our facility', 'Full FSSAI compliance', 'Scalable volumes', 'Quality guaranteed'],
  },
  {
    icon: Package,
    title: 'White-Label',
    color: 'from-emerald-800 to-emerald-900',
    desc: 'Launch your own beverage brand using our proven formulations. Minimal capex, maximum speed to market.',
    benefits: ['Ready formulations', 'Your branding on bottles', 'Fast time-to-market', 'MOQ flexible'],
  },
  {
    icon: Globe,
    title: 'Distribution Partner',
    color: 'from-amber-600 to-orange-700',
    desc: 'Exclusive territory partnerships for distributors across Tamil Nadu, Karnataka, and beyond.',
    benefits: ['Exclusive territories', 'Competitive margins', 'Marketing support', 'Pan South India'],
  },
]

const caseStudies = [
  {
    product: 'Mango Juice',
    emoji: '🥭',
    challenge: 'Client needed 10,000 L/month of consistent quality juice',
    solution: '30% pulp concentration, pasteurized & hot-filled in PET bottles',
    result: '6-month shelf life achieved, 20% sales growth for client',
    metric: '+20% Sales',
  },
  {
    product: 'Jeera Soda',
    emoji: '🌿',
    challenge: 'Restaurant chain needed affordable 200ml single-serve options',
    solution: 'Optimized carbonation formula with QC consistency checks',
    result: '15% cost reduction, scaled to 5,000 L/month in 3 months',
    metric: '-15% Cost',
  },
]

const expansion = [
  { phase: 'Phase 1', label: 'Scale Production', desc: 'Expand beyond 100 KL/day with new equipment lines'              },
  { phase: 'Phase 2', label: 'New Products',     desc: 'Energy drinks, flavored water, milk-based beverages'            },
  { phase: 'Phase 3', label: 'New States',       desc: 'Andhra Pradesh, Telangana, Kerala market entry'                 },
  { phase: 'Phase 4', label: 'Export',           desc: 'Middle East and Southeast Asia export potential'                },
]

const marketStats = [
  { label: 'India Beverage Market', value: '$22B',  sub: 'Total addressable market'  },
  { label: 'Annual Growth Rate',    value: '8.5%',  sub: 'CAGR projected'            },
  { label: 'South India Share',     value: '30%+',  sub: 'Of national consumption'   },
  { label: 'Our Target Revenue',    value: '5x',    sub: 'Growth in 3 years'         },
]

const whyRichi = [
  { icon: '🏭', title: 'Proven Capacity',    desc: '100 KL/day production with room to scale — ready for high-volume commitments.'           },
  { icon: '📋', title: 'Full Compliance',    desc: 'FSSAI licensed, GST registered, and fully compliant with all food safety regulations.'   },
  { icon: '📍', title: 'Strategic Location', desc: "Krishnagiri's position enables fast supply to both Tamil Nadu and Karnataka markets."     },
  { icon: '💰', title: 'Competitive Pricing', desc: 'Factory-direct pricing ensures maximum margins for our distribution partners.'          },
  { icon: '🤝', title: 'Flexible Terms',     desc: 'Customizable agreements for MOQ, payment cycles, and partnership structures.'            },
  { icon: '📈', title: 'Growth Trajectory',  desc: 'Expanding into new states and product categories — be part of the growth story.'        },
]

/* ══════════════════════════════════════════════════════════
   INVESTORS PAGE
══════════════════════════════════════════════════════════ */
export default function Investors() {
  const seo = PAGE_SEO.investors
  const schema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Investors', path: '/investors' },
  ])

  return (
    <PageWrapper
      title="Investor Relations | Growth & Vision — Richi Food Products"
      description={seo.description}
      url="/investors"
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-20 bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900 via-emerald-800 to-[#1f1008]" />
        {/* FIX: add willChange + translateZ(0) so the blur is on its own GPU layer */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-emerald-600/6 rounded-full blur-3xl pointer-events-none"
          style={{ willChange: 'transform', transform: 'translate3d(-50%, -50%, 0)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/15 border border-emerald-600/30 mb-6">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-emerald-300 text-xs font-body font-semibold tracking-widest uppercase">Investor Relations</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Invest in India's<br />
              <span className="bg-linear-to-r from-(--brand-orange) via-(--brand-gold) to-(--brand-orange) bg-clip-text text-transparent">
                Beverage Growth Story
              </span>
            </h1>
            <p className="font-body text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Partner with a proven manufacturer to capture the rapidly growing South Indian beverage market.
            </p>
            <Link
              to="/contact"
              // FIX: remove hover:-translate-y-0.5 — CSS :hover fires on first tap on touch,
              // causing a brief upward jump before navigation. Use shadow-only hover instead.
              className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white font-body font-bold
                rounded-full hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-600/40
                transition-all duration-300 min-h-12"
            >
              Schedule a Meeting <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ MARKET STATS ══════════ */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* FIX: on very small screens (< 480px) the 2-col grid cramps the long label text.
              Use single column below 480px, 2-col at sm, 4-col at md. */}
          <div className="grid grid-cols-2 min-[480px]:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {marketStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-bold text-3xl md:text-4xl bg-linear-to-r from-(--brand-orange) via-(--brand-gold) to-(--brand-orange) bg-clip-text text-transparent mb-1">
                  {s.value}
                </div>
                {/* FIX: shorter label stored in data (South India Share) avoids wrapping */}
                <div className="font-display font-semibold text-emerald-900 text-sm md:text-base mb-0.5 leading-snug">
                  {s.label}
                </div>
                <div className="font-body text-gray-500 text-xs">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BUSINESS MODELS ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Partnership Models"
            title="How We Work Together"
            subtitle="Three flexible models designed to match your investment goals and business needs."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                // FIX: disable whileHover lift on mobile — fires on tap, causes layout jump
                whileHover={isMobile ? {} : { y: -8 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className={`h-3 bg-linear-to-r ${m.color}`} />
                <div className="p-6 md:p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${m.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <m.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-emerald-900 mb-3">{m.title}</h3>
                  <p className="font-body text-gray-500 text-sm leading-relaxed mb-5">{m.desc}</p>
                  <ul className="space-y-2">
                    {m.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 font-body text-sm text-gray-600">
                        <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY RICHI ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Competitive Edge" title="Why Choose Richi Food Products" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyRichi.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? i * 0.04 : i * 0.08 }}
                className="flex gap-4 p-5 md:p-6 bg-emerald-50 rounded-2xl hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-display font-bold text-lg text-emerald-900 mb-1">{item.title}</h4>
                  <p className="font-body text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CASE STUDIES ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-emerald-900">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Case Studies" title="Proven Results" subtitle="Real partnerships, real outcomes." light />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={cs.product}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                // FIX: replace backdrop-blur-2xl with a solid semi-transparent bg.
                // backdrop-filter: blur(2xl = 40px) on a card inside a dark section forces
                // the browser to composite the entire section behind it into a GPU texture
                // on every single frame — even when nothing is animating.
                // On mobile this tanks frame rate across the whole section.
                // bg-white/10 with a subtle border is visually near-identical.
                className="bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{cs.emoji}</div>
                  <div>
                    <div className="font-display font-bold text-xl text-white">{cs.product}</div>
                    <div className="font-display font-bold text-3xl bg-linear-to-r from-(--brand-orange) via-(--brand-gold) to-(--brand-orange) bg-clip-text text-transparent">
                      {cs.metric}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Challenge', value: cs.challenge },
                    { label: 'Solution',  value: cs.solution  },
                    { label: 'Result',    value: cs.result    },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="font-body text-xs text-emerald-400 uppercase tracking-wider mb-1">{row.label}</div>
                      <div className="font-body text-white/70 text-sm">{row.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ EXPANSION PLAN ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Roadmap" title="Expansion Plan" subtitle="Our strategic vision for the next 3 years." />
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-5">
            {expansion.map((e, i) => (
              <motion.div
                key={e.phase}
                // FIX: x: -20 horizontal slide-in on mobile triggers layout recalc for
                // elements near the left edge. Replace with a simple y-fade on mobile.
                initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: -20 }}
                whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Connector arrow — desktop only (hidden on mobile anyway) */}
                {i < expansion.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-0.5 bg-emerald-300 z-10" />
                )}
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-body font-bold text-xs mb-4 shadow-md shadow-emerald-600/30">
                  {i + 1}
                </div>
                <div className="font-body text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">{e.phase}</div>
                <div className="font-display font-bold text-lg text-emerald-900 mb-2">{e.label}</div>
                <div className="font-body text-gray-500 text-sm leading-relaxed">{e.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-emerald-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Handshake size={48} className="text-white mx-auto mb-6 opacity-80" />
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              Ready to Start a Partnership?
            </h2>
            <p className="font-body text-white/80 text-base md:text-lg mb-8">
              Schedule a plant visit, virtual tour, or business discussion. We're ready to build together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                // FIX: remove hover:-translate-y-0.5 — triggers on tap on touch devices
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-emerald-700
                  font-body font-bold rounded-full hover:shadow-2xl transition-all duration-300
                  min-h-12"
              >
                Contact Us <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </PageWrapper>
  )
}
