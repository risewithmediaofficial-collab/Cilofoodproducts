import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, Droplets, Leaf, Star, Phone, Mail, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { MultiDirectionSlideText } from '../components/MultiDirectionSlideText'
import { buildBreadcrumbSchema, buildFAQSchema, SITE } from '../seo/seoConfig'

/* ── Data ────────────────────────────────────────────────────────────────── */
const locationsData = {
  'krishnagiri': {
    city: 'Krishnagiri',
    state: 'Tamil Nadu',
    title: 'Best Fresh Juice in Krishnagiri | Premium Healthy Drinks — CILO',
    heading: 'The #1 Juice Brand in Krishnagiri',
    description: 'Experience refreshing premium fruit juices in Krishnagiri crafted with fresh ingredients and vibrant flavors. CILO — manufactured right here in Krishnagiri District — is the top choice for healthy refreshment.',
    keywords: 'best juice Krishnagiri, fresh fruit juice Krishnagiri, healthy drinks Krishnagiri, CILO juice near me, premium beverage Krishnagiri, mango juice Krishnagiri',
    image: '/images/products/mango.png',
    geo: { '@type': 'GeoCoordinates', latitude: 12.5257, longitude: 78.2143 },
    highlight: 'Manufactured in Krishnagiri',
    mapsQuery: 'Richi+Food+Products+Krishnagiri+Tamil+Nadu',
    products: ['Mango Juice', 'Apple Drink', 'Orange Juice', 'Grape Drink', 'Paneer Soda', 'Jeera Masala'],
    faqs: [
      { question: 'Where can I buy CILO juice in Krishnagiri?', answer: 'CILO juice is available across grocery stores, supermarkets, and local shops in Krishnagiri district. You can also contact us directly at +91 94435 18521 for bulk orders and distribution inquiries.' },
      { question: 'Is CILO juice manufactured in Krishnagiri?', answer: 'Yes! CILO by Richi Food Products is manufactured right in Krishnagiri District at our state-of-the-art facility in Karagur Village, Paiyur. We are a proud local brand with FSSAI certification and 100 KL/day production capacity.' },
      { question: 'What flavors are available in Krishnagiri?', answer: 'Our full range is available in Krishnagiri — Mango, Apple, Orange, Grape, Pineapple, Paneer Soda, Jeera Masala, Salt Lemon, Cola, and more — in 200ml, 500ml, 1L, and 2L sizes.' },
      { question: 'Can I become a CILO juice distributor in Krishnagiri?', answer: 'Yes! We welcome dealership applications from Krishnagiri and surrounding areas. Call +91 94435 18521 or visit our Dealership page to apply. Enjoy attractive margins and strong brand support.' },
    ],
  },
  'hosur': {
    city: 'Hosur',
    state: 'Tamil Nadu',
    title: 'Fresh Fruit Juice in Hosur | Healthy Premium Beverages — CILO',
    heading: "Hosur's Favorite Fresh Juice",
    description: 'Looking for the best fresh juice in Hosur? CILO offers a premium range of natural fruit drinks and healthy beverages, now widely available across Hosur city.',
    keywords: 'fresh juice Hosur, best fruit drink Hosur, healthy beverage Hosur, juice near me Hosur, CILO Hosur, premium juice Hosur Tamil Nadu',
    image: '/images/products/apple.png',
    geo: { '@type': 'GeoCoordinates', latitude: 12.7409, longitude: 77.8253 },
    highlight: '30 mins from our factory',
    mapsQuery: 'CILO+Juice+Hosur+Tamil+Nadu',
    products: ['Apple Drink', 'Mango Juice', 'Cola', 'Green Lemon', 'Pineapple Juice', 'Salt Lemon'],
    faqs: [
      { question: 'Is CILO juice available in Hosur?', answer: 'Yes, CILO juice is available in Hosur through our growing distribution network. Contact us at +91 94435 18521 for retailer locations near you.' },
      { question: 'What makes CILO juice different from other brands in Hosur?', answer: 'CILO is locally manufactured in Krishnagiri, just 30 minutes from Hosur, ensuring unmatched freshness. We use natural ingredients, have FSSAI certification, and offer 12+ premium flavors at competitive prices.' },
      { question: 'Can shops in Hosur stock CILO juice?', answer: 'Absolutely. We offer wholesale pricing and dealership opportunities for retailers in Hosur. Call us at +91 94435 18521 or apply through our Dealership page for attractive trade margins.' },
    ],
  },
  'dharmapuri': {
    city: 'Dharmapuri',
    state: 'Tamil Nadu',
    title: 'Premium Healthy Juice in Dharmapuri | Fresh Fruit Drinks — CILO',
    heading: 'Pure Refreshment for Dharmapuri',
    description: 'CILO Juice brings premium, farm-fresh beverages to Dharmapuri. Discover our range of natural fruit juices crafted for wellness, refreshment, and great taste.',
    keywords: 'juice Dharmapuri, fresh drinks Dharmapuri, healthy beverage Dharmapuri, fruit juice near me Dharmapuri, premium juice Tamil Nadu',
    image: '/images/products/orange.png',
    geo: { '@type': 'GeoCoordinates', latitude: 12.1273, longitude: 78.1582 },
    highlight: 'Distributed across Dharmapuri',
    mapsQuery: 'CILO+Juice+Dharmapuri+Tamil+Nadu',
    products: ['Orange Juice', 'Mango Juice', 'Jeera Masala', 'Paneer Soda', 'Apple Drink', 'Cola'],
    faqs: [
      { question: 'Where can I find CILO juice in Dharmapuri?', answer: 'CILO juice is distributed across Dharmapuri through local retailers and grocery stores. Call +91 94435 18521 for the nearest stockist.' },
      { question: 'Is CILO a local Tamil Nadu brand?', answer: 'Yes! CILO is manufactured by Richi Food Products in Krishnagiri, Tamil Nadu — making it a genuinely local brand you can trust.' },
    ],
  },
  'salem': {
    city: 'Salem',
    state: 'Tamil Nadu',
    title: 'Top Rated Fruit Juice in Salem | Premium Beverage Brand — CILO',
    heading: "Salem's Choice for Premium Juices",
    description: 'Experience the rich taste of CILO in Salem. Our premium fruit juices and refreshing drinks are now widely available across the city of Salem, Tamil Nadu.',
    keywords: 'best juice Salem, fruit drink Salem, healthy beverage Salem, premium juice Tamil Nadu, CILO Salem, fresh juice near me Salem',
    image: '/images/products/grape.png',
    geo: { '@type': 'GeoCoordinates', latitude: 11.6643, longitude: 78.1460 },
    highlight: 'Growing presence in Salem',
    mapsQuery: 'CILO+Juice+Salem+Tamil+Nadu',
    products: ['Grape Drink', 'Mango Juice', 'Apple Drink', 'Pineapple Juice', 'Salt Lemon', 'Orange Juice'],
    faqs: [
      { question: 'Is CILO juice available in Salem?', answer: 'Yes, CILO is expanding rapidly in Salem. Contact us to find retailers or to enquire about dealership opportunities in Salem.' },
      { question: 'How can I order CILO juice in bulk in Salem?', answer: 'For bulk orders and B2B inquiries in Salem, call +91 94435 18521 or email richifoodproduct@gmail.com. We offer competitive wholesale pricing.' },
    ],
  },
  'tamil-nadu': {
    city: 'Tamil Nadu',
    state: 'Tamil Nadu',
    title: 'Premium Juice Brand in Tamil Nadu | Fresh & Healthy Drinks — CILO',
    heading: 'Proudly Refreshing Tamil Nadu',
    description: 'CILO is the emerging leader in premium beverages across Tamil Nadu. From Krishnagiri to Chennai, we deliver fresh, high-quality fruit juices to every corner of the state.',
    keywords: 'best juice Tamil Nadu, premium fruit juice TN, healthy beverage Tamil Nadu, fresh juice brand India, CILO juice, mango juice Tamil Nadu',
    image: '/images/products/pineapple.png',
    geo: { '@type': 'GeoCoordinates', latitude: 11.1271, longitude: 78.6569 },
    highlight: 'Pan Tamil Nadu distribution',
    mapsQuery: 'Richi+Food+Products+Tamil+Nadu',
    products: ['Mango Juice', 'Apple Drink', 'Orange Juice', 'Pineapple Juice', 'Grape Drink', 'Cola'],
    faqs: [
      { question: 'Where is CILO juice manufactured?', answer: 'CILO is proudly manufactured in Krishnagiri, Tamil Nadu by Richi Food Products — a FSSAI certified facility with 100 KL/day production capacity.' },
      { question: 'Which districts in Tamil Nadu have CILO juice?', answer: 'Our distribution covers Krishnagiri, Hosur, Dharmapuri, Salem, and continues to expand. Contact us to bring CILO to your district.' },
    ],
  },
  'chennai': {
    city: 'Chennai',
    state: 'Tamil Nadu',
    title: 'Best Premium Beverages & Fresh Juice in Chennai | CILO',
    heading: 'The Finest Refreshment in Chennai',
    description: 'Discover why CILO is the most loved premium juice brand in Chennai. Crafted with fresh, natural ingredients for the perfect taste.',
    keywords: 'best juice Chennai, premium drink Chennai, fresh juice near me Chennai, healthy beverage Chennai, CILO Chennai',
    image: '/images/products/mango.png',
    highlight: 'Available across Chennai',
    mapsQuery: 'CILO+Juice+Chennai',
    products: ['Mango Juice', 'Apple Drink', 'Orange Juice', 'Pineapple Juice', 'Cola', 'Salt Lemon'],
    faqs: [
      { question: 'Is CILO juice available in Chennai?', answer: 'Yes, CILO juice is available in Chennai through select retailers. Contact us at +91 94435 18521 for the nearest outlet or bulk ordering.' },
    ],
  },
  'coimbatore': {
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    title: 'Premium Healthy Drinks in Coimbatore | CILO Juice',
    heading: 'Pure & Fresh Juices in Coimbatore',
    description: 'Experience the ultimate taste of health with CILO in Coimbatore. Best natural and organic drink selections.',
    keywords: 'juice Coimbatore, fresh drinks Coimbatore, healthy beverage Coimbatore, premium juice Tamil Nadu, CILO Coimbatore',
    image: '/images/products/apple.png',
    highlight: 'Serving Coimbatore region',
    mapsQuery: 'CILO+Juice+Coimbatore',
    products: ['Apple Drink', 'Mango Juice', 'Orange Juice', 'Grape Drink', 'Jeera Masala', 'Paneer Soda'],
    faqs: [
      { question: 'Where can I get CILO juice in Coimbatore?', answer: 'CILO juice is available in Coimbatore through our distribution partners. Contact +91 94435 18521 for details.' },
    ],
  },
}

