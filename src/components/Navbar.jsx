import { useState, useEffect, memo, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

/* ── Nav links ── */
const navLinks = [
  { name: 'Home',       path: '/'           },
  { name: 'About',      path: '/about'      },
  { name: 'Products',   path: '/products'   },
  { name: 'Blog',       path: '/blog'       },
  { name: 'Dealership', path: '/dealership' },
]

/* ── Device detection — computed once ── */
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

/* ── Animation presets ──────────────────────────────────────────────────────
   Desktop: original cubic-bezier entrance.
   Mobile:  opacity-only — no translateY/X means zero layout recalculation.
            The navbar is fixed and above the fold, so even a tiny y-animation
            causes a repaint of the entire viewport on first load.
─────────────────────────────────────────────────────────────────────────── */
const navEntrance = isMobile
  ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
  : { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }

// Mobile panel slide: x-transform only (no scale, no blur on the panel itself)
const panelVariants = {
  hidden: { x: '100%' },
  show:   { x: 0      },
}
const panelTransition = isMobile
  ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] }   // slightly faster on mobile
  : { duration: 0.4,  ease: [0.22, 1, 0.36, 1] }

// Mobile link stagger: opacity-only, no x-slide
// x: 30 on 5 links = 5 simultaneous x-transforms → layout recalc on each frame
const linkVariants = {
  hidden: { opacity: 0, x: isMobile ? 0 : 30 },
  show:   { opacity: 1, x: 0                  },
}

function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  /* ── Scroll listener — RAF-throttled, threshold-gated ──────────────────
     Unchanged from original: only triggers setState when crossing 50px.
     Added `passive: true` is already in original; kept here.
     One small addition: cancel RAF on cleanup to prevent memory leak if the
     component unmounts mid-frame (e.g. during fast navigation).
  ─────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    let rafId = null
    let lastScrollY = window.scrollY

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        if ((lastScrollY <= 50) !== (y <= 50)) setScrolled(y > 50)
        lastScrollY = y
        rafId = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Close on route change
  useEffect(() => setMobileOpen(false), [location])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive  = useCallback((path) => location.pathname === path, [location.pathname])
  const closeMenu = useCallback(() => setMobileOpen(false), [])
  const toggleMenu = useCallback(() => setMobileOpen((v) => !v), [])

  return (
    <>
      {/* ══ NAVBAR BAR ══════════════════════════════════════════════════════ */}
      <motion.nav
        {...navEntrance}
        className={`fixed z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'top-2 inset-x-4 md:inset-x-12 md:left-auto md:right-auto bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(249,115,22,0.15)] py-3 rounded-full border border-[#FFD9A8]/50'
            : isMobile
              ? 'top-0 left-0 right-0 bg-white py-4 sm:py-3 shadow-md border-b border-gray-100'
              : 'top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md py-4 rounded-full border border-white shadow-lg shadow-black/5 px-6 md:px-12 w-[calc(100%-3rem)] md:w-auto'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between max-w-7xl mx-auto h-16 sm:h-14 md:h-auto md:py-4">

          {/* ── LOGO & BRAND ── */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 md:gap-2 lg:gap-3">
            {/* Logo Image */}
            <div className="relative h-10 sm:h-11 md:h-12 aspect-square flex items-center justify-center flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="CILO"
                className="h-full w-auto object-contain"
                width={40}
                height={40}
                decoding="async"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            
            {/* Brand Name */}
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base font-bold text-[#F97316]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                CILO
              </span>
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                by Richi
              </span>
            </div>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 lg:px-4 py-2 rounded-full text-[11px] lg:text-xs uppercase font-medium tracking-[0.15em] transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-[#F97316] bg-[#FFF8EE]'
                    : 'text-gray-700 hover:text-[#F97316] hover:bg-[#FFF8EE]'
                }`}
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F97316]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── DESKTOP CTA ── */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              to="/contact"
              className="relative px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-[11px] lg:text-xs uppercase font-bold tracking-[0.1em] overflow-hidden group transition-all duration-300 bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20 hover:bg-[#EA6C0A] hover:shadow-[#F97316]/30 hover:-translate-y-0.5"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {/* Shine sweep — transform-only, compositor-safe */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative">Contact Us</span>
            </Link>
          </div>

          {/* ── HAMBURGER ── */}
          <button
            onClick={toggleMenu}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className={`md:hidden p-2.5 sm:p-3 rounded-lg transition-colors duration-200 flex-shrink-0 ${
              scrolled
                ? 'text-[#F97316] hover:bg-[#FFF8EE]'
                : 'text-[#F97316] hover:bg-[#FFF8EE]'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{ rotate: 90,    opacity: 0 }}
                  transition={{ duration: 0.15 }}        // tighter than original 0.2
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90,  opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{ rotate: -90,   opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

        </div>
      </motion.nav>

      {/* ══ MOBILE MENU ═════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop
                backdrop-blur-sm removed — same reasoning as navbar:
                it composites the entire page on every frame.
                A semi-opaque black overlay achieves the same visual effect
                with a single cheap paint operation.
            */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/50"
            />

            {/* Slide panel
                - will-change: transform pins it to compositor before animation
                - No blur on the panel itself
                - contain: layout style → scopes layout recalc to panel only
            */}
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={panelTransition}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] sm:w-[75vw] max-w-sm flex flex-col bg-white"
              style={{
                willChange: 'transform',
                contain: 'layout style',
              }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
                  <div className="relative h-9 sm:h-10 aspect-square flex items-center justify-center flex-shrink-0">
                    <img
                      src="/images/logo.png"
                      alt="CILO"
                      className="h-full w-auto object-contain"
                      width={36}
                      height={36}
                      decoding="async"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      CILO
                    </span>
                    <span className="text-[9px] text-gray-600 font-medium" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                      by Richi
                    </span>
                  </div>
                </Link>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-gray-600 hover:text-[#F97316] hover:bg-orange-50 transition-colors duration-150 flex-shrink-0 flex items-center justify-center"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col justify-start pt-3 sm:pt-4 px-2 sm:px-3 gap-1" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    variants={linkVariants}
                    initial="hidden"
                    animate="show"
                    transition={{
                      delay: 0.04 + i * 0.05,
                      duration: isMobile ? 0.18 : 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? 'bg-orange-50 text-[#F97316] border-l-4 border-[#F97316] pl-3'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#F97316]'
                      }`}
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      <span>{link.name}</span>
                      {isActive(link.path) && (
                        <motion.div
                          layoutId="mobile-active"
                          className="w-1.5 h-1.5 rounded-full bg-[#F97316]"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer CTA */}
              <div className="px-5 sm:px-6 pb-6 sm:pb-8 pt-4 sm:pt-5 border-t border-gray-100 space-y-3 sm:space-y-4">
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="flex items-center justify-center w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#F97316] to-[#EA6C0A] text-white font-bold text-sm uppercase tracking-[0.1em] rounded-lg hover:shadow-lg hover:shadow-[#F97316]/30 transition-all duration-200"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Navbar)
