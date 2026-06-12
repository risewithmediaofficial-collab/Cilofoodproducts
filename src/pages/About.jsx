import { useState, useEffect, memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users, Target, Eye, Shield, Zap, Globe,
  ChevronLeft, ChevronRight, ArrowRight, Phone,
  HeartHandshake, BadgeCheck
} from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { PAGE_SEO, buildBreadcrumbSchema } from '../seo/seoConfig'
import heroPicFlavours1 from '../../pic assets/FLAVOURS 1.png'
import heroPicFlavours2 from '../../pic assets/flavours 2.png'

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */

// Hero flavour images — real product lineup shots
const heroFlavours = [
  { img: heroPicFlavours1, alt: 'Cilo carbonated and soda lineup' },
  { img: heroPicFlavours2, alt: 'Cilo juice and beverage lineup'  },
]

const timeline = [
  { year: '2020', title: 'Founded',                desc: 'Richi Food Products founded in Krishnagiri District, Tamil Nadu.',                img: '/images/about/timeline/2020.jpg', tag: 'Founded',    color: 'bg-[#C2641F]'  },
  { year: '2021', title: 'FSSAI License',           desc: 'FSSAI license obtained, first product lines launched.',                            img: '/images/about/timeline/2021.jpg', tag: 'Compliance', color: 'bg-sky-500'    },
  { year: '2022', title: 'Karnataka Expansion',     desc: 'Expanded to 10+ drink variants, entered Karnataka market.',                        img: '/images/about/timeline/2022.jpg', tag: 'Expansion',  color: 'bg-purple-500' },
  { year: '2023', title: 'Plant Upgrade',           desc: 'Scaled to 100 KL/day capacity with new plant upgrades.',                           img: '/images/about/timeline/2023.jpg', tag: 'Scale-up',   color: 'bg-[#FB923C]'  },
  { year: '2024', title: 'Contract Manufacturing', desc: 'White-label & contract manufacturing partnerships launched.',                      img: '/images/about/timeline/2024.jpg', tag: 'Latest',     color: 'bg-[#F97316]'  },
]

const commitments = [
  { icon: Shield,        title: 'Quality First',  desc: 'Every bottle passes rigorous QC checks before leaving our facility.'  },
  { icon: Zap,           title: 'Innovation',     desc: 'Continuously developing new flavors and healthier formulations.'       },
  { icon: Globe,         title: 'Sustainability', desc: 'Eco-friendly packaging and responsible water management practices.'    },
  { icon: HeartHandshake, title: 'Partnership',   desc: 'Long-term relationships with distributors, retailers, and farmers.'   },
]

const strengths = [
  { icon: '🏭', title: 'Modern Facilities', desc: 'Automated facilities ensure precision, hygiene, and consistency.'          },
  { icon: '💡', title: 'Innovation',        desc: 'Constantly refining products through R&D while meeting market demands.'    },
  { icon: '🌿', title: 'Sustainability',    desc: 'Eco-friendly packaging and responsible water management.'                  },
  { icon: '✅', title: 'Quality',           desc: 'Every bottle passes rigorous QC before leaving our facility.'              },
  { icon: '💰', title: 'Affordable Price',  desc: 'Premium quality beverages at prices accessible to all.'                   },
  { icon: '🏆', title: 'Market Leadership', desc: 'A trusted name in South India with a growing distribution network.'       },
  { icon: '🥤', title: 'Wide Product Range', desc: 'Fruit juices and carbonated beverages for every consumer.'               },
  { icon: '🤝', title: 'Ethical Values',    desc: 'We believe in fairness, integrity, and community support.'                },
]

const services = [
  { icon: Users,          title: 'Contract Manufacturing', desc: 'Full-scale contract manufacturing for B2B partners with 100 KL/day capacity.' },
  { icon: HeartHandshake, title: 'White-Label Solutions',  desc: 'Custom white-label beverages crafted to your brand specifications.'            },
  { icon: Globe,          title: 'Distribution Network',  desc: 'Growing presence across Tamil Nadu and Karnataka with reliable supply chain.'   },
]

