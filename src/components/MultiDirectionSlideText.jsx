import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

function resolveParts({ text, textLeft, textRight }) {
  if (textLeft || textRight) {
    return [textLeft ?? '', textRight ?? '']
  }

  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) {
    return [words[0] ?? '', '']
  }

  const midpoint = Math.ceil(words.length / 2)
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')]
}

const lineVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -56 : 56,
    filter: 'blur(6px)',
  }),
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
  },
}

const MultiDirectionSlideText = memo(function MultiDirectionSlideText({
  as: Tag = 'div',
  className = '',
  leftClassName = '',
  rightClassName = '',
  text,
  textLeft,
  textRight,
}) {
  const [left, right] = useMemo(
    () => resolveParts({ text, textLeft, textRight }),
    [text, textLeft, textRight],
  )

  return (
    <Tag className={className}>
      <span className="block overflow-hidden">
        <motion.span
          custom="left"
          variants={lineVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`block ${leftClassName}`.trim()}
        >
          {left}
        </motion.span>
      </span>
      {right ? (
        <span className="block overflow-hidden">
          <motion.span
            custom="right"
            variants={lineVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`block ${rightClassName}`.trim()}
          >
            {right}
          </motion.span>
        </span>
      ) : null}
    </Tag>
  )
})

export { MultiDirectionSlideText }
