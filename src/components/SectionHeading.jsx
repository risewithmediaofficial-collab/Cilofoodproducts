import { memo } from 'react'
import { motion } from 'framer-motion'
import { MultiDirectionSlideText } from './MultiDirectionSlideText'

// Computed once at module level — no per-render cost
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

/*
  Mobile: opacity-only fade (no translateY) — compositor-only, zero layout cost.
  Desktop: original slide-up with custom cubic-bezier.

  SectionHeading is used on every page section, so this component's animation
  fires many times per page. Removing the y-transform on mobile eliminates
  repeated layout recalculations as the user scrolls.
*/
const variants = {
  hidden: isMobile ? { opacity: 0 }              : { opacity: 0, y: 30 },
  show:   isMobile ? { opacity: 1 }              : { opacity: 1, y: 0  },
}

const transition = isMobile
  ? { duration: 0.2, ease: 'easeOut' }
  : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }

const SectionHeading = memo(function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light  = false,
  center = true,
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      /*
        margin: '-50px' kept on desktop for the original trigger point.
        On mobile, '-30px' fires slightly earlier — avoids a flash of
        invisible content when the section snaps into view on fast scrolls.
      */
      viewport={{ once: true, margin: isMobile ? '-30px' : '-50px' }}
      transition={transition}
      /*
        will-change: opacity tells the browser to promote this element to
        its own compositor layer before the animation starts, preventing a
        repaint on first reveal. Scoped to the wrapper only — not children —
        so it doesn't cascade compositor promotion cost down the tree.
      */
      style={{ willChange: 'opacity' }}
      className={`mb-16 ${center ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase
            ${light
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
          {eyebrow}
        </div>
      )}

      <MultiDirectionSlideText
        as="h2"
        text={title}
        className={`font-display font-bold text-4xl md:text-5xl leading-tight mb-4
          ${light ? 'text-white' : 'text-gray-900'}`}
      />

      {subtitle && (
        <p
          className={`font-body text-lg max-w-2xl leading-relaxed
            ${center ? 'mx-auto' : ''}
            ${light ? 'text-white/60' : 'text-gray-600'}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
})

export default SectionHeading
