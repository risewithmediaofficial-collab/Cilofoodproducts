import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Star, CheckCircle, Phone, Leaf, Droplets, Award } from 'lucide-react'
import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { MultiDirectionSlideText } from '../components/MultiDirectionSlideText'
import ZigZagImage from '../components/ZigZagImage'
import { siteImages } from '../assets/siteImages.js'
import { buildBreadcrumbSchema, buildFAQSchema, buildLocalBusinessSchema, SITE } from '../seo/seoConfig'

/* ──────────────────────────────────────────────────────────────────────────
   LOCAL SEO LANDING PAGES
   Routes:
     /best-juice-krishnagiri
     /fresh-juice-hosur
     /healthy-juice-tamil-nadu
     /premium-juice-dharmapuri
     /summer-drinks-krishnagiri
     /juice-distributor-krishnagiri
──────────────────────────────────────────────────────────────────────────── */

const pageData = {
  'best-juice-krishnagiri': {
    title: 'Best Juice in Krishnagiri | #1 Premium Fruit Drink Brand',
    h1: 'Best Juice in Krishnagiri',
    description: 'Looking for the best juice in Krishnagiri? CILO by Richi Food Products is the #1 premium fruit drink brand manufactured right here in Krishnagiri District, Tamil Nadu.',
    keywords: 'best juice Krishnagiri, best fruit juice Krishnagiri, top juice brand Krishnagiri, premium drink Krishnagiri, fresh juice near me Krishnagiri, mango juice Krishnagiri',
    location: 'Krishnagiri',
    intro: `When it comes to premium, refreshing juice in Krishnagiri, nothing comes close to CILO. Manufactured right in Krishnagiri District at our state-of-the-art facility in Karagur Village, CILO is more than just a beverage — it's a taste of local pride.`,
    body: `From our farm-sourced Mango Juice to our unique Paneer Soda, Club Soda, Energy Drink, Red Energy, and Jeera Masala, every bottle is crafted with care, without artificial preservatives, and with full FSSAI certification. With 12+ flavors available in 200ml and 300ml sizes, there's a CILO for every occasion in Krishnagiri.`,
    highlight: 'Manufactured in Krishnagiri',
    image: siteImages.mango,
    features: [
      { icon: Leaf, label: '100% Natural Ingredients' },
      { icon: Award, label: 'FSSAI Certified Quality' },
      { icon: Droplets, label: '12+ Premium Flavors' },
      { icon: MapPin, label: 'Made in Krishnagiri' },
    ],
    faqs: [
      { question: 'What is the best juice brand in Krishnagiri?', answer: 'CILO by Richi Food Products is widely regarded as the best premium juice brand in Krishnagiri. Manufactured locally in Karagur Village, Paiyur, CILO offers 12+ flavors of natural fruit juices and carbonated beverages.' },
      { question: 'Where can I buy fresh juice in Krishnagiri?', answer: 'CILO juice is available at grocery stores, supermarkets, and local shops throughout Krishnagiri District. Contact us at +91 94435 18521 for the nearest retailer or for bulk orders.' },
      { question: 'Is there a juice factory in Krishnagiri?', answer: 'Yes! Richi Food Products operates a FSSAI-certified juice manufacturing facility in Karagur Village, Paiyur-2, Krishnagiri District (PIN: 635112). With 100 KL/day production capacity, we are one of the leading beverage manufacturers in Tamil Nadu.' },
      { question: 'Does CILO offer summer drinks in Krishnagiri?', answer: 'Absolutely. CILO\'s lineup includes perfect summer drinks for the Krishnagiri climate — refreshing Mango Juice, Lemon drinks, Pineapple Juice, and our cooling Jeera Masala and Paneer Soda.' },
    ],
  },
  'fresh-juice-hosur': {
    title: 'Fresh Juice in Hosur | Premium Natural Fruit Drinks Near You',
    h1: 'Best Fresh Juice in Hosur',
    description: 'Find the freshest premium fruit juice in Hosur. CILO is the leading natural beverage brand serving Hosur with 12+ flavors of healthy drinks.',
    keywords: 'fresh juice Hosur, best fruit juice Hosur, healthy drink Hosur, juice near me Hosur, natural beverage Hosur, premium juice Hosur Tamil Nadu',
    location: 'Hosur',
    intro: `Hosur residents know the importance of staying fresh and hydrated in the city's dynamic climate. CILO's premium range of natural fruit juices and refreshing beverages is the ideal companion for every moment of your day.`,
    body: `Just 30 minutes from our Krishnagiri manufacturing facility, CILO delivers unmatched freshness to Hosur. Our beverages are made from real fruit concentrates, with no artificial preservatives, and are FSSAI certified for your safety and confidence.`,
    highlight: '30 mins from our factory',
    image: siteImages.apple,
    features: [
      { icon: Leaf, label: 'No Artificial Preservatives' },
      { icon: Award, label: 'FSSAI & GST Certified' },
      { icon: Droplets, label: 'Fresh Every Day' },
      { icon: MapPin, label: 'Near Hosur — Krishnagiri' },
    ],
    faqs: [
      { question: 'Where can I get fresh juice in Hosur?', answer: 'CILO juice is available through retailers across Hosur. Being manufactured just 30 minutes away in Krishnagiri, our juice reaches Hosur at peak freshness. Call +91 94435 18521 for the nearest outlet.' },
      { question: 'Is CILO a local brand near Hosur?', answer: 'Yes! CILO is manufactured in Krishnagiri, just 30km from Hosur. You\'re supporting a truly local Tamil Nadu brand when you choose CILO.' },
      { question: 'What are the best healthy drinks available in Hosur?', answer: 'For healthy refreshment in Hosur, CILO offers Mango Juice, Apple Drink, Orange Juice, Green Lemon, Pineapple Juice, and Jeera Masala — all crafted with natural ingredients.' },
    ],
  },
  'healthy-juice-tamil-nadu': {
    title: 'Healthy Juice in Tamil Nadu | Best Natural Beverage Brand',
    h1: 'Best Healthy Juice in Tamil Nadu',
    description: 'Discover the best healthy juice brand in Tamil Nadu. CILO by Richi Food Products offers premium natural fruit beverages across the entire state.',
    keywords: 'healthy juice Tamil Nadu, best fruit juice TN, natural beverage Tamil Nadu, premium drink Tamil Nadu, healthy drink Tamil Nadu, fruit juice brand India',
    location: 'Tamil Nadu',
    intro: `Across the length and breadth of Tamil Nadu, health-conscious consumers are choosing CILO as their preferred juice brand. Made with natural ingredients, no artificial preservatives, and full FSSAI certification, CILO is Tamil Nadu's emerging premium beverage leader.`,
    body: `From Krishnagiri in the north to Chennai on the coast, CILO's distribution network continues to grow. Our 100 KL/day manufacturing capacity ensures that every corner of Tamil Nadu can enjoy fresh, premium quality beverages at competitive prices.`,
    highlight: 'Pan Tamil Nadu brand',
    image: siteImages.pineapple,
    features: [
      { icon: Leaf, label: 'All Natural, No Preservatives' },
      { icon: Award, label: 'Government FSSAI Certified' },
      { icon: Droplets, label: '100 KL/Day Capacity' },
      { icon: MapPin, label: 'Tamil Nadu Manufactured' },
    ],
    faqs: [
      { question: 'What is the best healthy juice brand in Tamil Nadu?', answer: 'CILO by Richi Food Products is a leading healthy beverage brand in Tamil Nadu, manufactured in Krishnagiri with FSSAI certification, natural ingredients, and 12+ flavors.' },
      { question: 'Is CILO available across all of Tamil Nadu?', answer: 'CILO is currently distributed across Krishnagiri, Hosur, Dharmapuri, Salem, and surrounding districts, with rapid expansion across Tamil Nadu underway.' },
      { question: 'What healthy drinks does CILO offer?', answer: 'CILO offers Mango Juice, Apple Drink, Orange Juice, Pineapple Juice, Grape Drink, Jeera Masala, Green Lemon, Salt Lemon, and more — all crafted for health and taste.' },
    ],
  },
  'premium-juice-dharmapuri': {
    title: 'Premium Juice in Dharmapuri | Best Fruit Drink Brand',
    h1: 'Premium Juice in Dharmapuri',
    description: 'CILO brings premium, naturally crafted fruit juices to Dharmapuri. Discover the best beverage brand serving Dharmapuri District.',
    keywords: 'premium juice Dharmapuri, best juice Dharmapuri, fresh fruit drink Dharmapuri, healthy beverage Dharmapuri, CILO Dharmapuri',
    location: 'Dharmapuri',
    intro: `Dharmapuri deserves premium quality. CILO's naturally crafted fruit juices and refreshing beverages bring the best of Tamil Nadu's produce to your table — fresh, healthy, and delicious.`,
    body: `As a neighbor to Krishnagiri, Dharmapuri enjoys close proximity to our manufacturing facility, ensuring every CILO bottle reaches you at peak freshness. With 12+ flavors, FSSAI certification, and competitive pricing, CILO is the premium choice for Dharmapuri.`,
    highlight: 'Close to Dharmapuri',
    image: siteImages.orange,
    features: [
      { icon: Leaf, label: 'Farm-Fresh Ingredients' },
      { icon: Award, label: 'FSSAI Certified' },
      { icon: Droplets, label: 'Premium Quality' },
      { icon: MapPin, label: 'Nearby Krishnagiri Factory' },
    ],
    faqs: [
      { question: 'Is CILO juice available in Dharmapuri?', answer: 'Yes, CILO is distributed in Dharmapuri through our growing network. Contact +91 94435 18521 for the nearest retailer or dealership opportunities.' },
      { question: 'Can I become a CILO distributor in Dharmapuri?', answer: 'Yes! We welcome dealership applications from Dharmapuri. Call +91 94435 18521 or visit our Dealership page for attractive margins and full brand support.' },
    ],
  },
  'summer-drinks-krishnagiri': {
    title: 'Best Summer Drinks in Krishnagiri | Cool & Refreshing Juices',
    h1: 'Best Summer Drinks in Krishnagiri',
    description: 'Beat the Krishnagiri summer with CILO\'s premium range of cool, refreshing fruit juices and cold drinks. Mango, Lemon, Pineapple & more.',
    keywords: 'summer drinks Krishnagiri, cool drinks Krishnagiri, refreshing juice Krishnagiri, mango juice summer, lemon juice Krishnagiri, best cold drink Krishnagiri',
    location: 'Krishnagiri',
    intro: `Krishnagiri summers are intense — and nothing beats the heat quite like a premium CILO juice. Crafted for the Tamil Nadu climate, our range of cooling, refreshing beverages is exactly what you need to stay cool and energized.`,
    body: `From our thirst-quenching Mango Juice to our unique Jeera Masala and cooling Green Lemon, CILO has the perfect summer companion for every Krishnagiri resident. All beverages are FSSAI certified, naturally made, and available at affordable prices.`,
    highlight: 'Perfect for Krishnagiri summers',
    image: siteImages.mango,
    features: [
      { icon: Droplets, label: 'Ultra Refreshing' },
      { icon: Leaf, label: 'Natural Cooling Ingredients' },
      { icon: Award, label: 'Trusted Local Brand' },
      { icon: MapPin, label: 'Made in Krishnagiri' },
    ],
    faqs: [
      { question: 'What are the best summer drinks in Krishnagiri?', answer: 'CILO\'s top summer picks for Krishnagiri are: Mango Juice, Green Lemon, Salt Lemon, Pineapple Juice, Jeera Masala, and Paneer Soda — all naturally made and FSSAI certified.' },
      { question: 'Where can I buy cold drinks in Krishnagiri?', answer: 'CILO beverages are available at grocery stores and local shops across Krishnagiri. Contact us at +91 94435 18521 for bulk summer orders.' },
    ],
  },
  'juice-distributor-krishnagiri': {
    title: 'Juice Distributor in Krishnagiri | CILO Dealership Opportunity',
    h1: 'Become a Juice Distributor in Krishnagiri',
    description: 'Join the CILO distribution network in Krishnagiri. Become a juice dealer or distributor with attractive margins and strong brand support.',
    keywords: 'juice distributor Krishnagiri, juice dealer Krishnagiri, beverage dealership Tamil Nadu, CILO dealership, wholesale juice Krishnagiri, FMCG distributor Tamil Nadu',
    location: 'Krishnagiri',
    intro: `The premium beverage market in Krishnagiri is growing fast — and CILO is at the forefront. If you're looking to build a profitable business distributing or retailing quality juice products in Krishnagiri, CILO is the right partner.`,
    body: `With a well-established brand, 12+ flavors, FSSAI certification, and a manufacturing facility right in Krishnagiri, CILO offers one of the best dealership opportunities in the Tamil Nadu FMCG sector. Enjoy competitive margins, marketing support, and a dedicated regional team.`,
    highlight: 'Dealership opportunity',
    image: siteImages.flavours1,
    features: [
      { icon: Award, label: 'Attractive Trade Margins' },
      { icon: Leaf, label: 'Strong Brand Support' },
      { icon: MapPin, label: 'Local Factory Advantage' },
      { icon: Droplets, label: 'Fast Supply Chain' },
    ],
    faqs: [
      { question: 'How do I become a CILO juice distributor in Krishnagiri?', answer: 'Apply through our Dealership page or call +91 94435 18521 / +91 99443 66592 to speak with our distribution team directly.' },
      { question: 'What margins does CILO offer to distributors?', answer: 'CILO offers competitive industry-leading margins. Exact terms depend on volume, territory, and product mix. Contact us for a detailed discussion.' },
      { question: 'Do I need a large investment to start?', answer: 'We offer flexible terms including customizable MOQ and payment cycles to suit your business scale. Reach out to discuss what works for you.' },
    ],
  },
}

