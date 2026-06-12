import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import ProductCard from '../components/ProductCard'
import { MultiDirectionSlideText } from '../components/MultiDirectionSlideText'
import ZigZagImage from '../components/ZigZagImage'
import { PAGE_SEO, buildBreadcrumbSchema } from '../seo/seoConfig'

// ─── Mobile / low-end detection ────────────────────────────────────────────────
// Runs once at module level so every component can share the result.
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const isLowEnd = (() => {
  if (typeof navigator === 'undefined') return false
  if (navigator.deviceMemory && navigator.deviceMemory <= 4) return true
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true
  return isMobile && window.innerWidth < 480
})()

// Reduced animation presets – used on mobile to avoid jank
const mobileTransition = { duration: 0.2, ease: 'easeOut' }
const desktopTransition = { duration: 0.7 }

// ─── Orb (background blob) ─────────────────────────────────────────────────────
// Completely removed on low-end/mobile – they trigger expensive blur repaints.
// On desktop, `will-change: transform` keeps them on the compositor thread.
const Orb = memo(({ className, delay = 0 }) => {
  if (isLowEnd || isMobile) return null
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ willChange: 'transform, opacity' }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
})
Orb.displayName = 'Orb'

// ─── Products data ──────────────────────────────────────────────────────────────
const products = [
  { name: 'Apple',       category: 'Juice',      img: '/images/products/apple.png',       gradient: '#dc2626, #b91c1c, #991b1b', color: '#DC2626' },
  { name: 'Mango',       category: 'Juice',      img: '/images/products/mango.png',       gradient: '#fbbf24, #f97316, #ea580c', color: '#F97316' },
  { name: 'Grapes',      category: 'Juice',      img: '/images/products/grapes.png',      gradient: '#a855f7, #9333ea, #7e22ce', color: '#7c3aed' },
  { name: 'White Lemon', category: 'Juice',      img: '/images/products/white_lemon.png', gradient: '#fcd34d, #fbbf24, #f59e0b', color: '#84cc16' },
  { name: 'Orange',      category: 'Juice',      img: '/images/products/orange.png',      gradient: '#fb7185, #f97316, #ea580c', color: '#F97316' },
  { name: 'Green Lemon', category: 'Carbonated', img: '/images/products/green_lemon.png', gradient: '#34d399, #10b981, #059669', color: '#84cc16' },
  { name: 'Paneer Soda', category: 'Carbonated', img: '/images/products/paneer_soda.png', gradient: '#c084fc, #a855f7, #9333ea', color: '#8b5cf6' },
  { name: 'Salt Lemon',  category: 'Carbonated', img: '/images/products/salt_lemon.png',  gradient: '#94a3b8, #64748b, #475569', color: '#64748b' },
  { name: 'Cola',        category: 'Carbonated', img: '/images/products/cola.png',        gradient: '#1e293b, #0f172a, #020617', color: '#475569' },
  { name: 'Jeera Masala',category: 'Carbonated', img: '/images/products/jeera_masala.png',gradient: '#fed7aa, #fb923c, #f97316', color: '#F97316' },
  { name: 'Mango 2',    category: 'Juice',      img: '/images/products/mango_2.png',     gradient: '#fbbf24, #fb923c, #f97316', color: '#F97316' },
  { name: 'Pineapple',  category: 'Juice',      img: '/images/products/pine_apple.png',  gradient: '#fcd34d, #fbbf24, #fb923c', color: '#fbbf24' },
]

const filters = ['All', 'Juice', 'Carbonated']

const packaging = [
  { size: '200ml',  type: 'PET Bottle',  best: 'Restaurants & Cafes'  },
  { size: '500ml',  type: 'PET Bottle',  best: 'Retail & On-the-go'   },
  { size: '1L',     type: 'PET Bottle',  best: 'Family & Bulk'         },
  { size: 'Custom', type: 'White-label', best: 'Brand Partners'        },
]

