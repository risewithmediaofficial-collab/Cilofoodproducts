import { forwardRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const zigZagVariants = {
  hidden: ({ direction, reducedMotion }) => (
    reducedMotion
      ? { opacity: 1 }
      : {
          opacity: 0,
          x: direction * 34,
          y: 18,
          rotate: direction * 4,
          scale: 0.985,
        }
  ),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  },
}

const ZigZagImage = forwardRef(function ZigZagImage({
  index = 0,
  className = '',
  viewport = { once: true, amount: 0.28 },
  transition,
  style,
  loading = 'lazy',
  decoding = 'async',
  ...props
}, ref) {
  const reducedMotion = useReducedMotion()
  const direction = index % 2 === 0 ? -1 : 1

  return (
    <motion.img
      ref={ref}
      custom={{ direction, reducedMotion }}
      variants={zigZagVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={
        transition ?? {
          duration: reducedMotion ? 0.01 : 0.65,
          delay: reducedMotion ? 0 : Math.min(index * 0.06, 0.24),
          ease: [0.22, 1, 0.36, 1],
        }
      }
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      {...props}
    />
  )
})

export default ZigZagImage