function FAQItem({ faq, idx }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.07 }}
      className="border border-stone-100 rounded-2xl overflow-hidden bg-white"
    >
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FFF8F3] transition-colors"
        aria-expanded={open}>
        <span className="font-semibold text-[#2D1608] pr-4">{faq.question}</span>
        <span className={`text-[#F97316] text-lg font-bold shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-stone-600 leading-relaxed text-sm border-t border-stone-50">
          {faq.answer}
        </div>
      )}
    </motion.div>
  )
}

export default function LocalSEOPage({ pageSlug }) {
  const data = pageData[pageSlug]
  if (!data) return null

  const schema = [
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: data.location, path: `/location/${data.location.toLowerCase().replace(' ', '-')}` },
      { name: data.h1, path: `/${pageSlug}` },
    ]),
    buildLocalBusinessSchema(),
    buildFAQSchema(data.faqs),
  ]

  return (
    <PageWrapper
      title={data.title}
      description={data.description}
      url={`/${pageSlug}`}
      keywords={data.keywords}
      schema={schema}
    >
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-20 overflow-hidden bg-linear-to-br from-white via-[#FFF8F3] to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8F3] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#FFD9A8]">
                <MapPin size={13} /> {data.highlight}
              </div>
              <MultiDirectionSlideText
                as="h1"
                text={data.h1}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D1608] mb-6 leading-tight"
              />
              <p className="text-lg text-stone-600 mb-4 leading-relaxed">{data.intro}</p>
              <p className="text-base text-stone-500 mb-8 leading-relaxed">{data.body}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="px-8 py-4 bg-[#F97316] text-white font-bold rounded-full shadow-lg shadow-[#F97316]/30 hover:bg-[#E86205] transition-colors inline-flex items-center gap-2">
                  Explore Products <ArrowRight size={18} />
                </Link>
                <a href="tel:+919443518521" className="px-8 py-4 border-2 border-[#F97316] text-[#F97316] font-bold rounded-full hover:bg-[#FFF8F3] transition-colors inline-flex items-center gap-2">
                  <Phone size={16} /> Call Now
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-tr from-[#F97316]/20 to-[#FFD9A8]/30 rounded-full blur-3xl -z-10" />
              <ZigZagImage src={data.image} alt={data.h1} index={0} className="w-full h-auto max-h-120 object-contain p-6 drop-shadow-[0_20px_50px_rgba(249,115,22,0.25)]" loading="eager" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-y border-stone-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm">
          {['FSSAI Certified', 'GST Registered', '14+ Years Excellence', '100 KL/Day Production', 'Made in Tamil Nadu'].map(tag => (
            <div key={tag} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-[#F97316]" />
              <span className="font-medium text-stone-600">{tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.features.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#FFF8F3] rounded-2xl p-6 text-center border border-[#FFD9A8]/50">
                <div className="w-12 h-12 bg-white text-[#F97316] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <f.icon size={22} />
                </div>
                <p className="text-sm font-semibold text-[#2D1608]">{f.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rating */}
      <section className="py-16 bg-[#FFF8F3]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={28} className="text-[#F97316] fill-[#F97316]" />)}
            </div>
            <p className="text-4xl font-black text-[#2D1608] mb-2">4.9 / 5</p>
            <p className="text-stone-500">Based on 1,250+ customer ratings across {data.location}</p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <MultiDirectionSlideText as="h2" text="Frequently Asked Questions" className="text-3xl md:text-4xl font-black text-[#2D1608] mb-3" />
          </motion.div>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => <FAQItem key={i} faq={faq} idx={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-linear-to-br from-[#F97316] via-[#E86205] to-[#A8430F]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <MultiDirectionSlideText as="h2" text={`Taste the Difference in ${data.location}`} className="text-3xl md:text-4xl font-black text-white mb-4" />
            <p className="text-white/80 mb-10 max-w-xl mx-auto">Premium. Natural. Local. That's the CILO promise for {data.location}.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dealership" className="px-8 py-4 bg-white text-[#F97316] font-black rounded-full hover:bg-[#FFF8EE] transition-colors shadow-xl inline-flex items-center gap-2">
                Become a Distributor <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}


