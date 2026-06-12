import { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight, MapPin, Phone, Mail, Star, Droplets, Leaf, Zap, Award } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import { MultiDirectionSlideText } from '../components/MultiDirectionSlideText'
import ZigZagImage from '../components/ZigZagImage'
import { siteImages } from '../assets/siteImages.js'
import { PAGE_SEO, buildOrganizationSchema, buildLocalBusinessSchema, buildFAQSchema } from '../seo/seoConfig'

// ─── PERFORMANCE DETECTION HELPERS ───────────────────────────────────────────

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const isLowEndMobile = () => {
  if (typeof window === 'undefined') return false
  const narrow = window.innerWidth < 768
  const lowMem = navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2
  const slowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4
  return narrow && (lowMem || slowCPU)
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
  { name: 'Mango',        img: siteImages.mango,       bg: '#F5C200' },
  { name: 'Orange',       img: siteImages.orange,      bg: '#FF6B35' },
  { name: 'Grapes',       img: siteImages.grape,       bg: '#8B5CF6' },
  { name: 'Paneer Soda',  img: siteImages.paneerSoda,  bg: '#EC4899' },
  { name: 'Cola',         img: siteImages.cola,        bg: '#1E293B' },
  { name: 'Jeera Masala', img: siteImages.jeera,       bg: '#16A34A' },
  { name: 'Mango 2',      img: siteImages.mango2,      bg: '#F97316' },
  { name: 'Apple',        img: siteImages.apple,       bg: '#22C55E' },
  { name: 'White Lemon',  img: siteImages.whiteLemon,  bg: '#EAB308' },
  { name: 'Green Lemon',  img: siteImages.greenLemon,  bg: '#0EA5E9' },
  { name: 'Salt Lemon',   img: siteImages.saltLemon,   bg: '#64748B' },
  { name: 'Pineapple',    img: siteImages.pineapple,   bg: '#FBBF24' },
]

const products = [
  { name: 'Mango',        tag: 'Juice',      img: siteImages.mango,       accent: 'bg-amber-500' },
  { name: 'Apple',        tag: 'Juice',      img: siteImages.apple,       accent: 'bg-red-600' },
  { name: 'Grapes',       tag: 'Juice',      img: siteImages.grape,       accent: 'bg-violet-600' },
  { name: 'Orange',       tag: 'Juice',      img: siteImages.orange,      accent: 'bg-[#F97316]' },
  { name: 'White Lemon',  tag: 'Juice',      img: siteImages.whiteLemon,  accent: 'bg-lime-600' },
  { name: 'Green Lemon',  tag: 'Carbonated', img: siteImages.greenLemon,  accent: 'bg-green-600' },
  { name: 'Paneer Soda',  tag: 'Carbonated', img: siteImages.paneerSoda,  accent: 'bg-fuchsia-600' },
  { name: 'Cola',         tag: 'Carbonated', img: siteImages.cola,        accent: 'bg-stone-700' },
  { name: 'Jeera Masala', tag: 'Carbonated', img: siteImages.jeera,       accent: 'bg-amber-700' },
  { name: 'Salt Lemon',   tag: 'Carbonated', img: siteImages.saltLemon,   accent: 'bg-slate-500' },
  { name: 'Mango 2',      tag: 'Juice',      img: siteImages.mango2,      accent: 'bg-orange-500' },
  { name: 'Pineapple',    tag: 'Juice',      img: siteImages.pineapple,   accent: 'bg-yellow-500' },
]

const stats = [
  { value: '15+',  label: 'Years of Taste',    icon: Award    },
  { value: '16+',  label: 'Product Variants',  icon: Droplets },
  { value: '1M+',  label: 'Happy Customers',   icon: Star     },
  { value: '100%', label: 'Quality Assured',   icon: Leaf     },
]

