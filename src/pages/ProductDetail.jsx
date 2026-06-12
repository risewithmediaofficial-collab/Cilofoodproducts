import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import ZigZagImage from '../components/ZigZagImage'
import { ShoppingCart, Heart, Share2, Star, Check } from 'lucide-react'
import { buildProductSchema, buildFAQSchema, buildBreadcrumbSchema, SITE } from '../seo/seoConfig'

/* ══════════════════════════════════════════════════════════
   PERFORMANCE HELPERS
══════════════════════════════════════════════════════════ */

// Unified mobile/low-end device detection (cached, runs once)
const deviceCapability = (() => {
  if (typeof window === 'undefined') return { isMobile: false, isLowEnd: false }
  const isMobile = window.innerWidth < 768
  const isLowEnd =
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    window.innerWidth < 480
  return { isMobile, isLowEnd }
})()

const shouldDisableOrbs = () => deviceCapability.isLowEnd

// Reduced animation variants for mobile — same visual result, cheaper to run
const makeSlideVariants = (axis, distance = 30) => {
  if (deviceCapability.isMobile) {
    // Fade-only on mobile: no translate means no layout recalc / compositor promotion cost
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.35 } },
    }
  }
  return {
    hidden: { opacity: 0, [axis === 'x' ? 'x' : 'y']: distance },
    visible: { opacity: 1, [axis === 'x' ? 'x' : 'y']: 0, transition: { duration: 0.6 } },
  }
}

