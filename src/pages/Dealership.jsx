import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Send, CheckCircle } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import { PAGE_SEO, buildBreadcrumbSchema, buildFAQSchema } from '../seo/seoConfig'

/* ══════════════════════════════════════════════════════════
   PERFORMANCE HELPERS  (cached once, never recalculated)
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

// On mobile: fade-only (no translate) → no layout recalc during animation
const fadeUp = deviceCapability.isMobile
  ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35 } } }
  : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const fadeIn = {
  hidden: { opacity: 0, y: deviceCapability.isMobile ? 0 : 10 },
  visible: { opacity: 1, y: 0 },
}

// Card hover — skipped on mobile (hover is sticky on touch = jank)
const cardHover = deviceCapability.isMobile
  ? {}
  : { whileHover: { y: -12, scale: 1.02 } }

const regionCardHover = deviceCapability.isMobile
  ? {}
  : { whileHover: { y: -6, scale: 1.02 } }

const contactRowHover = deviceCapability.isMobile ? {} : { whileHover: { x: 4 } }

/* ══════════════════════════════════════════════════════════
   ORB  (GPU-composited, skipped on low-end)
══════════════════════════════════════════════════════════ */
const Orb = ({ className, delay = 0 }) => {
  if (deviceCapability.isLowEnd) return null
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      // Explicit GPU promotion for the two animated properties only
      style={{ willChange: 'transform, opacity' }}
    />
  )
}

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const regions = [
  {
    name: 'Tamil Nadu',
    contacts: [
      { name: 'Mr. Dhayalan', title: 'Regional Sales Manager (RSM)', phone: '+91-9884412151' },
    ],
  },
]

