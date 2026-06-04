import { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight, MapPin, Phone, Mail, Star, Droplets, Leaf, Zap, Award } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { PAGE_SEO, buildOrganizationSchema, buildLocalBusinessSchema, buildFAQSchema } from '../seo/seoConfig'

// ─── PERFORMANCE DETECTION HELPERS ───────────────────────────────────────────

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Detect low-end mobile: <768px wide, or low deviceMemory, or no PointerEvents (touch-only)
const isLowEndMobile = () => {
  if (typeof window === 'undefined') return false
  const narrow = window.innerWidth < 768
  const lowMem = navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2
  const slowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  return narrow && (lowMem || slowCPU)
}

const isMobileViewport = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

const shouldDisableOrbs = () => {
  if (typeof window === 'undefined') return false
  if (typeof navigator !== 'undefined' && navigator.deviceMemory) {
    return navigator.deviceMemory <= 4
  }
  return window.innerWidth < 480
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const heroCards = [
  { name: 'Mango',        img: '/images/products/mango.png',        bg: '#F5C200' },
  { name: 'Orange',       img: '/images/products/orange.png',       bg: '#FF6B35' },
  { name: 'Grapes',       img: '/images/products/grapes.png',       bg: '#8B5CF6' },
  { name: 'Paneer Soda',  img: '/images/products/paneer_soda.png',  bg: '#EC4899' },
  { name: 'Cola',         img: '/images/products/cola.png',         bg: '#1E293B' },
  { name: 'Jeera Masala', img: '/images/products/jeera_masala.png', bg: '#16A34A' },
  { name: 'Mango 2',      img: '/images/products/mango_2.png',      bg: '#F97316' },
  { name: 'Apple',        img: '/images/products/apple.png',        bg: '#22C55E' },
  { name: 'White Lemon',  img: '/images/products/white_lemon.png',  bg: '#EAB308' },
  { name: 'Green Lemon',  img: '/images/products/green_lemon.png',  bg: '#0EA5E9' },
  { name: 'Salt Lemon',   img: '/images/products/salt_lemon.png',   bg: '#64748B' },
  { name: 'Pineapple',    img: '/images/products/pine_apple.png',   bg: '#FBBF24' },
]

// Carousel cards: `accent` = subtle brand tint (left bar + hover). Gradients removed from UI for a calmer, editorial look.
const products = [
  { name: 'Mango',        tag: 'Juice',      img: '/images/products/mango.png',        accent: 'bg-amber-500' },
  { name: 'Apple',        tag: 'Juice',      img: '/images/products/apple.png',        accent: 'bg-red-600' },
  { name: 'Grapes',       tag: 'Juice',      img: '/images/products/grapes.png',       accent: 'bg-violet-600' },
  { name: 'Orange',       tag: 'Juice',      img: '/images/products/orange.png',       accent: 'bg-[#F97316]' },
  { name: 'White Lemon',  tag: 'Juice',      img: '/images/products/white_lemon.png',  accent: 'bg-lime-600' },
  { name: 'Green Lemon',  tag: 'Carbonated', img: '/images/products/green_lemon.png',  accent: 'bg-green-600' },
  { name: 'Paneer Soda',  tag: 'Carbonated', img: '/images/products/paneer_soda.png',  accent: 'bg-fuchsia-600' },
  { name: 'Cola',         tag: 'Carbonated', img: '/images/products/cola.png',         accent: 'bg-stone-700' },
  { name: 'Jeera Masala', tag: 'Carbonated', img: '/images/products/jeera_masala.png', accent: 'bg-amber-700' },
  { name: 'Salt Lemon',   tag: 'Carbonated', img: '/images/products/salt_lemon.png',   accent: 'bg-slate-500' },
  { name: 'Mango 2',      tag: 'Juice',      img: '/images/products/mango_2.png',      accent: 'bg-orange-500' },
  { name: 'Pineapple',    tag: 'Juice',      img: '/images/products/pine_apple.png',   accent: 'bg-yellow-500' },
]

const stats = [
  { value: '15+',  label: 'Years of Taste',    icon: Award    },
  { value: '12+',  label: 'Product Variants',  icon: Droplets },
  { value: '1M+',  label: 'Happy Customers',   icon: Star     },
  { value: '100%', label: 'Quality Assured',   icon: Leaf     },
]

const pillars = [
  { icon: Leaf,     title: 'Pure Ingredients', desc: 'Responsibly sourced, finest quality ingredients in every bottle.',          color: 'bg-white text-[#F97316]',  border: 'border-gray-200' },
  { icon: Droplets, title: 'Crafted Fresh',    desc: 'Made with care in our state-of-the-art Tamil Nadu facilities.',             color: 'bg-sky-50 text-sky-600',   border: 'border-sky-100'  },
  { icon: Zap,      title: 'Energize Daily',   desc: 'A range for every mood — from calm sips to bold energy.',                   color: 'bg-white text-[#A8430F]',  border: 'border-gray-200' },
]

const storyGrid = [
  { src: '/images/products/company-overview.png', label: 'Our Factory',  bg: 'from-white to-white',    border: 'border-gray-200', imageClassName: 'object-cover object-center' },
  { src: '/images/products/our_products.png',     label: 'Our Products', bg: 'from-white to-white',    border: 'border-gray-200', imageClassName: 'object-cover object-center' },
  { src: '/images/story/team.jpg',                label: 'Our Team',     bg: 'from-sky-50 to-cyan-50', border: 'border-sky-100',  imageClassName: 'object-cover object-center' },
  { src: '/images/story/community.jpg',           label: 'Community',    bg: 'from-rose-50 to-pink-50', border: 'border-rose-100', imageClassName: 'object-cover object-center' },
]

const ticker = ['Salt Lemon','Apple','Grapes','White Lemon','Green Lemon','Mango','Orange','Paneer Soda','Cola','Jeera Masala','Mango 2','Pineapple']

const brandSearchFaqs = [
  {
    question: 'Is Richi Food Products the company behind CILO Juice?',
    answer: 'Yes. Richi Food Products is the Tamil Nadu beverage manufacturer behind CILO Juice and our premium fruit juice and carbonated drink range.',
  },
  {
    question: 'Is Richi Juice the same as CILO Juice?',
    answer: 'Many customers search for Richi Juice when looking for the beverages made by Richi Food Products. CILO Juice is the flagship brand on the same company website.',
  },
  {
    question: 'Where is Richi Food Products located?',
    answer: 'Richi Food Products operates from Krishnagiri District, Tamil Nadu, and supplies CILO Juice across South India through retailers, distributors, and B2B partners.',
  },
]

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

// Orb: skip on mobile entirely to avoid stacking blur-3xl compositing layers
const Orb = ({ className, delay = 0 }) => {
  const shouldReduceMotion = prefersReducedMotion()
  const disableOrbs = shouldDisableOrbs()
  if (disableOrbs) return null
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      // Use CSS animation instead of JS-driven values to stay off the main thread
      animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={shouldReduceMotion ? {} : { duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      // Force GPU layer so blur doesn't trigger layout
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
    />
  )
}

function ImgPlaceholder({ label, dark = false }) {
  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none select-none
      ${dark ? 'text-white/40' : 'text-gray-300'}`}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-widest text-center px-3 leading-tight">{label}</span>
    </div>
  )
}

const StoryGridCard = memo(function StoryGridCard({ item, index, isMobile }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: isMobile ? index * 0.08 : index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={isMobile ? {} : { scale: 1.05, rotate: 2 }}
      className={`w-full bg-gradient-to-br ${item.bg} border-2 ${item.border} rounded-3xl overflow-hidden aspect-[1/1] relative group shadow-lg hover:shadow-2xl transition-all duration-500`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-[#F97316]/0 to-[#F97316]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      {!imageFailed && (
        <img
          src={item.src}
          alt={item.label}
          className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${item.imageClassName ?? 'object-cover object-center'}`}
          onError={() => setImageFailed(true)}
          loading="lazy"
          decoding="async"
        />
      )}
      {imageFailed && <ImgPlaceholder label={item.label} />}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end pb-3 px-4 z-30">
        <span className="text-white text-sm font-bold tracking-wide">{item.label}</span>
      </div>
    </motion.div>
  )
})