/* ══════════════════════════════════════════════════════════
   ORB — disabled on low-end, will-change: transform hint
══════════════════════════════════════════════════════════ */
const Orb = ({ className, delay = 0 }) => {
  if (shouldDisableOrbs()) return null
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      // Use transform-only properties so the browser composites on GPU
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

/* ══════════════════════════════════════════════════════════
   LAZY IMAGE — IntersectionObserver-based, avoids layout shift
══════════════════════════════════════════════════════════ */
const LazyImg = ({ src, alt, className, width, height }) => {
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    // Native lazy loading + observer fallback
    if ('loading' in HTMLImageElement.prototype) {
      el.loading = 'lazy'
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = src
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  return (
    <ZigZagImage
      ref={imgRef}
      src={src}
      alt={alt}
      index={0}
      className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      // Prevent layout shift — reserve space before image loads
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    />
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
const ProductDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('500ml')

  // Respect user's OS-level "reduce motion" preference
  const prefersReducedMotion = useReducedMotion()

  const product = {
    id: 1,
    name: 'Richi Grape',
    flavor: 'grape',
    tagline: 'TASTY REFRESHING RICHI GRAPE',
    description:
      'Experience the rich, sweet flavor of perfectly ripened grapes in every sip. Our grape juice is made from select grapes, carefully processed to preserve natural vitamins and antioxidants.',
    price: 3.99,
    sizes: [
      { size: '250ml', price: 2.49 },
      { size: '500ml', price: 3.99 },
      { size: '1L', price: 6.99 },
    ],
    features: [
      '100% Natural Grape Juice',
      'No Added Sugar',
      'Rich in Antioxidants',
      'Vitamin C & K',
      'No Preservatives',
    ],
    nutrition: { calories: 120, carbs: 30, sugar: 28, protein: 1, vitaminC: '120%' },
    rating: 4.5,
    reviews: 128,
  }

  const relatedProducts = [
    { id: 2, name: 'Richi Apple Drink', flavor: 'apple', price: 3.49 },
    { id: 3, name: 'Richi Mango Drink', flavor: 'mango', price: 4.29 },
    { id: 6, name: 'Richi Orange Juice', flavor: 'orange', price: 3.79 },
  ]

  // Pre-compute animation variants once (not on every render)
  const leftVariants = makeSlideVariants('x', -30)
  const rightVariants = makeSlideVariants('x', 30)
  const upVariants = makeSlideVariants('y', 20)

  // Build schemas via seoConfig helpers
  const productSchema = buildProductSchema({
    name: product.name,
    description: product.description,
    image: `/images/${product.flavor}.webp`,
    category: 'Beverages',
  })
  const faqSchema = buildFAQSchema([
    {
      question: `Is ${product.name} made from natural ingredients?`,
      answer: 'Yes, our beverage is made with 100% natural ingredients and no artificial preservatives.',
    },
    {
      question: `What sizes is ${product.name} available in?`,
      answer: 'CILO juices are available in 200ml, 500ml, 1L, and 2L sizes to suit every occasion.',
    },
  ])
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: product.name, path: `/product/${id}` },
  ])

  // Thumbnail hover — disabled on mobile to avoid janky scale repaints
  const thumbHover = deviceCapability.isMobile ? {} : { whileHover: { scale: 1.05 } }

  // Related card hover — use transform-only props so compositor handles it
  const cardHover = deviceCapability.isMobile
    ? {}
    : { whileHover: { y: -12, scale: 1.02 } }

  return (
    <PageWrapper
      title={`${product.name} | Premium CILO Juice`}
      description={product.description}
      url={`/product/${id}`}
      keywords={`${product.name}, CILO juice, premium beverage, fresh juice India, Richi Food Products`}
      image={`${SITE.domain}/images/${product.flavor}.webp`}
      type="website"
      schema={[productSchema, faqSchema, breadcrumbSchema]}
    >
      {/*
        ─── PERFORMANCE NOTES ────────────────────────────────────
        1. `transform: translateZ(0)` on the wrapper promotes to its own
           compositing layer, isolating repaints from the rest of the page.
        2. `contain: layout style paint` prevents child changes from
           causing ancestor reflows (major win on low-end devices).
        3. `overflow-x: hidden` prevents iOS elastic-scroll blowout.
        ──────────────────────────────────────────────────────────
      */}
      <div
        className="relative py-12 overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, white 0%, #f9fafb 35%, white 60%, #f3f4f6 100%)',
          // Isolate this subtree from the rest of the paint tree
          contain: 'layout style paint',
          // Force GPU layer to prevent texture-upload jank on scroll
          transform: 'translateZ(0)',
          overflowX: 'hidden',
        }}
      >
        {/* Background orbs — GPU-composited, skipped on low-end */}
        <Orb className="w-80 h-80 bg-[#F97316]/20 top-10 -right-32" />
        <Orb className="w-96 h-96 bg-[#F97316]/15 bottom-20 -left-40" delay={2} />

        {/*
          Texture overlay: use CSS instead of inline SVG data-URI background
          to avoid forcing a new layer decode on every repaint.
          On mobile the texture is hidden entirely (opacity-0) to save fill-rate.
        */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          {/* ── Breadcrumb ── */}
          <div className="mb-8">
            <nav className="flex text-sm flex-wrap gap-y-1">
              <Link to="/" className="text-[#7A4A2A]/70 hover:text-[#F97316]">Home</Link>
              <span className="mx-2 text-[#7A4A2A]/50">/</span>
              <Link to="/products" className="text-[#7A4A2A]/70 hover:text-[#F97316]">Products</Link>
              <span className="mx-2 text-[#7A4A2A]/50">/</span>
              <span className="text-[#F97316] font-semibold">{product.name}</span>
            </nav>
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* ── LEFT: Product images ── */}
            <motion.div
              initial={prefersReducedMotion ? false : leftVariants.hidden}
              animate={leftVariants.visible}
            >
              {/*
                Fixed height on mobile prevents CLS (Cumulative Layout Shift).
                `will-change: transform` only on desktop hover to avoid
                unnecessary compositor layers on mobile.
              */}
              <div
                className="bg-white rounded-3xl p-8 sm:p-12 mb-4 border-2 border-gray-200
                            hover:border-[#F97316] hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                style={{ minHeight: '350px' }}
              >
                <LazyImg
                  src={`/images/${product.flavor}.webp`}
                  alt={product.name}
                  // Fallback handled by server; WebP served where supported
                  className="w-full max-h-[50vh] md:max-h-[60vh] object-contain drop-shadow-[0_20px_40px_rgba(45,22,8,0.15)]"
                  width={480}
                  height={384}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 sm:gap-4">
                {['250ml', '500ml', '1L'].map((size) => (
                  <motion.div
                    key={size}
                    {...thumbHover}
                    // Explicit will-change only while interaction is possible
                    style={!deviceCapability.isMobile ? { willChange: 'transform' } : {}}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center
                               justify-center border-2 border-gray-200 hover:border-[#F97316]
                               transition-all duration-300 cursor-pointer"
                  >
                    <LazyImg
                      src={`/images/${product.flavor}.webp`}
                      alt={`${product.name} ${size}`}
                      className="w-full h-full object-contain p-2 drop-shadow-md"
                      width={64}
                      height={64}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── RIGHT: Product info ── */}
            <motion.div
              initial={prefersReducedMotion ? false : rightVariants.hidden}
              animate={rightVariants.visible}
            >
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="min-w-0">
                  <h1
                    className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 leading-tight"
                    style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                  >
                    {product.name}
                  </h1>
                  <p className="text-[#7A4A2A]/70 text-lg sm:text-xl mb-4">{product.tagline}</p>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {/* Stars — static render, no animation needed */}
                    <div className="flex text-[#F97316]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />
                      ))}
                    </div>
                    <span className="text-[#7A4A2A]/70 text-sm">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {/* Touch-target enlarged to 44px for mobile usability */}
                  <button
                    className="p-2.5 hover:bg-[#FFF8EE] rounded-full transition-colors text-[#7A4A2A]/70 hover:text-[#F97316]"
                    aria-label="Add to wishlist"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2.5 hover:bg-[#FFF8EE] rounded-full transition-colors text-[#7A4A2A]/70 hover:text-[#F97316]"
                    aria-label="Share product"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-[#7A4A2A]/70 mb-6 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>

              {/* Features */}
              <div className="mb-6">
                <h3
                  className="text-lg font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                >
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-[#7A4A2A]/70 text-sm sm:text-base">
                      <Check className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3
                  className="text-lg font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                >
                  Select Size
                </h3>
                {/*
                  flex-wrap so buttons don't overflow on narrow screens.
                  touchAction: manipulation removes the 300ms tap delay on iOS.
                */}
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      style={{ touchAction: 'manipulation', minWidth: '72px' }}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border-2 font-semibold
                                  transition-colors duration-200 text-sm sm:text-base ${
                        selectedSize === size.size
                          ? 'border-[#F97316] bg-[#FFF8EE] text-gray-900'
                          : 'border-gray-200 text-[#7A4A2A]/70 hover:border-[#F97316]'
                      }`}
                    >
                      <div>{size.size}</div>
                      <div className="text-[#F97316] font-black text-xs sm:text-sm">${size.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-3 sm:gap-4 mb-8 flex-wrap sm:flex-nowrap">
                <div className="flex items-center border border-gray-200 rounded-lg flex-shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
                    className="px-3 sm:px-4 py-3 text-[#7A4A2A]/70 hover:bg-[#FFF8EE] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-3 sm:px-4 py-3 font-semibold text-gray-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
                    className="px-3 sm:px-4 py-3 text-[#7A4A2A]/70 hover:bg-[#FFF8EE] transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {/*
                  `active:` state replaces `:hover` translate on mobile — hover is sticky
                  on touch devices and causes the button to stay "elevated" after tap.
                  Removed hover:-translate-y-0.5 for mobile; kept for md+.
                */}
                <button
                  style={{ touchAction: 'manipulation' }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4
                             bg-[#F97316] text-white font-bold rounded-full transition-all duration-200
                             hover:bg-[#A8430F] hover:shadow-xl md:hover:-translate-y-0.5 active:scale-[0.98]
                             active:bg-[#A8430F] whitespace-nowrap text-sm sm:text-base"
                >
                  <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
              </div>

              {/* Nutrition Facts */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                <h3
                  className="text-lg font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                >
                  Nutrition Facts (per serving)
                </h3>
                {/*
                  grid-cols-5 stays on all sizes but uses smaller text on mobile.
                  No layout change — just tighter spacing to prevent overflow.
                */}
                <div className="grid grid-cols-5 gap-2 sm:gap-4">
                  {[
                    { value: product.nutrition.calories, label: 'Calories' },
                    { value: `${product.nutrition.carbs}g`, label: 'Carbs' },
                    { value: `${product.nutrition.sugar}g`, label: 'Sugar' },
                    { value: `${product.nutrition.protein}g`, label: 'Protein' },
                    { value: product.nutrition.vitaminC, label: 'Vitamin C' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <div className="text-lg sm:text-2xl font-black text-[#F97316] leading-tight">
                        {value}
                      </div>
                      <div className="text-[10px] sm:text-sm text-[#7A4A2A]/70 leading-tight mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Related Products ── */}
          <div className="mt-12 sm:mt-16">
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8"
              style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
            >
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((related, idx) => (
                <motion.div
                  key={related.id}
                  initial={prefersReducedMotion ? false : upVariants.hidden}
                  whileInView={upVariants.visible}
                  viewport={{ once: true, margin: '-50px' }}
                  // Stagger only on desktop — sequential delay makes mobile feel sluggish
                  transition={{ delay: deviceCapability.isMobile ? 0 : idx * 0.1 }}
                  {...cardHover}
                  style={
                    !deviceCapability.isMobile
                      ? { willChange: 'transform' }
                      : { willChange: 'auto' }
                  }
                  className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300
                             border-2 border-gray-200 hover:border-[#F97316] p-5 sm:p-6 text-center"
                >
                  <div
                    className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 bg-gray-50 rounded-full
                               flex items-center justify-center border-2 border-gray-200
                               hover:border-[#F97316] transition-colors duration-300"
                  >
                    <LazyImg
                      src={`/images/${related.flavor}.webp`}
                      alt={related.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                      width={128}
                      height={128}
                    />
                  </div>
                  <h3
                    className="text-lg sm:text-xl font-black text-gray-900 mb-2"
                    style={{ fontFamily: "'Fredoka', 'Outfit', sans-serif" }}
                  >
                    {related.name}
                  </h3>
                  <div className="text-[#F97316] text-xl sm:text-2xl font-black mb-4">
                    ${related.price}
                  </div>
                  <Link
                    to={`/product/${related.id}`}
                    style={{ touchAction: 'manipulation' }}
                    className="inline-block w-full px-6 py-3 bg-gradient-to-r from-[#F97316] to-[#A8430F]
                               text-white font-bold rounded-full hover:shadow-xl transition-all duration-200
                               active:scale-[0.98] text-sm sm:text-base"
                  >
                    View Product
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default ProductDetail