const benefits = [
  { title: 'Premium Brand Support', desc: 'Leverage our established brand reputation and strong market presence across South India.' },
  { title: 'Comprehensive Training', desc: 'Full training on products, market strategies, and sales techniques for your team.' },
  { title: 'Marketing Support', desc: 'Co-branded marketing materials, promotional campaigns, and digital marketing support.' },
  { title: 'Competitive Margins', desc: 'Industry-leading margins that ensure healthy profitability for your dealership.' },
  { title: 'Logistics Support', desc: 'Efficient supply chain management and timely product delivery to your location.' },
  { title: 'Dedicated Regional Support', desc: 'Assigned regional manager providing ongoing support and business development guidance.' },
]

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export default function Dealership() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  // Respect OS-level "reduce motion" preference
  const prefersReducedMotion = useReducedMotion()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await fetch("https://formsubmit.co/ajax/richifoodproduct@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            message: formData.message,
            _subject: "New Dealership Inquiry from " + formData.name
        })
      })
      setSubmitted(true)
      setSending(false)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', phone: '', location: '', message: '' })
      }, 5000)
    } catch (error) {
      console.error(error)
      setSending(false)
      alert("Failed to send message. Please try again.")
    }
  }

  const seo = PAGE_SEO.dealership
  const schema = [
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Dealership', path: '/dealership' },
    ]),
    buildFAQSchema([
      { question: 'How do I become a CILO Juice dealer?', answer: 'Fill out the inquiry form on this page or call our regional manager. Our team will contact you within 24 hours.' },
      { question: 'What regions does CILO Juice serve?', answer: 'We currently serve Tamil Nadu and Karnataka, with expansion plans across South India.' },
      { question: 'What are the margins for CILO Juice dealerships?', answer: 'We offer competitive, industry-leading margins. Contact us for a detailed proposal.' },
    ]),
  ]

  return (
    <PageWrapper
      title="Dealership Opportunities | Become a CILO Juice Distributor"
      description={seo.description}
      url={seo.url}
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >


      {/* ══════════ 1. HERO ══════════ */}
      <section
        className="relative pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, white 0%, #f9fafb 30%, white 70%, #f3f4f6 100%)',
          // Isolate section repaints; prevents ancestor reflows on child updates
          contain: 'layout style paint',
          overflowX: 'hidden',
        }}
      >
        {/* Leaf texture — hidden on mobile to save fill-rate */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05] hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3Cpath d='M25 80 Q65 95 55 140 Q25 110 25 80Z' fill='%237A4A2A'/%3E%3Cpath d='M155 80 Q115 95 125 140 Q155 110 155 80Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
        <Orb className="w-80 h-80 bg-[#F97316]/20 top-10 -right-20" />
        <Orb className="w-64 h-64 bg-[#F97316]/15 top-20 -left-16" delay={2} />

        <div className="relative px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Breadcrumb */}
          <motion.div
            initial={prefersReducedMotion ? false : fadeIn.hidden}
            animate={fadeIn.visible}
            className="flex items-center gap-2 text-xs text-[#F97316]/60 font-semibold uppercase tracking-widest mb-6 sm:mb-8 max-w-7xl mx-auto"
          >
            <Link to="/" className="hover:text-[#7A4A2A]">Home</Link>
            <span>/</span>
            <span className="text-[#7A4A2A]">Dealership</span>
          </motion.div>

          {/* Hero text */}
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: deviceCapability.isMobile ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: deviceCapability.isMobile ? 0.35 : 0.8, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-[#FFD9A8] text-[#7A4A2A] text-xs font-bold mb-5 sm:mb-6 shadow-sm">
                {/* animate-pulse is CSS-only — free on mobile */}
                <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-pulse" />
                Partnership Opportunity
              </span>
              <h1
                className="font-black leading-tight text-[#1A0C04] mb-5 sm:mb-6"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                }}
              >
                Become a Richi<br />
                <span className="text-[#F97316]">Dealership Partner</span>
              </h1>
              <p className="text-[#4A2800]/60 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg px-2">
                Join our growing network of successful distributors across South India. Build a profitable business with one of the region's most trusted beverage brands.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ 2. WHY PARTNER WITH US ══════════ */}
      <section
        className="relative py-20 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, white 0%, #f9fafb 35%, white 60%, #f3f4f6 100%)',
          contain: 'layout style paint',
        }}
      >
        <Orb className="w-80 h-80 bg-[#F97316]/20 top-10 -right-32" />
        <Orb className="w-96 h-96 bg-[#F97316]/15 bottom-20 -left-40" delay={2} />

        {/* Texture — desktop only */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M90 15 Q120 50 90 95 Q60 50 90 15Z' fill='%237A4A2A'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeading eyebrow="Partnership Benefits" title="Why Choose Richi" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? false : fadeUp.hidden}
                whileInView={fadeUp.visible}
                viewport={{ once: true, margin: '-40px' }}
                // No stagger on mobile — sequential delays feel sluggish
                transition={{ delay: deviceCapability.isMobile ? 0 : idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                {...cardHover}
                style={!deviceCapability.isMobile ? { willChange: 'transform' } : {}}
                className="border-2 border-gray-200 rounded-3xl p-6 sm:p-8 hover:border-[#F97316]
                           hover:shadow-2xl transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8EE] flex items-center justify-center mb-4 text-[#F97316]">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 3. REGIONAL CONTACTS ══════════ */}
      <section
        className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF8EE 0%, #f9fafb 50%, #F3F4F6 100%)',
          contain: 'layout style paint',
        }}
      >
        <Orb className="w-96 h-96 bg-[#F97316]/10 top-0 -right-32" />

        <div className="relative max-w-7xl mx-auto z-10">
          <SectionHeading eyebrow="Contact Our Team" title="Regional Dealership Managers" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {regions.map((region, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? false : fadeUp.hidden}
                whileInView={fadeUp.visible}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: deviceCapability.isMobile ? 0 : idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                {...regionCardHover}
                style={!deviceCapability.isMobile ? { willChange: 'transform' } : {}}
                className="p-6 sm:p-8 bg-white rounded-3xl border-2 border-gray-200 hover:border-[#F97316]
                           hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <MapPin className="text-[#F97316] flex-shrink-0" size={22} />
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">{region.name}</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {region.contacts.map((contact, cidx) => (
                    <motion.div
                      key={cidx}
                      initial={prefersReducedMotion ? false : {
                        opacity: 0,
                        x: deviceCapability.isMobile ? 0 : -20,
                      }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: deviceCapability.isMobile ? 0 : (idx * 0.1) + (cidx * 0.05) }}
                      {...contactRowHover}
                      className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FFF8EE] to-white
                                 border-2 border-[#FFD9A8] hover:border-[#F97316] transition-colors duration-200"
                    >
                      <div className="font-bold text-gray-900 text-sm sm:text-base mb-0.5">{contact.name}</div>
                      <div className="text-xs sm:text-sm text-[#7A4A2A] font-semibold mb-2">{contact.title}</div>
                      {/*
                        href="tel:..." — tappable on mobile natively, no JS needed.
                        touchAction: manipulation removes 300ms tap delay.
                        hover:gap-4 removed on mobile — gap animation triggers reflow.
                      */}
                      <a
                        href={`tel:${contact.phone}`}
                        style={{ touchAction: 'manipulation' }}
                        className={`inline-flex items-center gap-2 text-[#F97316] font-bold text-sm
                                    transition-all duration-200
                                    ${!deviceCapability.isMobile ? 'hover:gap-4' : ''}`}
                      >
                        <Phone size={14} /> {contact.phone}
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 4. INQUIRY FORM ══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading eyebrow="Get in Touch" title="Send Us Your Inquiry" />

          <motion.form
            initial={prefersReducedMotion ? false : { opacity: 0, y: deviceCapability.isMobile ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            // Padding reduced on mobile to avoid overflow; visually identical at sm+
            className="p-5 sm:p-8 md:p-12 rounded-3xl border-2 border-gray-200
                       bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {[
                { label: 'Full Name *', name: 'name', type: 'text', placeholder: 'Your name' },
                { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'your.email@example.com' },
                { label: 'Mobile Number *', name: 'phone', type: 'tel', placeholder: '+91 XXXXXXXXXX' },
                { label: 'Location/City *', name: 'location', type: 'text', placeholder: 'Your city/region' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    // font-size ≥ 16px prevents iOS auto-zoom on focus (major UX fix)
                    style={{ fontSize: '16px', touchAction: 'manipulation' }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl
                               focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent
                               transition-shadow duration-200"
                  />
                </div>
              ))}
            </div>

            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us about your business and dealership interests..."
                // font-size 16px prevents iOS zoom; resize-none avoids scroll reflow
                style={{ fontSize: '16px', touchAction: 'manipulation' }}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl
                           focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent
                           resize-none transition-shadow duration-200"
              />
            </div>

            {/*
              whileHover scale only meaningful on desktop.
              whileTap scale kept — gives tactile feedback on mobile press.
              touchAction: manipulation removes 300ms tap delay on iOS/Android.
            */}
            <motion.button
              whileHover={!deviceCapability.isMobile ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sending}
              style={{ touchAction: 'manipulation', willChange: 'transform' }}
              className="w-full py-4 bg-[#F97316] text-white font-black rounded-full
                         hover:bg-[#A8430F] transition-colors duration-200 flex items-center
                         justify-center gap-2 shadow-lg shadow-[#F97316]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitted ? (
                <><CheckCircle size={18} /> Message Sent Successfully!</>
              ) : (
                <><Send size={18} /> {sending ? 'Sending...' : 'Send Inquiry'}</>
              )}
            </motion.button>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl
                           text-green-700 text-sm text-center"
              >
                Thank you! Our dealership team will contact you shortly.
              </motion.div>
            )}
          </motion.form>
        </div>
      </section>

      {/* ══════════ 5. CTA ══════════ */}
      <section
        className="relative py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-br from-[#2D1608] to-[#8B5A2B] overflow-hidden"
        style={{ contain: 'layout style paint' }}
      >
        {/* Orb positioned with transform — no layout impact */}
        <Orb className="w-96 h-96 bg-white/5 top-1/2 -right-20 -translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: deviceCapability.isMobile ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ready to Partner with Us?
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-6 leading-relaxed px-2">
              Call your regional manager directly or fill out the form above. We look forward to growing together!
            </p>
            <a
              href="tel:+919443518521"
              style={{ touchAction: 'manipulation' }}
              className="inline-flex items-center gap-2 px-7 sm:px-8 py-4 bg-white text-[#7A4A2A]
                         font-black rounded-full hover:bg-[#FFF8EE] transition-colors duration-200
                         shadow-xl shadow-black/20 active:scale-[0.98] text-sm sm:text-base"
            >
              <Phone size={18} /> Call: +91 94435 18521
            </a>
          </motion.div>
        </div>
      </section>

    </PageWrapper>
  )
}