// ─── TICKER ───────────────────────────────────────────────────────────────────
// FIX: use CSS animation instead of Framer Motion JS-driven x-translate.
// CSS animations run on the compositor thread → no JS involvement per frame.
function Ticker() {
  const shouldReduceMotion = prefersReducedMotion()
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-[#F5D9C8] py-3 bg-white/90 backdrop-blur-sm">
      <div
        className="flex gap-14 w-max"
        style={shouldReduceMotion ? {} : {
          // Pure CSS keyframe animation — compositor-thread only, zero JS per frame
          animation: 'ticker-scroll 24s linear infinite',
          willChange: 'transform',
          // Force GPU compositing layer
          transform: 'translateZ(0)',
        }}
      >
        {[...ticker, ...ticker].map((t, i) => (
          <span key={i} className="text-sm font-semibold text-[#9A3412] tracking-widest uppercase flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8845A] inline-block" />
            {t}
          </span>
        ))}
      </div>
      {/* Inject keyframe once via a style tag — avoids adding a global CSS file */}
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

// ─── ROTATING HERO CARDS ──────────────────────────────────────────────────────
// FIXES:
// 1. Store angle in a ref — no React re-render per frame.
// 2. Write transforms directly to DOM via ref map.
// 3. On mobile: reduce N (fewer cards) to cut draw calls.
// 4. Use transform: translate3d() to keep everything on GPU.
function RotatingHeroCards({ isMobile }) {
  const N = heroCards.length
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const angleRef = useRef(0)
  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const shouldReduceMotion = prefersReducedMotion()
  const lowEnd = useMemo(() => isLowEndMobile(), [])

  const CARD_W  = isMobile ? 110 : 170
  const CARD_H  = isMobile ? 240 : 380
  // On low-end mobile, use smaller radii for even less overdraw
  const RX      = isMobile ? (lowEnd ? 130 : 160) : 380
  const RY      = isMobile ? (lowEnd ? 110 : 140) : 300
  // Slightly slower on mobile to ease GPU pressure
  const SPEED   = isMobile ? (lowEnd ? 14 : 16) : 18

  const containerH = isMobile ? 420 : 640
  const centreY    = containerH * 0.78

  useEffect(() => {
    if (shouldReduceMotion) return

    const animate = (ts) => {
      if (lastRef.current === null) lastRef.current = ts
      const delta = (ts - lastRef.current) / 1000
      lastRef.current = ts
      angleRef.current = (angleRef.current + SPEED * delta) % 360

      const angleDeg = angleRef.current

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i]
        if (!el) continue

        const theta    = ((angleDeg + i * (360 / N)) % 360) * (Math.PI / 180)
        const x        = Math.sin(theta) * RX
        const y        = -Math.cos(theta) * RY
        const yNorm    = y / RY
        const opacity  = Math.max(0, Math.min(1, (-yNorm + 0.45) * 3.2))
        const scale    = 0.58 + (1 - Math.abs(Math.sin(theta))) * 0.16 + ((-yNorm + 1) / 2) * 0.18
        const zIndex   = Math.round(opacity * 80 + (1 - Math.abs(Math.sin(theta))) * 20)
        const tiltDeg  = Math.sin(theta) * 14

        // Skip invisible cards — avoids painting offscreen elements
        if (opacity < 0.02) {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          continue
        }

        // Write directly to style — zero React overhead
        el.style.opacity   = opacity
        el.style.zIndex    = zIndex
        // translate3d keeps everything on the GPU compositor layer
        el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale}) rotate(${tiltDeg}deg)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [shouldReduceMotion, N, RX, RY, SPEED])

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: containerH, overflow: 'hidden' }}
    >
      {heroCards.map((card, i) => (
        <div
          key={card.name}
          ref={el => cardRefs.current[i] = el}
          style={{
            position: 'absolute',
            left: '50%',
            top: centreY,
            width: CARD_W,
            height: CARD_H,
            // Use translate3d on the base positioning too so the GPU layer is pre-established
            transform: `translate3d(-50%, -50%, 0)`,
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        >
          <img
            src={card.img}
            alt={card.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '16px',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
            onError={e => { e.target.style.display = 'none' }}
            // Lazy-load all but the first few visible cards
            loading={i < 3 ? 'eager' : 'lazy'}
            // Hint browser to decode off main thread
            decoding="async"
          />
        </div>
      ))}

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: isMobile ? '100px' : '160px',
        background: 'linear-gradient(to top, #ffffff 0%, #ffffff 15%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.3) 70%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 300,
      }} />
    </div>
  )
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
// FIXES:
// 1. Guard window.innerWidth with a safe default (false) for SSR safety.
// 2. Disable whileInView on mobile to prevent intersection observer overhead × 12 cards.
// 3. Simplify hover animations on mobile (no lift effect).
const ProductCard = memo(function ProductCard({ product, idx, isMobile }) {
  const [hovered, setHovered] = useState(false)

  // On mobile: no entry animation (viewport observer fires for every card → jank)
  // On desktop: keep the original staggered entrance
  const motionProps = isMobile
    ? {}
    : {
        initial:    { opacity: 0, y: 40 },
        whileInView:{ opacity: 1, y: 0  },
        viewport:   { once: true         },
        transition: { delay: idx * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <motion.div
      {...motionProps}
      onHoverStart={() => !isMobile && setHovered(true)}
      onHoverEnd={()   => !isMobile && setHovered(false)}
      className="relative group cursor-pointer w-full"
    >
      <motion.div
        animate={{ y: !isMobile && hovered ? -6 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-md transition-shadow duration-300 group-hover:shadow-lg group-hover:border-stone-300/90"
        style={{ aspectRatio: '5 / 6' }}
      >
        {/* Same studio-style backdrop for every card — reads more premium than mixed pack shots */}
        <div
          className="relative flex flex-1 min-h-0 flex-col items-center justify-center overflow-hidden
            bg-gradient-to-b from-[#FAFAF9] via-[#FFF8F3] to-white"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `radial-gradient(ellipse 80% 55% at 50% 42%, rgba(249, 115, 22, 0.07) 0%, transparent 55%)`,
            }}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${product.accent} opacity-90`} aria-hidden />
          <span
            className="absolute left-3 top-3 z-20 inline-flex items-center rounded-md border border-stone-200/90 bg-white/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#57534E] shadow-sm backdrop-blur-sm"
          >
            {product.tag}
          </span>
          <img
            src={product.img}
            alt={product.name}
            className="absolute inset-0 z-10 mx-auto h-full w-full object-contain p-6 sm:p-8 transition-transform duration-500 ease-out group-hover:scale-[1.03] drop-shadow-[0_12px_28px_rgba(45,22,8,0.12)]"
            onError={e => { e.target.style.display = 'none' }}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative z-20 shrink-0 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-center">
          <p
            className="text-[11px] font-semibold leading-snug tracking-tight text-[#292524] sm:text-sm"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {product.name}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
})

// ─── PRODUCT CAROUSEL ─────────────────────────────────────────────────────────
// FIXES:
// 1. Accept isMobile as prop instead of re-running window check each render.
// 2. Pass isMobile down to ProductCard so it can simplify animations.
// 3. Reduce card re-mount churn: use stable keys based on product name.
// 4. Throttle autoplay interval to avoid forcing JS work during touch scrolling.
function ProductCarousel({ products, isMobile }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduceMotion = prefersReducedMotion()
  // Show 2 cards on mobile so each is legible; 4 on desktop
  const CARDS_TO_SHOW = isMobile ? 2 : 4

  const getVisibleProducts = useCallback(() => {
    const visible = []
    for (let i = 0; i < CARDS_TO_SHOW; i++) {
      visible.push(products[(currentIndex + i) % products.length])
    }
    return visible
  }, [currentIndex, products, CARDS_TO_SHOW])

  const handleNext = useCallback(() => setCurrentIndex(prev => (prev + 1) % products.length), [products.length])
  const handlePrev = useCallback(() => setCurrentIndex(prev => (prev - 1 + products.length) % products.length), [products.length])

  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(handleNext, isMobile ? 7000 : 5000)
    return () => clearInterval(interval)
  }, [shouldReduceMotion, isMobile, handleNext])

  const visibleProducts = getVisibleProducts()

  // On mobile: show compact page-style dots (prev • current • next) instead of 12 individual dots
  const totalPages = Math.ceil(products.length / CARDS_TO_SHOW)
  const currentPage = Math.floor(currentIndex / CARDS_TO_SHOW)

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden py-8">
        <motion.div className="flex gap-3 sm:gap-5 justify-center items-center">
          {visibleProducts.map((product, idx) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: isMobile ? 0.3 : 0.5, delay: idx * (isMobile ? 0.04 : 0.08) }}
              className="flex-shrink-0"
              style={{ width: isMobile ? 'calc(50% - 6px)' : '220px', maxWidth: isMobile ? '160px' : '220px' }}
            >
              <ProductCard product={product} idx={idx} isMobile={isMobile} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#F97316] text-[#F97316] flex items-center justify-center hover:bg-[#FFF8EE] transition-all duration-300 shadow-lg"
          aria-label="Previous products"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        {/* Mobile: page-style dots. Desktop: individual dots */}
        <div className="flex gap-2">
          {isMobile
            ? Array.from({ length: totalPages }).map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * CARDS_TO_SHOW)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-[#F97316] w-8' : 'bg-[#F97316]/30 w-2'}`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))
            : products.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#F97316] w-8' : 'bg-[#F97316]/30 w-2'}`}
                  whileHover={{ scale: 1.2 }}
                  aria-label={`Go to product ${idx + 1}`}
                />
              ))
          }
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#F97316] to-[#A8430F] text-white flex items-center justify-center hover:shadow-lg transition-all duration-300 shadow-lg"
          aria-label="Next products"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  // FIXES:
  // 1. On mobile: disable parallax scroll transforms entirely.
  //    Parallax forces layout recalc on every scroll tick → the #1 cause of janky scrolling.
  // 2. Use `useTransform` with identity values on mobile so the hook still runs
  //    but does nothing, avoiding conditional hook errors.
  const textY          = useTransform(scrollYProgress, [0, 1],    ['0%', '-18%'])
  const textOpacity    = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const cardsY         = useTransform(scrollYProgress, [0, 1],    ['0%', '12%'])

  const [isMobile, setIsMobile]   = useState(false)
  const [isTablet, setIsTablet]   = useState(false)
  const shouldReduceMotion        = prefersReducedMotion()

  // Initialise from window on mount so there's no flash of wrong layout
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)
      setIsTablet(w >= 768 && w < 1024)
    }
    handleResize()
    // Passive listener — never blocks scroll events
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // On mobile: skip parallax motion styles to avoid per-scroll recalcs
  const parallaxTextStyle    = isMobile ? {} : { y: textY, opacity: textOpacity }
  const parallaxCardsStyle   = isMobile ? { position: 'relative', left: '50%', marginLeft: '-50vw', width: '100vw' }
                                        : { y: cardsY, position: 'relative', left: '50%', marginLeft: '-50vw', width: '100vw' }

  const seo = PAGE_SEO.home
  const schema = [
    buildOrganizationSchema(),
    buildLocalBusinessSchema(),
    buildFAQSchema(brandSearchFaqs),
  ]

  return (
    <PageWrapper
      title={seo.title}
      description={seo.description}
      url="/"
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >

      {/* ══════════ HERO ══════════ */}
      <section
        ref={heroRef}
        className="relative overflow-x-clip pt-20 sm:pt-24 md:pt-32"
        style={{ minHeight: '100vh', background: '#ffffff' }}
      >
        <div className="absolute inset-0 pointer-events-none bg-pattern-leaf bg-pattern-opacity-55" />

        {/* Orbs hidden on mobile (<480px) via shouldDisableOrbs */}
        <Orb className="w-[600px] h-[600px] bg-[#F9D4C0]/30 -top-32 -right-48" delay={0} />
        <Orb className="w-[400px] h-[400px] bg-yellow-200/15 top-1/2 -left-32"  delay={2} />
        <Orb className="w-[300px] h-[300px] bg-cyan-200/15   bottom-32 right-1/4" delay={1} />

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center justify-center gap-2 text-xs text-[#F97316]/60 font-semibold uppercase tracking-widest mb-8 px-6"
        >
          <span className="text-[#7A4A2A]">Home</span>
        </motion.div>

        {/* Text content — no parallax on mobile */}
        <motion.div
          style={parallaxTextStyle}
          className="relative z-10 flex flex-col items-center text-center px-6 pb-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#FFD9A8] shadow-sm text-[#7A4A2A] text-xs font-bold mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4622A] animate-pulse" />
            Premium beverages from Krishnagiri, Tamil Nadu
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-[1.07] tracking-tight text-[#2D1608] mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.4rem, 6vw, 5rem)',
            }}
          >
            CILO Juice
            <br />
            <span className="text-[#F97316]">crafted by Richi Food Products</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="text-[#7A4A2A]/55 max-w-lg leading-relaxed mb-9"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
          >
            From vibrant fruit juices to refreshing fizzy favorites, we craft every bottle
            with trusted quality, bold flavor, and a taste made for South India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Link
              to="/products"
              className="px-9 py-3.5 bg-[#F97316] text-white font-bold rounded-full shadow-xl shadow-[#F97316]/20
                hover:bg-[#F97316] hover:shadow-[#F97316]/25 transition-all duration-300 flex items-center gap-2"
            >
              Explore CILO Juice <ChevronRight size={16} />
            </Link>
            <Link
              to="/about"
              className="px-9 py-3.5 bg-white/75 backdrop-blur text-[#7A4A2A] font-bold rounded-full
                border border-[#FFD9A8] hover:bg-white hover:border-[#F97316] hover:text-[#F97316]
                transition-all duration-300 shadow-sm"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Rotating hero cards — no parallax on mobile */}
        <motion.div
          style={parallaxCardsStyle}
          className="z-10 mt-2"
        >
          <RotatingHeroCards isMobile={isMobile} />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="relative z-10 flex flex-col items-center gap-1 pb-6 mt-4"
        >
          <span className="text-[10px] text-[#F97316]/45 font-bold tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
            transition={shouldReduceMotion ? {} : { duration: 1.4, repeat: Infinity }}
            className="w-4 h-6 rounded-full border-2 border-[#F97316]/35 flex items-start justify-center pt-1"
          >
            <div className="w-0.5 h-1.5 bg-[#F97316]/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════ TICKER ══════════ */}
      <Ticker />

      {/* ══════════ PRODUCTS GRID ══════════ */}
      <section className="py-28 px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden">
        {/* Decorative blur — skip paint on mobile */}
        {!isMobile && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        )}
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-gray-200">
              Our Collection
            </span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2
                className="text-4xl md:text-5xl font-black text-gray-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Discover the extensive assortment
                <br />
                <span className="text-[#F97316]">of beverages we offer</span>
              </h2>
              <Link to="/products" className="flex items-center gap-2 text-[#F97316] font-semibold hover:gap-3 transition-all duration-200 shrink-0">
                View all products <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <div className="flex justify-center">
            <ProductCarousel products={products} isMobile={isMobile} />
          </div>
        </div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#A8430F] to-[#2D1608]" />
        <Orb className="w-[500px] h-[500px] bg-white/10 -top-48 -left-32"      delay={0} />
        <Orb className="w-[400px] h-[400px] bg-[#FF6B35]/10 bottom-0 -right-40" delay={2} />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              // Disable hover lift on mobile (no hover on touch)
              whileHover={isMobile ? {} : { y: -8, scale: 1.03 }}
              className="group cursor-pointer text-center relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl" />
              <motion.div className="relative z-10 flex flex-col items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-all duration-500 shadow-lg"
                  whileHover={isMobile ? {} : { rotate: 10, scale: 1.1 }}
                >
                  <s.icon size={24} className="text-white/90" />
                </motion.div>
                <div className="text-white">
                  <motion.div className="text-6xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {s.value}
                  </motion.div>
                  <div className="text-white/70 text-xs font-bold tracking-widest uppercase mt-2">{s.label}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ OUR STORY ══════════ */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-white via-white to-gray-50 relative overflow-hidden">
        <Orb className="w-[500px] h-[500px] bg-[#F97316]/8 -top-40 -left-48"   delay={0} />
        <Orb className="w-[400px] h-[400px] bg-[#F97316]/5 bottom-20 -right-32" delay={1} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#FFD9A8] shadow-sm">
              Our Story
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Refreshing taste buds
              <br />
              <span className="text-[#F97316]">since 2008</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg mb-8">
              Based in Tamil Nadu, Richi Food Products crafts premium, refreshing beverages with
              absolute care and passion. Our signature CILO Juice and Richi Juice ranges are made using
              high-quality ingredients, bringing authentic taste and delight to families, retailers, and distributors across South India.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F97316] to-[#A8430F] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#F97316]/30 transition-all duration-300"
            >
              Read our Story <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {storyGrid.map((item, i) => (
              <StoryGridCard key={item.label} item={item} index={i} isMobile={isMobile} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ PILLARS ══════════ */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[#FFF9F3] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Brand Search
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Looking for Richi Food Products,
              <br />
              <span className="text-[#F97316]">Richi Juice, or CILO Juice?</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              They all lead back to the same Tamil Nadu manufacturer. CILO Juice is the flagship
              beverage line from Richi Food Products, and many customers refer to the range as
              Richi Juice when searching online.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {brandSearchFaqs.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={isMobile ? {} : { y: -8 }}
                className="rounded-3xl border border-[#FFD9A8] bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#F97316] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#F97316]/25 transition-all duration-300"
            >
              About Richi Food Products <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#7A4A2A] font-bold rounded-full border border-[#FFD9A8] hover:border-[#F97316] hover:text-[#F97316] transition-all duration-300"
            >
              Browse CILO Juice Range
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-[#F97316]/6 top-1/2 left-1/4 -translate-y-1/2" delay={0} />
        <Orb className="w-[500px] h-[500px] bg-[#F97316]/5 -bottom-32 right-1/4"               delay={2} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Why Richi Food Products
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Commitment to You
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={isMobile ? {} : { y: -12, scale: 1.02 }}
                className={`group border-2 ${p.border} rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 relative overflow-hidden bg-gradient-to-br ${
                  p.color === 'bg-white text-[#F97316]' ? 'from-white to-[#FFFBF7]'
                  : p.color === 'bg-sky-50 text-sky-600' ? 'from-sky-50 to-blue-50'
                  : 'from-white to-orange-50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  className={`w-16 h-16 rounded-2xl ${p.color} flex items-center justify-center mb-6 relative z-10 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={isMobile ? {} : { scale: 1.1, rotate: 6 }}
                >
                  <p.icon size={28} />
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[#F97316] transition-colors duration-300">{p.title}</h3>
                  <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CSR ══════════ */}
      <section className="hidden py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-gray-50 via-white to-white relative overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-[#F97316]/7 -top-40 -right-48" delay={0} />
        <Orb className="w-[400px] h-[400px] bg-[#F97316]/5 bottom-10 -left-32" delay={1} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            // Skip the rotation on mobile — rotate triggers layout recalc
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/10 via-transparent to-[#F97316]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
            <img
              src="/images/csr/csr-banner.jpg"
              alt="CSR Initiative"
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
              onError={e => { e.target.style.display = 'none' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-[#F97316] font-bold text-sm tracking-widest uppercase">CSR Image</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#FFD9A8] shadow-sm">
              Corporate Social Responsibility
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              We manufacture delicious drinks
              <br />
              <span className="text-[#F97316]">with conscience</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 leading-relaxed">
              Our sustainable practices, community investments, and environmental stewardship
              shape a brighter future for everyone in Tamil Nadu and beyond.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F97316] to-[#A8430F] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#F97316]/30 transition-all duration-300"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════ DEALERSHIP CTA ══════════ */}
      <section className="py-32 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1A0C04] relative overflow-hidden">
        <Orb className="w-[700px] h-[700px] bg-[#F97316]/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={0} />
        <Orb className="w-[500px] h-[500px] bg-[#A8430F]/10 -bottom-40 -left-32"                                  delay={2} />
        <Orb className="w-[400px] h-[400px] bg-[#F97316]/8 -top-32 -right-32"                                     delay={1} />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: isMobile ? 0.95 : 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-6xl mb-8 inline-block"
              // Skip wiggle on mobile — rotate causes layout jank
              whileInView={isMobile ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 1.2 }}
            >
              🤝
            </motion.div>

            <h2
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Join the Richi Family Today
            </h2>

            <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the extraordinary delight. Become a dealer and bring Richi
              beverages to your community.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/dealership"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#A8430F] text-white font-bold rounded-full hover:shadow-2xl hover:shadow-[#F97316]/40 transition-all duration-300"
                >
                  Become a Dealer <ChevronRight size={18} />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white/15 backdrop-blur text-white font-bold rounded-full border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300"
                >
                  <Phone size={16} /> Contact Us
                </Link>
              </motion.div>
            </div>

            <div className="pt-12 border-t border-white/10">
              <div className="flex flex-wrap gap-8 justify-center text-sm text-gray-300">
                <a href="tel:9443518521" className="flex items-center gap-3 hover:text-[#F97316] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#F97316] transition-colors">
                    <Phone size={16} />
                  </div>
                  94435 18521 / 99443 66592
                </a>
                <a href="mailto:richifoodproduct@gmail.com" className="flex items-center gap-3 hover:text-[#F97316] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#F97316] transition-colors">
                    <Mail size={16} />
                  </div>
                  richifoodproduct@gmail.com
                </a>
                <span className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  Karagur Village, Paiyur - 2, Krishnagiri District - 635112
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </PageWrapper>
  )
}