const pillars = [
  { icon: Leaf,     title: 'Pure Ingredients', desc: 'Responsibly sourced, finest quality ingredients in every bottle.',          color: 'bg-white text-[#F97316]',  border: 'border-gray-200' },
  { icon: Droplets, title: 'Crafted Fresh',    desc: 'Made with care in our state-of-the-art Tamil Nadu facilities.',             color: 'bg-sky-50 text-sky-600',   border: 'border-sky-100'  },
  { icon: Zap,      title: 'Energize Daily',   desc: 'A range for every mood — from calm sips to bold energy.',                   color: 'bg-white text-[#A8430F]',  border: 'border-gray-200' },
]

const storyGrid = [
  { src: siteImages.companyOverview,    label: 'Our Factory',  bg: 'from-white to-white',    border: 'border-gray-200', imageClassName: 'object-cover object-center' },
  { src: siteImages.ourProducts,        label: 'Our Products', bg: 'from-white to-white',    border: 'border-gray-200', imageClassName: 'object-cover object-center' },
  { src: '/images/story/team.jpg',      label: 'Our Team',     bg: 'from-sky-50 to-cyan-50', border: 'border-sky-100',  imageClassName: 'object-cover object-center' },
  { src: '/images/story/community.jpg', label: 'Community',    bg: 'from-rose-50 to-pink-50', border: 'border-rose-100', imageClassName: 'object-cover object-center' },
]

const ticker = ['Salt Lemon','Apple','Grapes','White Lemon','Green Lemon','Mango','Orange','Paneer Soda','Cola','Jeera Masala','Mango 2','Pineapple']

const brandSearchFaqs = [
  {
    question: 'Is Richi Food Products the company behind CILO Juice?',
    answer: 'Yes. Richi Food Products is the Tamil Nadu beverage manufacturer behind CILO Juice and our premium fruit juice and carbonated drink range.',
  },
  {
    question: 'Is CILO Juice the signature beverage brand from Richi Food Products?',
    answer: 'CILO Juice is the flagship beverage brand from Richi Food Products, offering premium fruit juices and carbonated drinks across South India.',
  },
  {
    question: 'Where is Richi Food Products located?',
    answer: 'Richi Food Products operates from Krishnagiri District, Tamil Nadu, and supplies CILO Juice across South India through retailers, distributors, and B2B partners.',
  },
]

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────

