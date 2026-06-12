import { useState, useEffect, memo, useCallback } from 'react'
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

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -12, height: 0 },
  show: { opacity: 1, y: 0, height: 'auto' },
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })
  const location = useLocation()

  const navEntrance = isMobile
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
    : { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }

  const linkVariants = {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateViewport = (event) => {
      setIsMobile(event.matches)
      if (!event.matches) {
        setMobileOpen(false)
      }
    }

    updateViewport(mediaQuery)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateViewport)
      return () => mediaQuery.removeEventListener('change', updateViewport)
    }

    mediaQuery.addListener(updateViewport)
    return () => mediaQuery.removeListener(updateViewport)
  }, [])

  const isActive  = useCallback((path) => location.pathname === path, [location.pathname])
  const closeMenu = useCallback(() => setMobileOpen(false), [])
  const toggleMenu = useCallback(() => setMobileOpen((v) => !v), [])

  return (
    <>
      {/* ══ NAVBAR BAR ══════════════════════════════════════════════════════ */}
      <motion.nav
        {...navEntrance}
        layoutRoot
        className="fixed top-3 inset-x-0 z-50 px-3 transition-all duration-300 sm:top-4 sm:px-4"
        style={{ willChange: 'transform' }}
      >
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-[#FFD9A8]/50 bg-white/95 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <div className="flex min-h-18 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

          {/* ── LOGO & BRAND ── */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Logo Image */}
            <div className="relative h-12 sm:h-14 md:h-16 aspect-square flex items-center justify-center shrink-0">
              <img
                src="/images/logo.png"
                alt="CILO"
                className="h-full w-auto object-contain"
                width={56}
                height={56}
                decoding="async"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            
          </Link>

          {/* ── DESKTOP LINKS ── */}
          {!isMobile && (
            <div className="flex flex-1 items-center justify-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-200 lg:px-4 lg:text-xs ${
                    isActive(link.path)
                      ? 'rounded-md bg-[#FFF8EE] text-[#F97316]'
                      : 'rounded-md text-gray-700 hover:bg-[#FFF8EE] hover:text-[#F97316]'
                  }`}
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#F97316]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* ── DESKTOP CTA ── */}
          {!isMobile && (
            <div className="flex shrink-0 items-center justify-end">
              <Link
                to="/contact"
                className="group relative overflow-hidden rounded-lg bg-[#F97316] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:bg-[#EA6C0A] lg:px-5 lg:text-xs"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Contact Us</span>
              </Link>
            </div>
          )}

          {/* ── MOBILE TOGGLE ── */}
          {isMobile && (
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-panel"
              className="flex shrink-0 items-center justify-center rounded-lg border border-[#FFD9A8] bg-white p-2.5 text-[#F97316] shadow-sm transition-colors duration-200 hover:bg-[#FFF8EE] sm:p-3"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}
          </div>

          <AnimatePresence initial={false}>
            {isMobile && mobileOpen && (
              <motion.div
                key="mobile-navigation-panel"
                id="mobile-navigation-panel"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={mobileMenuVariants}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden border-t border-[#FFD9A8]/60 bg-white/90"
              >
                <nav className="flex flex-col gap-2 px-4 pb-4 pt-3" aria-label="Mobile navigation">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      variants={linkVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      transition={{
                        delay: 0.03 + i * 0.04,
                        duration: 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={link.path}
                        onClick={closeMenu}
                        className={`flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                          isActive(link.path)
                            ? 'bg-[#FFF1E6] text-[#F97316]'
                            : 'text-gray-700 hover:bg-[#FFF8EE] hover:text-[#F97316]'
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={linkVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    transition={{ delay: 0.2, duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to="/contact"
                      onClick={closeMenu}
                      className="mt-1 flex items-center justify-center rounded-xl bg-linear-to-r from-[#F97316] to-[#EA6C0A] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-[#F97316]/20 transition-all duration-200 hover:shadow-[#F97316]/30"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Contact Us
                    </Link>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  )
}

export default memo(Navbar)

