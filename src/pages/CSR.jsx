import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, TreePine, Users, Zap, GraduationCap, ArrowRight, Award, Leaf, Droplet } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import { PAGE_SEO, buildBreadcrumbSchema } from '../seo/seoConfig'

/* ══════════════════════════════════════════════════════════
   PERFORMANCE HELPERS
══════════════════════════════════════════════════════════ */

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const shouldDisableOrbs = () => {
  if (typeof navigator !== 'undefined' && navigator.deviceMemory) return navigator.deviceMemory <= 4
  if (typeof window !== 'undefined') return window.innerWidth < 480
  return false
}

// One-time read — static page, no resize listener needed
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

const Orb = ({ className, delay = 0 }) => {
  if (shouldDisableOrbs()) return null
  const reduced = prefersReducedMotion()
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={reduced ? {} : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={reduced ? {} : { duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      // FIX: GPU compositor layer — prevents blur from dirtying the main layer per frame
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
    />
  )
}

/* ══════════════════════════════════════════════════════════
   DATA  (unchanged)
══════════════════════════════════════════════════════════ */

const initiatives = [
  { icon: GraduationCap, title: 'Education & Scholarships',   desc: 'Supporting students from underprivileged backgrounds through scholarships and vocational training programs in Tamil Nadu communities.' },
  { icon: Heart,         title: 'Healthcare Access',          desc: 'Partnering with local hospitals and health centers to provide free medical camps and health services.'                              },
  { icon: TreePine,      title: 'Environmental Conservation', desc: 'Tree plantation drives, water conservation projects, and sustainable packaging innovations.'                                       },
  { icon: Droplet,       title: 'Water Access',               desc: 'Building water wells and purification systems to ensure clean drinking water for rural families.'                                  },
  { icon: Users,         title: 'Community Support',          desc: 'Disaster relief, elderly care programs, and livelihood support for marginalized communities.'                                      },
  { icon: Zap,           title: 'Clean Energy',               desc: 'Investing in solar and wind installations to reduce carbon footprint across our operations.'                                       },
]

const goals = [
  { year: '2024-2025', milestone: '1,000 Students',      desc: 'Provide educational scholarships, vocational training, and mentorship to 1,000 students across Tamil Nadu.'                          },
  { year: '2025-2026', milestone: '50,000+ Lives Impacted', desc: 'Reach 50,000+ individuals through healthcare camps, water access, and community development programs.'                             },
  { year: '2026-2027', milestone: 'Carbon Neutral',       desc: 'Achieve carbon-neutral operations through clean energy and environmental sustainability initiatives.'                                 },
]

const impactStats = [
  { number: '5,000+',  label: 'Trees Planted'       },
  { number: '10,000+', label: 'Beneficiaries'        },
  { number: '50+',     label: 'Communities Served'   },
  { number: '15',      label: 'Schools Supported'    },
]

const visionPillars = [
  { icon: Award, title: 'Ethical Practices',  desc: 'Fair wages, safe working conditions, zero exploitation across our supply chain.'          },
  { icon: Leaf,  title: 'Environmental Care', desc: 'Reducing waste, conserving water, transitioning to renewable energy.'                      },
  { icon: Users, title: 'Community First',    desc: 'Education, healthcare, economic empowerment of communities we serve.'                       },
]

/* ══════════════════════════════════════════════════════════
   CSR PAGE
══════════════════════════════════════════════════════════ */
export default function CSR() {
  const seo = PAGE_SEO.csr
  const schema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'CSR', path: '/csr' },
  ])

  return (
    <PageWrapper
      title="CSR & Sustainability | Our Commitment to the Community"
      description={seo.description}
      url="/csr"
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >

      {/* ══════════ 1. HERO ══════════ */}
      <section
        className="relative pt-28 sm:pt-32 md:pt-36 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(155deg, white 0%, #f9fafb 30%, white 70%, #f3f4f6 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3Cpath d='M25 80 Q65 95 55 140 Q25 110 25 80Z' fill='%237A4A2A'/%3E%3Cpath d='M155 80 Q115 95 125 140 Q155 110 155 80Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
        <Orb className="w-80 h-80 bg-[#F97316]/20 top-10 -right-20" />
        <Orb className="w-64 h-64 bg-[#F97316]/15 top-20 -left-16" delay={2} />

        <div className="relative px-6 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-[#F97316]/60 font-semibold uppercase tracking-widest mb-8 max-w-7xl mx-auto"
          >
            <Link to="/" className="hover:text-[#7A4A2A]">Home</Link>
            <span>/</span>
            <span className="text-[#7A4A2A]">CSR</span>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#FFD9A8] text-[#7A4A2A] text-xs font-bold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
                Our Responsibility
              </span>
              <h1
                className="font-black leading-tight text-[#1A0C04] mb-6"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
              >
                Drinks Made with
                <br />
                <span className="text-[#F97316]">Purpose & Conscience</span>
              </h1>
              <p className="text-[#4A2800]/60 max-w-2xl mx-auto leading-relaxed text-lg mb-4">
                At Richi Food Products, we believe business success is meaningless without creating positive impact. Our CSR initiatives touch education, healthcare, environment, and community development.
              </p>
              <p className="text-[#4A2800]/50 max-w-2xl mx-auto leading-relaxed">
                Every bottle sold contributes to sustainable change in the communities we serve across Tamil Nadu.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ 2. IMPACT STATS ══════════ */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {impactStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl font-black text-[#F97316] mb-3"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-semibold leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ 3. OUR INITIATIVES ══════════ */}
      <section
        className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(155deg, white 0%, #f9fafb 35%, white 60%, #f3f4f6 100%)' }}
      >
        <Orb className="w-96 h-96 bg-[#F97316]/15 top-0 -left-40" />
        <Orb className="w-80 h-80 bg-[#F97316]/10 bottom-20 -right-32" delay={2} />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeading eyebrow="Our Programs" title="CSR Initiatives" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {initiatives.map((init, idx) => {
              const Icon = init.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: isMobile ? idx * 0.04 : idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  // FIX: disable hover lift + scale on mobile — fires on tap, causes layout jump
                  whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}
                  className="border-2 border-gray-200 rounded-3xl p-6 md:p-8 hover:border-[#F97316]
                    hover:shadow-2xl transition-all duration-300 bg-white"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF8EE] flex items-center justify-center mb-6 text-[#F97316]">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{init.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{init.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════ 4. OUR VISION ══════════ */}
      <section
        className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFF8EE 0%, #f9fafb 50%, #F3F4F6 100%)' }}
      >
        <Orb className="w-96 h-96 bg-[#F97316]/10 top-0 -right-32" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#7A4A2A] text-xs font-bold uppercase tracking-widest mb-6 border border-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
              Our Vision
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              Sustainable Growth with<br />
              <span className="text-[#F97316]">Social Responsibility</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              We are committed to building a business model that doesn't just generate profits, but creates value for society and protects our environment. Every bottle we produce is a promise to our consumers and our communities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visionPillars.map((pillar, idx) => {
                const PillarIcon = pillar.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    // FIX: disable y-nudge hover on mobile
                    whileHover={isMobile ? {} : { y: -4 }}
                    className="p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8EE] flex items-center justify-center mb-4 mx-auto text-[#F97316]">
                      <PillarIcon size={24} />
                    </div>
                    <h3 className="font-display font-bold text-gray-900 mb-2">{pillar.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pillar.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 5. GOALS & MILESTONES ══════════ */}
      <section className="py-28 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Roadmap" title="Our CSR Goals" />

          <div className="space-y-6">
            {goals.map((goal, idx) => (
              <motion.div
                key={idx}
                // FIX: x: -30 horizontal slide-in on mobile — replace with y-fade.
                // Elements starting off the left edge can cause a brief horizontal
                // overflow flash on Android browsers before the animation resolves.
                initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: -30 }}
                whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                // FIX: whileHover scale + custom boxShadow on mobile fires on tap.
                // The inline boxShadow style also bypasses Tailwind's transition pipeline,
                // causing an instant style swap rather than a smooth transition on some browsers.
                // Use CSS shadow classes instead — they transition smoothly via Tailwind.
                whileHover={isMobile ? {} : { scale: 1.02 }}
                className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#FFF8EE] to-white
                  border-2 border-[#FFD9A8] hover:shadow-2xl hover:shadow-[#F97316]/10
                  transition-all duration-300"
              >
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-2xl
                      bg-[#F97316] text-white font-black text-base md:text-lg">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                      <h3 className="text-lg md:text-xl font-black text-gray-900 leading-snug">
                        {goal.milestone}
                      </h3>
                      {/* FIX: year badge — on mobile, wraps awkwardly if inline with title.
                          Stack vertically by default (flex-col), row on md+. */}
                      <span className="text-xs md:text-sm font-bold text-[#F97316] border border-[#F97316]
                        rounded-full px-3 py-1 md:px-4 md:py-1.5 self-start md:self-auto whitespace-nowrap">
                        {goal.year}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{goal.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 6. CTA ══════════ */}
      <section className="relative py-28 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#2D1608] to-[#8B5A2B] overflow-hidden">
        <Orb className="w-96 h-96 bg-white/5 top-1/2 -right-20 -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              Join Us in Making a<br />
              <span className="text-[#FBBB74]">Lasting Difference</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Whether you're a partner, customer, or community member, you can be part of our CSR journey. Together, we can create a better tomorrow for Tamil Nadu and beyond.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7A4A2A] font-black
                rounded-full hover:bg-[#FFF8EE] transition-colors duration-300 shadow-xl shadow-black/20
                min-h-[48px]"
            >
              Get Involved <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

    </PageWrapper>
  )
}