const Orb = ({ className, delay = 0 }) => {
  const shouldReduceMotion = prefersReducedMotion()
  const disableOrbs = shouldDisableOrbs()
  if (disableOrbs) return null
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={shouldReduceMotion ? {} : { duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
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
      className={`w-full bg-linear-to-br ${item.bg} border-2 ${item.border} rounded-3xl overflow-hidden aspect-square relative group shadow-lg hover:shadow-2xl transition-all duration-500`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/0 via-[#F97316]/0 to-[#F97316]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      {!imageFailed && (
        <ZigZagImage
          src={item.src}
          alt={item.label}
          index={index}
          className={`w-full h-full ${item.imageClassName ?? 'object-cover object-center'}`}
          onError={() => setImageFailed(true)}
          loading="lazy"
          decoding="async"
        />
      )}
      {imageFailed && <ImgPlaceholder label={item.label} />}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 via-black/30 to-transparent flex items-end pb-3 px-4 z-30">
        <span className="text-white text-sm font-bold tracking-wide">{item.label}</span>
      </div>
    </motion.div>
  )
})

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const shouldReduceMotion = prefersReducedMotion()
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-[#F5D9C8] py-3 bg-white/90 backdrop-blur-sm">
      <div
        className="flex gap-14 w-max"
        style={shouldReduceMotion ? {} : {
          animation: 'ticker-scroll 24s linear infinite',
          willChange: 'transform',
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
  const RX      = isMobile ? (lowEnd ? 130 : 160) : 380
  const RY      = isMobile ? (lowEnd ? 110 : 140) : 300
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

        if (opacity < 0.02) {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          continue
        }

        el.style.opacity   = opacity
        el.style.zIndex    = zIndex
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
            transform: 'translate3d(-50%, -50%, 0)',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        >
          <ZigZagImage
            src={card.img}
            alt={card.name}
            index={i}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '16px',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
            onError={e => { e.target.style.display = 'none' }}
            loading={i < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ))}

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

// ─── PRODUCT POPUP MODAL ──────────────────────────────────────────────────────
function ProductPopup({ image, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row max-w-2xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image area */}
            <div className="flex-1 min-h-[280px] sm:min-h-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFF3E8] to-[#FFE8D0] flex items-center justify-center p-8 sm:p-12 relative">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />
              <motion.img
                src={image.src}
                alt={image.name}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 max-h-64 sm:max-h-80 w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Info area */}
            <div className="sm:w-64 flex flex-col justify-center p-6 sm:p-8 bg-white">
              <span className="inline-block rounded-lg bg-[#F97316] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white mb-3 w-fit">
                {image.tag}
              </span>
              <h3
                className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                {image.name}
              </h3>
              <p className="text-sm text-gray-400 mb-6">{image.code}</p>
              <div className="h-px bg-gray-100 mb-6" />
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Crafted with premium quality ingredients for a refreshing taste experience. Available across South India.
              </p>
              <Link
                to="/products"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F97316] text-white text-sm font-bold rounded-full hover:bg-[#E8630A] transition-colors duration-200"
              >
                View All Products <ArrowRight size={14} />
              </Link>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13" />
                <line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function HoverExpand_001({ images, className }) {
  const [activeImage, setActiveImage] = useState(1)
  const [popupImage, setPopupImage]   = useState(null)

  return (
    <>
      {popupImage && (
        <ProductPopup image={popupImage} onClose={() => setPopupImage(null)} />
      )}

      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className={`relative w-full max-w-6xl px-2 sm:px-5 ${className ?? ''}`}
      >
        <p className="text-center text-xs text-stone-400 mb-3 tracking-wide select-none">
          Hover to expand · Click to preview
        </p>

        <div className="flex w-full items-stretch justify-center gap-1">
          {images.map((image, index) => {
            const isActive = activeImage === index
            return (
              <motion.div
                key={index}
                className="relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl flex flex-col"
                animate={{
                  width:  isActive ? '22rem' : '4.5rem',
                  height: '22rem',
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                onHoverStart={() => setActiveImage(index)}
                onClick={() => setPopupImage(image)}
              >
                {/* ── Background ── */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: '#ffffff',
                  }}
                />





                {/*
                  ── BOTTLE IMAGE ──
                  flex-1 + min-h-0 lets this div shrink below its natural size.
                  The img uses max-h-full + object-contain → full bottle always fits,
                  never cropped, never overflows into the label area below.
                */}
                <div
                  className="relative z-10 flex-1 flex items-center justify-center overflow-hidden"
                  style={{ minHeight: 0, padding: isActive ? '0.75rem 0.75rem 0' : '0.4rem 0.3rem' }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                    style={{ display: 'block' }}
                  />
                </div>

                {/*
                  ── ACTIVE LABEL ──
                  shrink-0 means it never shrinks → image section absorbs all remaining height.
                  Fixed height so bottle always gets the rest of the 22rem.
                */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-20 shrink-0 flex flex-col items-start justify-center px-4 py-3 bg-white border-t border-gray-100"
                      style={{ height: '4.5rem' }}
                    >
                      <span className="inline-block rounded-md bg-[#F97316] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white mb-1">
                        {image.tag}
                      </span>
                      <p
                        className="text-sm font-black text-gray-900 leading-tight"
                        style={{ fontFamily: "'Fredoka','Outfit',sans-serif" }}
                      >
                        {image.name}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{image.code} · click to preview</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── INACTIVE: vertical name label ── */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                    >
                      <p
                        className="text-[9px] font-bold text-stone-400 uppercase tracking-widest select-none"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                      >
                        {image.name}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}



// ─── PRODUCT CARD (mobile fallback) ───────────────────────────────────────────
const ProductCard = memo(function ProductCard({ product, idx, isMobile }) {
  const [hovered, setHovered] = useState(false)

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
        <div
          className="relative flex flex-1 min-h-0 flex-col items-center justify-center overflow-hidden
            bg-linear-to-b from-[#FAFAF9] via-[#FFF8F3] to-white"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `radial-gradient(ellipse 80% 55% at 50% 42%, rgba(249, 115, 22, 0.07) 0%, transparent 55%)`,
            }}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${product.accent} opacity-90`} aria-hidden />
          <span className="absolute left-3 top-3 z-20 inline-flex items-center rounded-md border border-stone-200/90 bg-white/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#57534E] shadow-sm backdrop-blur-sm">
            {product.tag}
          </span>
          <ZigZagImage
            src={product.img}
            alt={product.name}
            index={idx}
            className="absolute inset-0 z-10 mx-auto h-full w-full object-contain p-6 sm:p-8 drop-shadow-[0_12px_28px_rgba(45,22,8,0.12)]"
            onError={e => { e.target.style.display = 'none' }}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative z-20 shrink-0 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-center">
          <p
            className="text-[11px] font-semibold leading-snug tracking-tight text-[#292524] sm:text-sm"
            style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
          >
            {product.name}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
})

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const textY        = useTransform(scrollYProgress, [0, 1],    ['0%', '-18%'])
  const textOpacity  = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const cardsY       = useTransform(scrollYProgress, [0, 1],    ['0%', '12%'])

  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion      = prefersReducedMotion()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const parallaxTextStyle  = isMobile ? {} : { y: textY, opacity: textOpacity }
  const parallaxCardsStyle = isMobile
    ? { position: 'relative', left: '50%', marginLeft: '-50vw', width: '100vw' }
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
        className="relative overflow-x-clip pt-28 sm:pt-32 md:pt-36"
        style={{ minHeight: '100vh', background: '#ffffff' }}
      >
        <div className="absolute inset-0 pointer-events-none bg-pattern-leaf bg-pattern-opacity-55" />

        <Orb className="w-150 h-150 bg-[#F9D4C0]/30 -top-32 -right-48" delay={0} />
        <Orb className="w-100 h-100 bg-yellow-200/15 top-1/2 -left-32"  delay={2} />
        <Orb className="w-75 h-75 bg-cyan-200/15   bottom-32 right-1/4" delay={1} />

        <motion.div
          style={parallaxTextStyle}
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pb-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 sm:mb-6"
          >
            <MultiDirectionSlideText
              as="h1"
              textLeft="CILO Juice"
              textRight="crafted by Richi Food Products"
              className="text-[2.9rem] sm:text-[4.25rem] md:text-[5.45rem] lg:text-[6.2rem] font-bold leading-[0.98] tracking-[-0.03em] text-[#2D1608]"
              rightClassName="text-[#F97316] text-[1.03em] sm:pl-4 md:pl-8"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="text-[#7A4A2A]/55 max-w-lg leading-relaxed mb-8 sm:mb-9 px-1"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
          >
            From vibrant fruit juices to refreshing fizzy favorites, we craft every bottle
            with trusted quality, bold flavor, and a taste made for South India.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex gap-3 sm:gap-4 flex-wrap justify-center w-full"
          >
            <Link
              to="/products"
              className="w-full sm:w-auto justify-center px-7 sm:px-9 py-3.5 bg-[#F97316] text-white font-bold rounded-full shadow-xl shadow-[#F97316]/20
                hover:bg-[#F97316] hover:shadow-[#F97316]/25 transition-all duration-300 flex items-center gap-2"
            >
              Explore CILO Juice <ChevronRight size={16} />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto justify-center px-7 sm:px-9 py-3.5 bg-white/75 backdrop-blur text-[#7A4A2A] font-bold rounded-full
                border border-[#FFD9A8] hover:bg-white hover:border-[#F97316] hover:text-[#F97316]
                transition-all duration-300 shadow-sm inline-flex"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll-reveal hero cards */}
        <motion.div style={parallaxCardsStyle} className="z-10 mt-2">
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

      {/* ══════════ PRODUCTS — HOVER EXPAND ══════════ */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 md:px-10 lg:px-16 bg-white relative overflow-hidden">
        {!isMobile && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        )}
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-gray-200">
              Our Collection
            </span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2
                className="text-4xl md:text-5xl font-black text-gray-900 leading-tight"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
              >
                Refreshing taste for
                <br />
                <span className="text-[#F97316]">New generation</span>
              </h2>
              <Link to="/products" className="flex items-center gap-2 text-[#F97316] font-semibold hover:gap-3 transition-all duration-200 shrink-0">
                View all products <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Desktop: hover-expand accordion */}
          {!isMobile && (
            <div className="flex justify-center">
              <HoverExpand_001
                className=""
                images={products.map((p, i) => ({
                  src:  p.img,
                  alt:  p.name,
                  name: p.name,
                  tag:  p.tag,
                  code: `# ${String(i + 1).padStart(2, '0')}`,
                }))}
              />
            </div>
          )}

          {/* Mobile: 2-col grid fallback */}
          {isMobile && (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, idx) => (
                <ProductCard key={product.name} product={product} idx={idx} isMobile={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ STATS STRIP ══════════ */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#F97316] via-[#A8430F] to-[#2D1608]" />
        <Orb className="w-125 h-125 bg-white/10 -top-48 -left-32"      delay={0} />
        <Orb className="w-100 h-100 bg-[#FF6B35]/10 bottom-0 -right-40" delay={2} />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
                  <motion.div className="text-3xl sm:text-5xl lg:text-6xl font-black" style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}>
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
      <section className="py-18 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-10 lg:px-16 bg-linear-to-b from-white via-white to-gray-50 relative overflow-hidden">
        <Orb className="w-125 h-125 bg-[#F97316]/8 -top-40 -left-48"   delay={0} />
        <Orb className="w-100 h-100 bg-[#F97316]/5 bottom-20 -right-32" delay={1} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#FFD9A8] shadow-sm">
              Our Story
            </span>
            <MultiDirectionSlideText
              as="h2"
              textLeft="Refreshing taste buds"
              textRight="2024 marked our beginning excellence drives our journey"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5 sm:mb-6"
              rightClassName="text-[#F97316]"
            />
            <p className="text-gray-500 leading-relaxed text-base sm:text-lg mb-7 sm:mb-8">
              Based in Tamil Nadu, Richi Food Products crafts premium, refreshing beverages with
              absolute care and passion. Our signature CILO Juice range is made using
              high-quality ingredients, bringing authentic taste and delight to families, retailers, and distributors across South India.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-linear-to-r from-[#F97316] to-[#A8430F] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#F97316]/30 transition-all duration-300 w-full sm:w-auto"
            >
              Read our Story <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {storyGrid.map((item, i) => (
              <StoryGridCard key={item.label} item={item} index={i} isMobile={isMobile} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ PILLARS ══════════ */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-10 lg:px-16 bg-[#FFF9F3] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="inline-block px-4 py-1.5 bg-white text-[#7A4A2A] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Brand Search
            </span>
            <MultiDirectionSlideText
              as="h2"
              textLeft="Looking for Richi Food Products,"
              textRight="CILO Juice?"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-5"
              rightClassName="text-[#F97316]"
            />
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              They all lead back to the same Tamil Nadu manufacturer. CILO Juice is the flagship
              beverage line from Richi Food Products, trusted for refreshing flavors and reliable
              quality across South India.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {brandSearchFaqs.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={isMobile ? {} : { y: -8 }}
                className="rounded-3xl border border-[#FFD9A8] bg-white p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-[#F97316] text-white font-bold rounded-full hover:shadow-xl hover:shadow-[#F97316]/25 transition-all duration-300 w-full sm:w-auto"
            >
              About Richi Food Products <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 bg-white text-[#7A4A2A] font-bold rounded-full border border-[#FFD9A8] hover:border-[#F97316] hover:text-[#F97316] transition-all duration-300 w-full sm:w-auto"
            >
              Browse CILO Juice Range
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ COMMITMENT (PILLARS) ══════════ */}
      <section className="py-18 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-10 lg:px-16 bg-white relative overflow-hidden">
        <Orb className="w-150 h-150 bg-[#F97316]/6 top-1/2 left-1/4 -translate-y-1/2" delay={0} />
        <Orb className="w-125 h-125 bg-[#F97316]/5 -bottom-32 right-1/4"               delay={2} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-[#FFF8EE] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-[#FFD9A8] shadow-sm">
              Why Richi Food Products
            </span>
            <MultiDirectionSlideText
              as="h2"
              text="Our Commitment to You"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4"
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={isMobile ? {} : { y: -12, scale: 1.02 }}
                className={`group border-2 ${p.border} rounded-3xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl transition-all duration-500 relative overflow-hidden bg-linear-to-br ${
                  p.color === 'bg-white text-[#F97316]' ? 'from-white to-[#FFFBF7]'
                  : p.color === 'bg-sky-50 text-sky-600' ? 'from-sky-50 to-blue-50'
                  : 'from-white to-orange-50'
                }`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#F97316]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${p.color} flex items-center justify-center mb-5 sm:mb-6 relative z-10 group-hover:shadow-lg transition-all duration-300`}
                  whileHover={isMobile ? {} : { scale: 1.1, rotate: 6 }}
                >
                  <p.icon size={28} />
                </motion.div>
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 group-hover:text-[#F97316] transition-colors duration-300">{p.title}</h3>
                  <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DEALERSHIP CTA ══════════ */}
      <section className="py-18 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-10 lg:px-16 bg-linear-to-br from-gray-900 via-gray-900 to-[#1A0C04] relative overflow-hidden">
        <Orb className="w-175 h-175 bg-[#F97316]/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={0} />
        <Orb className="w-125 h-125 bg-[#A8430F]/10 -bottom-40 -left-32"                                  delay={2} />
        <Orb className="w-100 h-100 bg-[#F97316]/8 -top-32 -right-32"                                     delay={1} />
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
              className="text-4xl sm:text-5xl md:text-6xl mb-6 sm:mb-8 inline-block"
              whileInView={isMobile ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 1.2 }}
            >
              🤝
            </motion.div>

            <MultiDirectionSlideText
              as="h2"
              text="Join the Richi Family Today"
              className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-5 sm:mb-6 leading-tight"
            />

            <p className="text-gray-300 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the extraordinary delight. Become a dealer and bring Richi
              beverages to your community.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/dealership"
                  className="inline-flex items-center justify-center gap-2 px-7 sm:px-10 py-3.5 sm:py-4 bg-linear-to-r from-[#F97316] to-[#A8430F] text-white font-bold rounded-full hover:shadow-2xl hover:shadow-[#F97316]/40 transition-all duration-300 w-full sm:w-auto"
                >
                  Become a Dealer <ChevronRight size={18} />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 sm:px-10 py-3.5 sm:py-4 bg-white/15 backdrop-blur text-white font-bold rounded-full border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 w-full sm:w-auto"
                >
                  <Phone size={16} /> Contact Us
                </Link>
              </motion.div>
            </div>

            <div className="pt-8 sm:pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 justify-center text-sm text-gray-300">
                <a href="tel:9443518521" className="flex items-center justify-center sm:justify-start gap-3 hover:text-[#F97316] transition-colors group text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#F97316] transition-colors">
                    <Phone size={16} />
                  </div>
                  94435 18521 / 99443 66592
                </a>
                <a href="mailto:richifoodproduct@gmail.com" className="flex items-center justify-center sm:justify-start gap-3 hover:text-[#F97316] transition-colors group text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#F97316] transition-colors">
                    <Mail size={16} />
                  </div>
                  richifoodproduct@gmail.com
                </a>
                <span className="flex items-center justify-center sm:justify-start gap-3 text-center sm:text-left">
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