const valueProps = [
  { icon: Leaf, title: '100% Natural', desc: 'Sourced from the finest farms across Tamil Nadu and South India.' },
  { icon: Droplets, title: 'Freshly Crafted', desc: 'Minimally processed to retain maximum nutrition and taste.' },
  { icon: Star, title: 'FSSAI Certified', desc: 'Premium quality backed by government food safety certification.' },
]

function FAQItem({ faq, idx }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className="border border-stone-100 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-[#FFF8F3] transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#2D1608] pr-4">{faq.question}</span>
        {open ? <ChevronUp size={20} className="text-[#F97316] shrink-0" /> : <ChevronDown size={20} className="text-stone-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-6 bg-white text-stone-600 leading-relaxed text-sm">
          {faq.answer}
        </div>
      )}
    </motion.div>
  )
}

export default function Location() {
  const { city } = useParams()
  const slug = city?.toLowerCase()
  const locationInfo = locationsData[slug]

  if (!locationInfo) {
    return (
      <PageWrapper title="Location Not Found" robots="noindex,nofollow">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <MultiDirectionSlideText as="h1" text="Location Not Found" className="text-4xl font-bold mb-4 text-[#2D1608]" />
            <p className="text-stone-500 mb-6">We couldn't find that location.</p>
            <Link to="/" className="px-6 py-3 bg-[#F97316] text-white rounded-full font-bold hover:bg-[#E86205] transition-colors">Return Home</Link>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const schema = [
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Locations', path: '/location/krishnagiri' },
      { name: locationInfo.city, path: `/location/${slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'FoodEstablishment',
      name: `CILO Juice — ${locationInfo.city}`,
      image: `${SITE.domain}/images/logo.png`,
      description: locationInfo.description,
      url: `${SITE.domain}/location/${slug}`,
      telephone: SITE.contacts.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locationInfo.city,
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
      ...(locationInfo.geo ? { geo: locationInfo.geo } : {}),
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        opens: '09:00', closes: '18:00',
      }],
      servesCuisine: 'Beverages, Healthy Juices, Fruit Drinks',
      priceRange: '₹',
      hasMap: `https://www.google.com/maps/search/${locationInfo.mapsQuery || 'CILO+Juice'}`,
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '1250' },
    },
    ...(locationInfo.faqs ? [buildFAQSchema(locationInfo.faqs)] : []),
  ]

  return (
    <PageWrapper
      title={locationInfo.title}
      description={locationInfo.description}
      url={`/location/${slug}`}
      keywords={locationInfo.keywords}
      schema={schema}
    >
      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 pb-20 overflow-hidden bg-gradient-to-br from-white via-[#FFF8F3] to-white">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' fill='%23F97316'/%3E%3C/svg%3E")`, backgroundSize: '80px' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8F3] text-[#F97316] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#FFD9A8]">
                <MapPin size={13} /> {locationInfo.highlight || `Available in ${locationInfo.city}`}
              </div>

              <MultiDirectionSlideText
                as="h1"
                text={locationInfo.heading}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D1608] mb-6 leading-tight"
              />

              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                {locationInfo.description} Whether you're looking for an energizing morning boost or a refreshing afternoon treat, CILO's premium lineup is crafted to satisfy.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="px-8 py-4 bg-[#F97316] text-white font-bold rounded-full shadow-lg shadow-[#F97316]/30 hover:bg-[#E86205] transition-colors inline-flex items-center gap-2">
                  Explore Products <ArrowRight size={18} />
                </Link>
                <a href="tel:+919443518521" className="px-8 py-4 border-2 border-[#F97316] text-[#F97316] font-bold rounded-full hover:bg-[#FFF8F3] transition-colors inline-flex items-center gap-2">
                  <Phone size={16} /> Call Us
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F97316]/20 to-[#FFD9A8]/30 rounded-full blur-3xl -z-10" />
              <img
                src={locationInfo.image}
                alt={`Premium CILO juice in ${locationInfo.city}, Tamil Nadu`}
                className="w-full h-auto max-h-[480px] object-contain drop-shadow-[0_20px_50px_rgba(249,115,22,0.25)] hover:scale-105 transition-transform duration-700 p-6"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Local Trust Bar ── */}
      <section className="bg-white border-y border-stone-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-stone-500">
          {['FSSAI Certified', 'GST Registered', '14+ Years Excellence', '100 KL/Day Capacity', 'Made in Tamil Nadu'].map(tag => (
            <div key={tag} className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#F97316]" />
              <span className="font-medium text-stone-600">{tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <MultiDirectionSlideText as="h2" text={`Why ${locationInfo.city} Chooses CILO`} className="text-3xl md:text-4xl font-black text-[#2D1608] mb-3" />
            <p className="text-stone-500 max-w-xl mx-auto">Premium beverages built on trust, quality, and local pride.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, idx) => (
              <motion.div key={prop.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-[#FAFAFA] p-8 rounded-3xl border border-stone-100 text-center hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-[#FFF8F3] text-[#F97316] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <prop.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-[#2D1608] mb-3">{prop.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Products ── */}
      {locationInfo.products && (
        <section className="py-20 bg-[#FFF8F3]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <MultiDirectionSlideText as="h2" text={`Available in ${locationInfo.city}`} className="text-3xl md:text-4xl font-black text-[#2D1608] mb-3" />
              <p className="text-stone-500">Our full range of premium beverages, ready for you.</p>
            </motion.div>
            <div className="flex flex-wrap gap-3 justify-center">
              {locationInfo.products.map((p, i) => (
                <motion.span key={p} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="px-5 py-2.5 bg-white border border-[#FFD9A8] text-[#7A4A2A] rounded-full font-semibold text-sm shadow-sm hover:border-[#F97316] hover:text-[#F97316] transition-colors duration-200 cursor-default">
                  {p}
                </motion.span>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-[#F97316] text-white font-bold rounded-full hover:bg-[#E86205] transition-colors shadow-lg shadow-[#F97316]/25">
                View All Products <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {locationInfo.faqs && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <MultiDirectionSlideText as="h2" text={`Questions About CILO in ${locationInfo.city}`} className="text-3xl md:text-4xl font-black text-[#2D1608] mb-3" />
            </motion.div>
            <div className="space-y-3">
              {locationInfo.faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} idx={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-[#F97316] via-[#E86205] to-[#A8430F]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <MultiDirectionSlideText as="h2" text={`Bring CILO to ${locationInfo.city}`} className="text-3xl md:text-5xl font-black text-white mb-4" />
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Become a distributor or retailer in {locationInfo.city}. Attractive margins, strong brand, full support.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dealership" className="px-8 py-4 bg-white text-[#F97316] font-black rounded-full hover:bg-[#FFF8EE] transition-colors shadow-xl shadow-black/20 inline-flex items-center gap-2">
                Apply for Dealership <ArrowRight size={18} />
              </Link>
              <a href="tel:+919443518521" className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                <Phone size={16} /> +91 94435 18521
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm">
              <Mail size={14} />
              <a href="mailto:richifoodproduct@gmail.com" className="hover:text-white transition-colors">richifoodproduct@gmail.com</a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  )
}