const processSteps = [
  { step: '01', img: '/images/products/preparation.png', label: 'Preparation', desc: 'Carefully sourced ingredients are prepared in a highly hygienic environment.' },
  { step: '02', img: '/images/products/filling.png', label: 'Filling',     desc: 'Automated filling machines ensure exact measurements and eliminate contamination.' },
  { step: '03', img: '/images/products/labelling.png', label: 'Labelling',   desc: 'High-speed labeling equipment applies branding seamlessly.' },
  { step: '04', img: '/images/products/checking.png', label: 'Checking',    desc: 'Rigorous quality control processes guarantee the integrity of every bottle.' },
  { step: '05', img: '/images/products/packing.png', label: 'Packing',      desc: 'Finished products are safely packed for secure transit.' },
  { step: '06', img: '/images/products/dispatch.png', label: 'Dispatch',    desc: 'Logistics coordination ensures timely delivery to all partners.' },
]

// ─── Shared motion helpers ──────────────────────────────────────────────────────
// On mobile: instant fade-in (no translateY) → eliminates layout recalculations.
// On desktop: full slide-up as originally designed.
const fadeUp = isMobile
  ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: mobileTransition }
  : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }

const fadeUpView = isMobile
  ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: mobileTransition }
  : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }

// ─── Lazy Image ────────────────────────────────────────────────────────────────
// Native lazy loading + explicit width/height prevents layout shift (CLS).
// Serves WebP with PNG fallback; sizes attr guides browser srcset decisions.
const LazyImage = memo(({ src, alt }) => {
  // Derive WebP path from PNG path (assumes /images/products/name.png → .webp)
  const webpSrc = src.replace(/\.png$/, '.webp')

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <ZigZagImage
        src={src}
        alt={alt}
        index={0}
        loading="lazy"
        decoding="async"
        width={300}
        height={300}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain' }}
      />
    </picture>
  )
})
LazyImage.displayName = 'LazyImage'

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function Products() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

  const seo = PAGE_SEO.products
  const schema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ])

  return (
    <PageWrapper
      title="Our Premium Range | Fruit Juices & Carbonated Drinks"
      description={seo.description}
      url="/products"
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >
      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-20 bg-white overflow-hidden">
        {/* Static background element – no animation, avoids repaint on mobile */}
        <div className="absolute inset-0 pointer-events-none bg-pattern-leaf bg-pattern-opacity-55" />
        {/*
          Static circle replacing the animated blur – identical look on mobile,
          zero compositor cost. On desktop the original style is preserved via CSS.
        */}
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <motion.div
            {...fadeUp}
            className="flex items-center gap-2 text-xs text-[#F97316]/60 font-semibold uppercase tracking-widest mb-8"
          >
            <Link to="/" className="hover:text-[#7A4A2A]">Home</Link>
            <span>/</span>
            <span className="text-[#7A4A2A]">Products</span>
          </motion.div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={isMobile ? mobileTransition : desktopTransition}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-600 bg-stone-100/90 border border-stone-200/80 mb-6">
                <span className="h-1 w-1 rounded-full bg-[#F97316]" aria-hidden />
                Our range
              </span>
              <MultiDirectionSlideText
                as="h1"
                text="Our products"
                className="font-semibold text-4xl sm:text-5xl md:text-6xl text-stone-900 mb-5 leading-[1.08] tracking-tight"
              />
              <div className="mx-auto mb-2 h-px w-16 bg-linear-to-r from-transparent via-[#F97316]/50 to-transparent" aria-hidden />
              <p className="text-stone-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                {products.length}+ premium beverages — fruit juices and carbonated drinks crafted for retail and food service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ── (same leaf pattern as hero) */}
      <section className="relative overflow-hidden py-20 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="absolute inset-0 pointer-events-none bg-pattern-leaf bg-pattern-opacity-55" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Filter tabs — segmented control */}
          <motion.div
            {...fadeUp}
            className="flex justify-center mb-12 md:mb-14"
          >
            <div
              className="inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-stone-200/90 bg-stone-100/60 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
              role="tablist"
              aria-label="Filter by category"
            >
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active === f}
                  onClick={() => setActive(f)}
                  className={`relative px-4 sm:px-5 py-2 rounded-xl text-sm font-medium transition-[color,background-color,box-shadow] duration-200 ${
                    active === f
                      ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200/80'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <span className="tabular-nums">
                    {f}
                    <span className="ml-1.5 text-xs text-stone-400 tabular-nums">
                      {f === 'All' ? products.length : products.filter((p) => p.category === f).length}
                    </span>
                  </span>
                  {active === f && (
                    <span
                      className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#F97316]"
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid
              – AnimatePresence kept for desktop UX.
              – On mobile: skip exit animation (duration 0) to prevent frame drops
                when re-rendering up to 12 cards simultaneously.
          */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: isMobile ? 0.15 : 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 auto-rows-fr"
              /*
                Mobile: 2-col grid avoids a single-column layout that causes
                extra scroll distance and repaints. gap-4 (not 5) saves space.
              */
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.name} {...product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Packaging ── */}
      <section
        className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(155deg, white 0%, white 35%, #f3f4f6 65%, #f9fafb 100%)' }}
      >
        <Orb className="w-96 h-96 bg-[#F97316]/15 top-0 -right-32" />
        <Orb className="w-80 h-80 bg-[#F97316]/10 bottom-20 -left-20" delay={2} />

        {/* SVG texture – static, no animation, negligible cost */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div {...fadeUpView} className="text-center mb-4">
            <MultiDirectionSlideText
              as="h2"
              text="Available Formats"
              className="text-4xl md:text-5xl font-black text-gray-900"
            />
          </motion.div>
          <motion.p
            {...fadeUpView}
            className="text-xl text-[#7A4A2A]/70 text-center mb-12 max-w-2xl mx-auto"
          >
            Flexible sizing to fit every distribution channel
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {packaging.map((p, i) => (
              <motion.div
                key={p.size}
                initial={{ opacity: 0, y: isMobile ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                /*
                  Mobile: stagger delay removed (all cards appear at once)
                  because staggering 4 cards requires holding multiple keyframes
                  in memory – not worth it on low-RAM devices.
                */
                transition={isMobile ? { ...mobileTransition, delay: 0 } : { delay: i * 0.1 }}
                className="bg-white rounded-3xl p-4 sm:p-7 text-center hover:shadow-2xl hover:border-[#F97316] transition-shadow duration-200 border-2 border-gray-200"
                /*
                  Mobile: transition-shadow only (not transition-all).
                  transition-all triggers style recalc on every frame; limiting
                  to shadow removes that cost entirely.
                */
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4" aria-hidden="true">🫙</div>
                <div
                  className="font-black text-xl sm:text-3xl text-[#F97316] mb-1"
                  style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                >
                  {p.size}
                </div>
                <div className="text-gray-900 font-semibold text-sm mb-1">{p.type}</div>
                <div className="text-[#7A4A2A]/50 text-xs">{p.best}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Manufacturing steps ── */}
      <section
        className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, white 0%, #f9fafb 40%, white 65%, #f3f4f6 100%)' }}
      >
        <Orb className="w-80 h-80 bg-[#F97316]/15 top-10 -left-40" delay={1} />
        <Orb className="w-96 h-96 bg-[#F97316]/10 bottom-0 -right-32" delay={3} />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div {...fadeUpView} className="text-center mb-12">
            <MultiDirectionSlideText
              as="h2"
              text="How We Make It"
              className="text-4xl md:text-5xl font-black text-gray-900"
            />
          </motion.div>

          <div className="relative mt-8">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-16">
              {processSteps.map((s, i) => {
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative grid md:grid-cols-2 gap-8 items-center ${isLeft ? '' : 'md:[&>*:first-child]:order-last'}`}
                  >
                    <div className={`${isLeft ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest bg-[#F97316]`}>
                          STEP {s.step}
                        </span>
                        <span
                          className="text-4xl font-black text-[#7A4A2A]/20"
                          style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                        >
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{s.label}</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                      <div className={`w-5 h-5 rounded-full bg-[#F97316] border-4 border-white shadow-lg`} />
                    </div>

                    <div className={`${isLeft ? 'md:pl-12' : 'md:pr-12'}`}>
                      <div className="relative overflow-hidden rounded-2xl aspect-4/3 bg-white border border-gray-100 shadow-xl flex items-center justify-center p-8 hover:shadow-2xl transition-shadow duration-300">
                         <ZigZagImage src={s.img} alt={s.label} index={i} className="w-full h-full object-contain drop-shadow-md" loading="lazy" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

