import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
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

// One-time read on mount — no state/listener needed for a static page
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

const Orb = ({ className, delay = 0 }) => {
  if (shouldDisableOrbs()) return null
  const reduced = prefersReducedMotion()
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={reduced ? {} : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={reduced ? {} : { duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      // FIX: GPU compositor layer so blur paint doesn't dirty the main layer per frame
      style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
    />
  )
}

/* ══════════════════════════════════════════════════════════
   DATA  (unchanged)
══════════════════════════════════════════════════════════ */

const events = [
  {
    id: 1,
    title: 'Pongal 2025',
    date: 'Jan 14-15, 2025',
    image: '/images/insights/pongal-2025.jpg',
    description: 'Celebrating the harvest festival with our community and team. Pongal symbolizes prosperity, gratitude, and the bounty of nature. Richi Food Products joins in the festivities with traditional celebrations across Tamil Nadu.',
    details: "Experience the warmth of Pongal celebrations with Richi. From traditional Pongal rangoli to community gatherings, we honor this harvest festival that brings families together. Our beverages add sweetness to your Pongal celebrations!"
  },
  {
    id: 2,
    title: 'Diwali 2025',
    date: 'Oct 29-Nov 2, 2025',
    image: '/images/insights/diwali-2025.jpg',
    description: 'Festival of Lights celebrating victory of good over evil. Richi Food Products illuminates your Diwali celebrations with premium beverages and community joy. Share moments of togetherness and brightness with loved ones.',
    details: 'Diwali is the festival of lights, joy, and togetherness. At Richi, we celebrate by bringing people together with refreshing beverages that complement every festive moment. Light up your Diwali with Richi!'
  },
  {
    id: 3,
    title: 'Tamil New Year 2025',
    date: 'April 14, 2025',
    image: '/images/insights/tamil-new-year-2025.jpg',
    description: "Celebrating Tamil heritage and the beginning of new beginnings. Tamil New Year (Chithirai) marks the arrival of spring and prosperity. Richi Food Products honors this significant cultural milestone with community engagement.",
    details: "Tamil New Year or Chithirai Pirappu welcomes spring and new possibilities. It's a time of renewal, hope, and new beginnings. Richi Food Products celebrates Tamil culture and tradition with special events, while refreshing communities with our quality beverages throughout this auspicious period."
  },
]

/* ══════════════════════════════════════════════════════════
   PULSE DOT — CSS animation instead of JS-driven Framer Motion
   FIX: original used `animate={{ scale: [1, 1.1, 1] }}` with
   repeat: Infinity — that's 3 separate JS animation loops running
   simultaneously (one per card). A CSS keyframe runs on the
   compositor thread at zero JS cost.
══════════════════════════════════════════════════════════ */
function PulseDot() {
  const reduced = prefersReducedMotion()
  return (
    <>
      <span
        className="w-2 h-2 rounded-full bg-[#F97316] shrink-0"
        style={reduced ? {} : {
          animation: 'pulse-dot 1.5s ease-in-out infinite',
          willChange: 'transform',
          display: 'inline-block',
        }}
      />
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1);   }
          50%       { transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pulse-dot"] { animation: none !important; }
        }
      `}</style>
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   INSIGHTS PAGE
══════════════════════════════════════════════════════════ */
export default function Insights() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  const seo = PAGE_SEO.insights
  const schema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/insights' },
  ])

  return (
    <PageWrapper
      title="Industry Insights | Beverage Trends & Innovation"
      description={seo.description}
      url="/insights"
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >

      {/* ══════════ HERO ══════════ */}
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
            <span className="text-[#7A4A2A]">Events</span>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#FFD9A8] text-[#7A4A2A] text-xs font-bold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
                Celebrations & Events
              </span>
              <h1
                className="font-black leading-tight text-[#1A0C04] mb-6"
                style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
              >
                Festive<br />
                <span className="text-[#F97316]">Celebrations 2025</span>
              </h1>
              <p className="text-[#4A2800]/60 max-w-2xl mx-auto leading-relaxed text-lg">
                Join us in celebrating Tamil culture and traditions with Richi Food Products throughout 2025.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ EVENTS GRID ══════════ */}
      <section
        className="relative py-20 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, white 0%, #f9fafb 40%, white 65%, #f3f4f6 100%)' }}
      >
        <Orb className="w-80 h-80 bg-[#F97316]/15 top-10 -left-40"   delay={1} />
        <Orb className="w-96 h-96 bg-[#F97316]/10 bottom-0 -right-32" delay={3} />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                // FIX: disable hover lift + scale on mobile.
                // On touch devices, whileHover fires on the first tap — the card
                // jumps y:-12 and scale:1.05 just before the modal opens, creating
                // a jarring double-animation. Mobile gets no hover animation at all.
                whileHover={isMobile ? {} : { y: -12, scale: 1.05 }}
                onClick={() => setSelectedEvent(event)}
                className="group cursor-pointer rounded-3xl overflow-hidden border-2 border-gray-200
                  hover:border-[#F97316] hover:shadow-2xl transition-all duration-300 bg-white flex flex-col
                  // Active state for touch — gives tactile feedback without layout shift
                  active:scale-[0.98] active:shadow-lg"
                // Hint to browser: this element will animate transform/opacity
                style={{ willChange: 'transform' }}
              >
                {/* Image */}
                <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.style.display = 'none' }}
                    // FIX: lazy-load images — all 3 are below the fold on mobile
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-sm text-[#F97316] font-semibold mb-3 uppercase tracking-widest">
                    {event.date}
                  </div>
                  <h3
                    className="text-2xl font-black text-gray-900 mb-3"
                    style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                    {event.description}
                  </p>

                  {/* FIX: replaced Framer Motion repeat:Infinity with CSS keyframe PulseDot */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <PulseDot />
                    <span className="text-xs font-semibold text-[#F97316]">Tap to see more</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ MODAL ══════════ */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // FIX: remove backdrop-blur-sm from the overlay.
            // backdrop-filter: blur() on a fixed full-screen element forces the browser
            // to composite the *entire page* into a separate texture on every frame.
            // On mobile GPUs this is extremely expensive. A semi-transparent black
            // background is visually equivalent and costs nothing.
            onClick={() => setSelectedEvent(null)}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            // Prevent body scroll when modal is open
            style={{ overscrollBehavior: 'contain' }}
          >
            <motion.div
              // FIX: on mobile, reduce spring stiffness & use a simpler enter animation.
              // The original scale:0.8 + y:50 spring (stiffness:300) on mobile caused
              // dropped frames because the GPU had to composite the modal + blurred overlay
              // simultaneously on the first frame. A simple fade-up is imperceptible
              // from the user's perspective and removes the composite pressure.
              initial={isMobile
                ? { opacity: 0, y: 24 }
                : { scale: 0.8, y: 50, opacity: 0 }
              }
              animate={isMobile
                ? { opacity: 1, y: 0 }
                : { scale: 1, y: 0, opacity: 1 }
              }
              exit={isMobile
                ? { opacity: 0, y: 16 }
                : { scale: 0.8, y: 50, opacity: 0 }
              }
              transition={isMobile
                ? { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
                : { type: 'spring', stiffness: 300, damping: 30 }
              }
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
              // FIX: cap modal height and enable momentum scrolling inside.
              // `-webkit-overflow-scrolling: touch` enables inertial (momentum) scrolling
              // on iOS Safari — without it, scrolling inside the modal feels sluggish.
              style={{
                maxHeight: '90dvh',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              {/* Close button */}
              <div className="sticky top-0 flex justify-end p-4 md:p-6 bg-gradient-to-r from-[#F97316] to-[#A8430F] z-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEvent(null)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center
                    hover:bg-white/30 transition-all min-w-[44px] min-h-[44px]"
                  aria-label="Close"
                >
                  <X size={22} className="text-white" />
                </motion.button>
              </div>

              {/* Image — eager since it's the hero of the modal */}
              <div className="relative h-56 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="text-sm text-[#F97316] font-semibold mb-4 uppercase tracking-widest">
                  📅 {selectedEvent.date}
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black text-gray-900 mb-5 md:mb-6"
                  style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                >
                  {selectedEvent.title}
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-5 md:mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>
                <div className="bg-gradient-to-br from-[#FFF8EE] to-[#FFE8D1] rounded-2xl p-5 md:p-6 mb-5 md:mb-6 border-2 border-[#FFD9A8]">
                  <p className="text-[#7A4A2A] leading-relaxed text-sm md:text-base">
                    {selectedEvent.details}
                  </p>
                </div>

                {/* Close CTA */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-4 bg-gradient-to-r from-[#F97316] to-[#A8430F] text-white font-bold
                    rounded-full hover:shadow-xl transition-all min-h-[48px]"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PageWrapper>
  )
}

