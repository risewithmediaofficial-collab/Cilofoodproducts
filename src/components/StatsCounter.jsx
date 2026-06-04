import { useEffect, useRef, useState, useMemo, memo } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/* ══════════════════════════════════════════════════════════
   DEVICE CAPABILITY  (computed once at module load)
══════════════════════════════════════════════════════════ */
const deviceCapability = (() => {
  if (typeof window === 'undefined') return { isMobile: false, isLowEnd: false }
  const isMobile = window.innerWidth < 768
  const isLowEnd =
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    window.innerWidth < 480
  return { isMobile, isLowEnd }
})()

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const stats = [
  { value: 100, suffix: ' KL', label: 'Daily Capacity', desc: 'Production per day' },
  { value: 10,  suffix: '+',   label: 'Drink Variants',  desc: 'Juices & carbonated' },
  { value: 3,   suffix: '',    label: 'Business Models', desc: 'Contract, White-label, Own' },
  { value: 6,   suffix: ' Mo', label: 'Shelf Life',      desc: 'Quality guaranteed' },
]

/* ══════════════════════════════════════════════════════════
   COUNT-UP
   Optimisations vs original:
   1. Uses requestAnimationFrame instead of setInterval(_, 1000/60).
      rAF is driven by the browser's own vsync signal — it automatically
      throttles to the device's actual refresh rate (60 Hz, 90 Hz, 120 Hz)
      and pauses when the tab is hidden, preventing wasted CPU cycles.
   2. Easing (easeOut quad) so the number slows down at the end, which
      looks more natural and reduces perceived "flicker" on low-end phones.
   3. Duration clamped on mobile to keep the effect snappy.
   4. Fallback to immediate value on reduced-motion OR low-end devices.
══════════════════════════════════════════════════════════ */
function CountUp({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const rafRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const prefersReducedMotion = useReducedMotion()

  // Bail-out for low-end devices or accessibility preference
  const skipAnimation = prefersReducedMotion || deviceCapability.isLowEnd

  // Clamp duration on mobile for snappier feel
  const effectiveDuration = deviceCapability.isMobile ? Math.min(duration, 1.2) : duration

  useEffect(() => {
    if (!isInView) return

    if (skipAnimation) {
      setCount(end)
      return
    }

    const startTime = performance.now()
    const totalMs = effectiveDuration * 1000

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / totalMs, 1)
      // easeOut quad — decelerates toward end value
      const eased = 1 - (1 - progress) * (1 - progress)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCount(end) // guarantee exact final value
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // effectiveDuration is derived from a constant + deviceCapability (module-scoped),
    // so it never changes between renders — safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, end, skipAnimation])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ══════════════════════════════════════════════════════════
   STATS COUNTER
   Optimisations vs original:
   1. useMemo on stats is removed — stats is a module-level constant,
      so useMemo(() => stats, []) added zero value and just created a
      redundant closure on every render.
   2. Animation variants computed once outside render via useMemo keyed
      on isMobile, not recalculated per-card.
   3. On mobile: fade-only entrance (no y-translate) eliminates layout
      recalc during the animation. Visual result is nearly identical.
   4. Stagger delay removed on mobile — sequential delays make low-end
      devices feel unresponsive (all 4 items fade in together instead).
   5. Gradient text uses a static class — the original already did this,
      but noted here: avoid inline `style` on animated elements to prevent
      style recalculation on each motion frame.
══════════════════════════════════════════════════════════ */
const StatsCounter = memo(function StatsCounter({ light = false }) {
  const prefersReducedMotion = useReducedMotion()

  // Compute variants once per render (isMobile is stable after mount)
  const cardVariants = useMemo(() => {
    if (deviceCapability.isMobile) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.35 } },
      }
    }
    return {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }
  }, []) // empty deps — deviceCapability never changes after module load

  return (
    /*
      grid gap tightened on mobile (gap-5) to reduce the chance of
      overflow on narrow screens, while keeping gap-8 on md+.
    */
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={prefersReducedMotion ? false : cardVariants.hidden}
          whileInView={cardVariants.visible}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.6,
            // No stagger on mobile — all 4 items animate together
            delay: deviceCapability.isMobile ? 0 : i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          // willChange only when hover interaction is available (desktop)
          // Too many willChange hints waste GPU memory on mobile
          style={!deviceCapability.isMobile ? { willChange: 'transform, opacity' } : {}}
          className="text-center"
        >
          <div
            className={`font-display font-bold text-4xl sm:text-5xl md:text-6xl mb-1 ${
              light
                ? 'text-white'
                : 'bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-500 bg-clip-text text-transparent'
            }`}
          >
            <CountUp end={stat.value} suffix={stat.suffix} />
          </div>
          <div className={`font-display font-semibold text-base sm:text-lg mb-0.5 ${light ? 'text-white/90' : 'text-gray-900'}`}>
            {stat.label}
          </div>
          <div className={`font-body text-xs sm:text-sm ${light ? 'text-white/50' : 'text-gray-500'}`}>
            {stat.desc}
          </div>
        </motion.div>
      ))}
    </div>
  )
})

export default StatsCounter