const labPoints = [
  'RO Water Treatment for pure, consistent water quality.',
  'Blending & Mixing Units for precise formulation.',
  'Pasteurization System ensuring product safety.',
  'CO₂ Carbonation for consistent carbonated beverages.',
  'PET Bottle Filling Line with automated quality checks.',
  'Dedicated QC Laboratory monitoring every batch.',
  'Cold Storage Facility preserving freshness.',
]

const pillars = [
  { name: 'Mr. Velmurukan', role: 'Founder & Director',    phone: '9443518521', img: '/images/about/team/velmurukan.jpg' },
  { name: 'Mr. Bharath',    role: 'Operations & Marketing', phone: '9944366592', img: '/images/about/team/bharath.jpg'    },
]

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

// Custom hook: debounced window width — fires at most once per 150ms
// Prevents a resize event from triggering a full re-render on every pixel change
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    let timer
    const handler = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setWidth(window.innerWidth), 150)
    }
    window.addEventListener('resize', handler, { passive: true })
    return () => { window.removeEventListener('resize', handler); clearTimeout(timer) }
  }, [])
  return width
}

/* ══════════════════════════════════════════════════════════
   ORB
   FIX: add willChange + translateZ(0) so the blur is promoted
   to its own GPU compositor layer, preventing it from dirtying
   the main layer during the scale/opacity animation.
══════════════════════════════════════════════════════════ */
const Orb = memo(({ className, delay = 0 }) => {
  if (shouldDisableOrbs()) return null
  const reduced = prefersReducedMotion()
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={reduced ? {} : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={reduced ? {} : { duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
    />
  )
})

/* ══════════════════════════════════════════════════════════
   IMG BOX
   FIX: add loading="lazy" + decoding="async" so images decode
   off the main thread and don't block paint during scroll.
══════════════════════════════════════════════════════════ */
function ImgBox({ src, alt = '', className = '', objectFit = 'object-cover', label = 'Add Image', rounded = 'rounded-2xl', aspect }) {
  return (
    <div className={`relative overflow-hidden ${rounded} ${aspect} ${className} bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-200`}>
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full ${objectFit} ${rounded}`}
        onError={e => { e.target.style.display = 'none' }}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBBB74" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span className="text-[#F97316] text-[10px] font-bold uppercase tracking-widest text-center px-3">{label}</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════════════════════ */
export default function About() {
  const [heroFlavour1, heroFlavour2] = heroFlavours

  const windowWidth = useWindowWidth()
  const isMobile    = windowWidth < 768
  const reduced     = prefersReducedMotion()

  // Commitment carousel — 1 card on mobile, 2 on sm, 3 on md+
  // FIX: memoize derived values so they don't recompute every render
  const commitVisible = useMemo(() => windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3, [windowWidth])
  const [commitIdx, setCommitIdx] = useState(0)
  const commitMax  = Math.max(0, commitments.length - commitVisible)
  const prevCommit = useCallback(() => setCommitIdx(i => Math.max(0, i - 1)), [])
  const nextCommit = useCallback(() => setCommitIdx(i => Math.min(commitMax, i + 1)), [commitMax])

  // Pillars carousel (only 2 members — effectively static)
  const [pillarIdx, setPillarIdx] = useState(0)
  const pillarMax  = 0   // always 0 since there are only 2 members and we always show both
  const prevPillar = useCallback(() => setPillarIdx(i => Math.max(0, i - 1)), [])
  const nextPillar = useCallback(() => setPillarIdx(i => Math.min(pillarMax, i + 1)), [pillarMax])

  // ── Mobile-conditional animation props ──
  // On mobile, horizontal slide-ins (x: ±40) force a layout recalc because
  // the element starts outside the viewport's overflow. Replace with a simple
  // fade (opacity only) which is compositor-only and causes zero layout work.
  const slideLeft  = isMobile
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.6 } }
    : { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 } }

  const slideRight = isMobile
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.6 } }
    : { initial: { opacity: 0, x: 40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 } }

  const seo = PAGE_SEO.about
  const schema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ])

  return (
    <PageWrapper
      title={seo.title}
      description={seo.description}
      url="/about"
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >

      {/* ══════════ 1. HERO ══════════ */}
      <section
        className="relative pt-28 sm:pt-32 md:pt-36 pb-0 overflow-hidden"
        style={{ background: 'linear-gradient(155deg, white 0%, #f9fafb 30%, white 70%, #f3f4f6 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3Cpath d='M25 80 Q65 95 55 140 Q25 110 25 80Z' fill='%237A4A2A'/%3E%3Cpath d='M155 80 Q115 95 125 140 Q155 110 155 80Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
        <Orb className="w-80 h-80 bg-gray-200/20 top-10 -right-20" />
        <Orb className="w-64 h-64 bg-yellow-200/20 top-20 -left-16" delay={2} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-[#F97316]/60 font-semibold uppercase tracking-widest mb-8"
          >
            <Link to="/" className="hover:text-[#7A4A2A]">Home</Link>
            <span>/</span>
            <span className="text-[#7A4A2A]">About</span>
          </motion.div>

          {/* Desktop 3-col */}
          <div className="hidden md:grid grid-cols-[220px_1fr_220px] gap-4 items-end">

            {/* FIX: floating product cards
                Original: `y: [0, -10, 0]` with repeat: Infinity ran a JS-driven animation
                on every frame even when off-screen. Replace with a CSS animation so the
                compositor handles it with zero JS involvement per frame. */}
            <motion.div
              initial={{ opacity: 0, x: -40, rotate: -12 }}
              animate={{ opacity: 1, x: 0, rotate: -8 }}
              transition={{ opacity: { duration: 0.9, delay: 0.4 }, x: { duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }, rotate: { duration: 1, delay: 0.4 } }}
              className="self-end mb-8"
              // Pure CSS float — compositor thread, no JS per frame
              style={reduced ? {} : { animation: 'float-card 4s ease-in-out infinite', animationDelay: '1.4s', willChange: 'transform' }}
            >
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-stone-200">
                <img
                  src={heroFlavour1.img}
                  alt={heroFlavour1.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center pb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#FFD9A8] text-[#7A4A2A] text-xs font-bold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
                Since 2020
              </span>
              <h1
                className="font-black leading-tight text-[#1A0C04] mb-6"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif", fontSize: 'clamp(2rem, 5vw, 4rem)' }}
              >
                Richi Food Products
                <br />
                <span className="text-[#F97316]">CILO Juice & Richi Juice</span>
              </h1>
              <p className="text-[#4A2800]/60 max-w-xl mx-auto leading-relaxed text-lg mb-4">
                Born in Krishnagari District, Tamil Nadu — a modern beverage manufacturer specialising in
                high-quality fruit juices and carbonated drinks for B2B partners across South India.
              </p>
              <p className="text-[#4A2800]/50 max-w-xl mx-auto leading-relaxed">
                From contract manufacturing to white-label solutions — driven by quality, innovation,
                and sustainability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 12 }}
              animate={{ opacity: 1, x: 0, rotate: 8 }}
              transition={{ opacity: { duration: 0.9, delay: 0.4 }, x: { duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }, rotate: { duration: 1, delay: 0.4 } }}
              className="self-end mb-8"
              style={reduced ? {} : { animation: 'float-card 4.2s ease-in-out infinite', animationDelay: '1.6s', willChange: 'transform' }}
            >
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-stone-200">
                <img
                  src={heroFlavour2.img}
                  alt={heroFlavour2.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile hero — simplified, no floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:hidden text-center pb-12 px-2"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#FFD9A8] text-[#7A4A2A] text-xs font-bold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
              Since 2020
            </span>
            <h1
              className="font-black leading-tight text-[#1A0C04] mb-5"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif", fontSize: 'clamp(2rem, 7vw, 3rem)' }}
            >
              Richi Food Products
              <br />
              <span className="text-[#F97316]">CILO Juice & Richi Juice</span>
            </h1>
            <p className="text-[#4A2800]/60 leading-relaxed text-base mb-3">
              Born in Krishnagari District, Tamil Nadu — a modern beverage manufacturer for B2B partners across South India.
            </p>
            <p className="text-[#4A2800]/50 leading-relaxed text-sm mb-8">
              Quality, innovation, and sustainability at our core.
            </p>
            {/* Two flavour thumbnails side-by-side on mobile */}
            <div className="flex justify-center gap-4 max-w-sm mx-auto">
              {heroFlavours.map((f) => (
                <div
                  key={f.alt}
                  className="relative flex-1 max-w-[140px] aspect-square rounded-2xl overflow-hidden shadow-lg bg-stone-200"
                >
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CSS keyframe injected once — float + reduced-motion guard */}
        <style>{`
          @keyframes float-card {
            0%, 100% { transform: translateY(0px);    }
            50%       { transform: translateY(-10px);  }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="float-card"] { animation: none !important; }
          }
        `}</style>

        <div className="w-full overflow-hidden leading-none mt-4">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══════════ 2. COMPANY INFO ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* FIX: replace x-slide with fade on mobile */}
          <motion.div {...slideLeft}>
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#FFD9A8]">
              Company Profile
            </span>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 mb-6"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              Crafting Beverages That <span className="text-[#F97316]">Delight Every Sip</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Richi Food Products is a modern beverage manufacturer located in Krishnagiri District, Tamil Nadu.
              We specialise in high-quality fruit juices and carbonated drinks for B2B partners — from
              contract manufacturing to white-label solutions.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Our state-of-the-art facility equipped with RO Water systems, Blending, Filtration,
              Pasteurisation, CO₂ Carbonation, Bottling, QC Lab, and Cold Storage ensures every
              product meets the highest standards.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: 'GST No.',       value: '33ABJFR2254F1ZD', breakAll: true  },
                { label: 'FSSAI License', value: '12424011000549',   breakAll: true  },
                { label: 'Location',      value: 'Karagur Village, Paiyur - 2, Krishnagiri - 635112', breakAll: false },
                { label: 'Capacity',      value: '100 KL/Day',       breakAll: false },
              ].map((item) => (
                <div key={item.label} className="bg-[#FFF8EE] rounded-2xl p-3 sm:p-4 border border-[#FFD9A8] min-w-0">
                  <div className="text-[10px] sm:text-xs text-[#7A4A2A]/60 uppercase tracking-wider mb-1 font-semibold leading-tight">
                    {item.label}
                  </div>
                  <div className={`font-black text-gray-900 text-xs sm:text-sm leading-snug ${item.breakAll ? 'break-all' : 'break-words'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...slideRight}>
            <div className="bg-[#2D1608] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F97316]/10 rounded-full blur-2xl" />
              <div className="text-5xl mb-4">🏭</div>
              <h3
                className="font-black text-2xl mb-6"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                Our Plant Infrastructure
              </h3>
              <ul className="space-y-3">
                {labPoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                    <div className="w-5 h-5 rounded-full bg-[#F97316]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <BadgeCheck size={12} className="text-[#FBBB74]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-black text-3xl text-[#FBBB74]">100 KL</div>
                  <div className="text-white/50 text-xs">Daily Production</div>
                </div>
                <div className="text-right">
                  <div className="text-white/50 text-xs">Location</div>
                  <div className="font-semibold text-white text-sm">Krishnagiri District - 635112</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 3. OUR JOURNEY — TIMELINE ══════════ */}
      <section
        className="hidden py-28 px-6 md:px-12 lg:px-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFF8EE 0%, #FFF1DC 100%)' }}
      >
        <Orb className="w-96 h-96 bg-gray-200/15 top-0 right-0" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Our Journey
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              5 Years of <span className="text-[#F97316]">Growth</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-16">
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={item.year}
                    // FIX: use opacity-only fade — original had no x/y but descendant
                    // ImgBox images caused layout shifts. Keeping it simple is best here.
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative grid md:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'md:[&>*:first-child]:order-last'}`}
                  >
                    <div className={`${isLeft ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest ${item.color}`}>
                          {item.tag}
                        </span>
                        <span
                          className="text-4xl font-black text-[#7A4A2A]/20"
                          style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                        >
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                      <div className={`w-5 h-5 rounded-full ${item.color} border-4 border-white shadow-lg`} />
                    </div>

                    <ImgBox
                      src={item.img}
                      alt={item.title}
                      label={`${item.year} Image`}
                      aspect="aspect-[4/3]"
                      rounded="rounded-2xl"
                      objectFit="object-cover"
                      className={`shadow-xl ${isLeft ? 'md:pl-12' : 'md:pr-12'}`}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 4. OUR COMMITMENT — CAROUSEL ══════════ */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-[#F97316]/6 -top-48 -right-32" delay={0} />
        <Orb className="w-[400px] h-[400px] bg-[#F97316]/4 bottom-20 -left-40" delay={2} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Our Commitment
            </span>
            <div className="flex items-end justify-between gap-4">
              <h2
                className="text-4xl md:text-5xl font-black text-gray-900"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                Our Core <span className="text-[#F97316]">Values</span>
              </h2>
              <div className="flex gap-2 shrink-0">
                <motion.button
                  onClick={prevCommit}
                  disabled={commitIdx === 0}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full border-2 border-[#FFD9A8] flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  onClick={nextCommit}
                  disabled={commitIdx >= commitMax}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full border-2 border-[#FFD9A8] flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
            <p className="text-gray-500 mt-3 max-w-xl leading-relaxed">
              At Richi Food Products, we hold ourselves to the highest standards in every aspect of our operations.
            </p>
          </motion.div>

          <div className="overflow-hidden">
            {/* FIX: carousel slide uses spring-based x transform.
                This is fine on desktop. On mobile, we add a touch-action hint so the browser
                knows this element scrolls horizontally, preventing scroll-vs-animation conflict. */}
            <motion.div
              animate={{ x: `calc(-${commitIdx} * (100% / ${commitVisible} + 16px))` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex gap-4"
              style={{ touchAction: 'pan-y' }}
            >
              {commitments.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  // FIX: disable whileHover lift on mobile — touch devices fire hover on tap,
                  // causing a brief layout shift before the next tap interaction.
                  whileHover={isMobile ? {} : { y: -12, scale: 1.02 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 p-10 shadow-lg hover:shadow-2xl hover:border-[#F97316] transition-all duration-500 shrink-0 group relative overflow-hidden"
                  style={{ width: `calc((100% - ${(commitVisible - 1) * 16}px) / ${commitVisible})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-[#FFF8EE] flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300 relative z-10"
                    whileHover={isMobile ? {} : { scale: 1.1, rotate: 8 }}
                  >
                    <c.icon size={28} className="text-[#F97316] group-hover:text-[#A8430F] transition-colors duration-300" />
                  </motion.div>
                  <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-[#F97316] transition-colors duration-300 relative z-10">{c.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{c.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ 5. MISSION & VISION ══════════ */}
      <section className="py-0">
        {/* Mission */}
        <div className="grid md:grid-cols-2 min-h-[300px] sm:min-h-[400px]">
          <div className="relative overflow-hidden">
            <img
              src="/images/about/mission.jpg"
              alt="Our Mission"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#1A0C04]/60 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Target size={28} className="text-white/60" />
              </div>
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Mission Image</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#2D1608] flex items-center px-6 sm:px-12 py-16 sm:py-20"
          >
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Our Mission
              </span>
              <h2
                className="text-3xl md:text-4xl font-black text-white mb-6"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                Quality for Every Consumer
              </h2>
              <ul className="space-y-4">
                {[
                  'Deliver hygienic, affordable, and tasty drinks.',
                  'Maintain best-in-class manufacturing standards.',
                  'Build long-term partnerships with distributors & retailers.',
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-base leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#FBBB74]" />
                    </div>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Vision */}
        <div className="grid md:grid-cols-2 min-h-[300px] sm:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900 flex items-center px-6 sm:px-12 py-16 sm:py-20"
          >
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Our Vision
              </span>
              <h2
                className="text-3xl md:text-4xl font-black text-white mb-6"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                Leading South India in Beverages
              </h2>
              <p className="text-white/70 leading-relaxed text-base">
                To be a leading manufacturer of high-quality fruit juices and carbonated beverages,
                recognised across South India for unmatched taste and standards — with business growth
                seamlessly intertwined with environmental stewardship.
              </p>
            </div>
          </motion.div>
          <div className="relative overflow-hidden">
            <img
              src="/images/about/vision.jpg"
              alt="Our Vision"
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gray-900/60 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Eye size={28} className="text-white/60" />
              </div>
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Vision Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 6. OUR STRENGTHS ══════════ */}
      <section
        className="py-28 px-6 md:px-12 lg:px-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFF8EE 0%, #FFF1DC 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Why Choose Us
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              Our <span className="text-[#F97316]">Strengths</span>
            </h2>
          </motion.div>

          {/* grid-cols-1 below 480px so cards are wide enough to read,
              2-col at ≥480px, 4-col at md ≥768px — matches original desktop exactly */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: isMobile ? i * 0.04 : i * 0.08 }}
                whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}
                className={`bg-white rounded-3xl border border-[#FFF8EE] shadow-sm hover:shadow-xl
                  transition-all duration-300
                  p-4 min-[480px]:p-6
                  flex min-[480px]:flex-col
                  items-center
                  gap-4 min-[480px]:gap-0
                  text-left min-[480px]:text-center`}
              >
                <div className="text-4xl shrink-0 min-[480px]:mb-4">{s.icon}</div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm min-[480px]:text-base mb-1 min-[480px]:mb-2 leading-snug">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 7. OUR SERVICES ══════════ */}
      <section className="py-28 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8]">
              What We Offer
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              Our <span className="text-[#F97316]">Services</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-16">
              At Richi Food Products, we prioritise exceptional service with a customer-focused approach,
              exceeding expectations and fostering lasting B2B relationships.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={isMobile ? {} : { y: -8 }}
                className="border border-[#FFD9A8] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFF8EE] flex items-center justify-center mb-6 group-hover:bg-[#F97316] transition-colors duration-300">
                  <s.icon size={28} className="text-[#F97316] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 8. LOOKING AHEAD ══════════ */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-[#2D1608] to-[#4A2800] relative overflow-hidden">
        <Orb className="w-96 h-96 bg-white/5 top-1/2 -right-20 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Looking Ahead
            </span>
            <h2
              className="text-3xl md:text-5xl font-black text-white mb-6"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              The Next Chapter
            </h2>
            <p className="text-white/80 leading-relaxed text-lg mb-4">
              As we continue to grow, Richi Food Products remains committed to our core values of
              <strong className="text-white"> integrity</strong>,
              <strong className="text-white"> quality</strong>, and
              <strong className="text-white"> sustainability</strong>.
            </p>
            <p className="text-white/70 leading-relaxed mb-10">
              We are excited about expanding our operations, developing new products, and building
              stronger partnerships across South India and beyond.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#7A4A2A] font-bold rounded-full hover:bg-[#FFF8EE] transition-colors duration-300 shadow-xl"
            >
              Explore Our Products <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ 9. PILLARS OF STRENGTH — LEADERSHIP ══════════ */}
      <section className="py-28 px-6 md:px-12 lg:px-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8]">
              Our Leadership
            </span>
            <div className="flex items-end justify-between gap-4">
              <h2
                className="text-4xl md:text-5xl font-black text-gray-900"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                Pillars of <span className="text-[#F97316]">Strength</span>
              </h2>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={prevPillar}
                  disabled={pillarIdx === 0}
                  className="w-10 h-10 rounded-full border-2 border-[#FFD9A8] flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous leader"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextPillar}
                  disabled={pillarIdx >= pillarMax}
                  className="w-10 h-10 rounded-full border-2 border-[#FFD9A8] flex items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next leader"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={isMobile ? {} : { y: -6 }}
                className="bg-white rounded-3xl border-2 border-[#FFD9A8] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#FFF8EE] border-4 border-[#FFD9A8] group-hover:border-[#FBBB74] transition-colors duration-300 mb-4 shadow-lg">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBBB74" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{p.name}</h3>
                <p className="text-[#F97316] text-sm font-semibold mb-4">{p.role}</p>
                <a
                  href={`tel:${p.phone}`}
                  className="inline-flex items-center gap-2 text-[#7A4A2A] font-semibold text-sm hover:text-[#F97316] transition-colors"
                >
                  <Phone size={14} /> +91 {p.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageWrapper>
  )
}

