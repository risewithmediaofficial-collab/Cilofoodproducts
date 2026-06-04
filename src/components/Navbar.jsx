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
            ? 'top-2 inset-x-4 md:inset-x-12 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(249,115,22,0.15)] py-3 rounded-full border border-[#FFD9A8]/50 md:inset-x-auto'
            : isMobile
              ? 'top-0 left-0 right-0 bg-white py-3 shadow-sm'
              : 'top-6 left-0 right-0 inset-x-6 md:inset-x-12 bg-white/80 backdrop-blur-md py-4 rounded-full border border-white shadow-lg shadow-black/5 md:inset-x-auto'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-12 flex items-center justify-between max-w-7xl mx-auto">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center shrink-0 min-w-0">
            <div className="relative h-10 sm:h-12 w-[140px] sm:w-[205px] overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Richi Food Products"
                className="h-10 sm:h-12 w-auto object-contain"
                style={{ height: 'auto', width: 'auto', transform: 'translateX(32px) scale(2.5)', transformOrigin: 'center' }}
                /*
                  width + height prevent layout shift (CLS) while the image loads.
                  decoding="async" moves image decode off the main thread.
                */
                width={60}
                height={30}
                decoding="async"
                onError={(e) => { e.target.style.display = 'none' }}
              />
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
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] sm:w-[70vw] md:w-[60vw] max-w-sm flex flex-col"
              style={{
                background: 'linear-gradient(160deg, #FFFFFF 0%, #FFF8F3 60%, #FFF1E6 100%)',
                willChange: 'transform',
                contain: 'layout style',
              }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-5 md:pb-6 border-b border-white/10">
                <Link to="/" onClick={closeMenu} className="flex items-center">
                  <span className="relative h-8 sm:h-10 w-[140px] sm:w-[178px] overflow-hidden">
                    <img
                      src="/images/logo.png"
                      alt="Richi Food Products"
                      className="h-8 sm:h-10 w-auto object-contain"
                      style={{ height: 'auto', width: 'auto', transform: 'translateX(30px) scale(2.3)', transformOrigin: 'center' }}
                      width={56}
                      height={28}
                      decoding="async"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </span>
                </Link>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="p-2.5 rounded-lg text-[#7A4A2A]/70 hover:text-[#F97316] hover:bg-[#F97316]/10 transition-colors duration-150 flex-shrink-0"
                >
                  <X size={20} className="sm:w-[22px] sm:h-[22px]" />
                </button>
              </div>

              {/* Nav links
                  Stagger kept (only 5 items) but duration tightened.
                  x-slide removed on mobile → opacity-only per linkVariants.
              */}
              <nav className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 gap-1 sm:gap-2" aria-label="Mobile navigation">
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
                      className={`flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm uppercase font-medium tracking-[0.15em] transition-colors duration-150 ${
                        isActive(link.path)
                          ? 'bg-[#F97316]/10 text-[#F97316]'
                          : 'text-[#7A4A2A]/70 hover:text-[#F97316] hover:bg-[#F97316]/5'
                      }`}
                      style={{ fontFamily: "'Satoshi', sans-serif" }}
                    >
                      <span>{link.name}</span>
                      {isActive(link.path) && (
                        <motion.div
                          layoutId="mobile-active"
                          className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#F97316]"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer CTA */}
              <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-5 md:pt-6 border-t border-white/10 space-y-3 sm:space-y-4">
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="flex items-center justify-center w-full py-3 sm:py-4 bg-[#F97316] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.1em] rounded-xl sm:rounded-2xl hover:bg-[#EA6C0A] transition-colors duration-150 shadow-lg shadow-[#F97316]/20"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  Contact Us
                </Link>
                <div className="text-center text-white/40 text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
                  Daily Fresh Fruits India
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Navbar)
