import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ZigZagImage from './ZigZagImage'

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

const entranceVariants = deviceCapability.isMobile
  ? {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    }
  : {
      hidden: { opacity: 0, y: 28 },
      visible: { opacity: 1, y: 0 },
    }

const hoverVariants = deviceCapability.isMobile
  ? {}
  : { whileHover: { y: -4, transition: { duration: 0.22 } } }

const ProductCard = memo(
  function ProductCard({ name, category, img, index, color = '#F97316' }) {
    const prefersReducedMotion = useReducedMotion()

    return (
      <motion.div
        initial={prefersReducedMotion ? false : entranceVariants.hidden}
        whileInView={entranceVariants.visible}
        viewport={{ once: true, margin: '-30px' }}
        transition={{
          duration: deviceCapability.isMobile ? 0.3 : 0.55,
          delay: deviceCapability.isMobile ? 0 : index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        {...hoverVariants}
        style={!deviceCapability.isMobile ? { willChange: 'transform, opacity' } : {}}
        className="group flex h-full w-full flex-col"
      >
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 group-hover:border-stone-300 group-hover:shadow-md"
        >
          {/* Unified “studio” surface — same for every SKU so pack shots feel like one catalogue */}
          <div
            className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-linear-to-b from-[#FAFAF9] via-[#FFF8F3] to-white"
            style={{ aspectRatio: '5 / 6' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse 75% 55% at 50% 40%, rgba(249, 115, 22, 0.06) 0%, transparent 55%)',
              }}
              aria-hidden
            />
            <div
              className="absolute left-0 top-0 bottom-0 w-0.75 rounded-l-2xl"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {category && (
              <span className="absolute left-3 top-3 z-20 inline-flex items-center rounded-md border border-stone-200/90 bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-stone-600 shadow-sm backdrop-blur-sm sm:left-3.5 sm:top-3.5 sm:px-2.5 sm:text-[10px]">
                {category}
              </span>
            )}
            {/* Full panel height (top–bottom) — object-contain scales width; badge stays above (z-20) */}
            {img ? (
              <ZigZagImage
                src={img}
                alt={name}
                index={index}
                className="absolute inset-0 z-10 mx-auto h-full w-full object-contain p-6 sm:p-8 filter-[drop-shadow(0_10px_28px_rgba(45,22,8,0.1))]"
                loading="lazy"
                decoding="async"
                width={300}
                height={400}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="absolute inset-0 z-10 flex items-center justify-center text-5xl opacity-40" aria-hidden>
                🍹
              </div>
            )}
          </div>

          <div className="shrink-0 bg-white px-3 py-2.5 text-center sm:px-4 sm:py-3">
            <h3
              className="text-sm font-semibold leading-snug tracking-tight text-stone-900 transition-colors duration-200 group-hover:text-[#C2410C] sm:text-base"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              {name}
            </h3>
          </div>
        </div>
      </motion.div>
    )
  },
  (prev, next) =>
    prev.name === next.name &&
    prev.category === next.category &&
    prev.img === next.img &&
    prev.index === next.index &&
    prev.color === next.color
)

export default ProductCard

