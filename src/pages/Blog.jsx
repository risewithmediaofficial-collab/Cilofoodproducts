import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import { MultiDirectionSlideText } from '../components/MultiDirectionSlideText'
import ZigZagImage from '../components/ZigZagImage'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { blogPosts } from '../data/blogData'
import { PAGE_SEO, buildBreadcrumbSchema, buildOrganizationSchema } from '../seo/seoConfig'

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))]

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory)

  const seo = PAGE_SEO.blog
  const schema = [
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Journal', path: '/blog' },
    ]),
    buildOrganizationSchema(),
  ]

  return (
    <PageWrapper
      title="The CILO Journal | Juice & Beverage Insights"
      description={seo.description}
      url={seo.url}
      keywords={seo.keywords}
      type="website"
      schema={schema}
    >

      <div className="pt-28 sm:pt-32 md:pt-36 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <MultiDirectionSlideText
            as="h1"
            textLeft="The"
            textRight="CILO Journal"
            className="text-4xl md:text-5xl font-black text-[#2D1608] mb-6"
            rightClassName="text-[#F97316]"
          />
          <p className="text-[#7A4A2A]/70 max-w-2xl mx-auto text-lg">
            Insights, wellness tips, and stories behind our premium beverage collection.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/20'
                  : 'bg-white text-[#7A4A2A] border border-stone-200 hover:border-[#F97316] hover:text-[#F97316]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog List */}
        <div className="space-y-8 md:space-y-10">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(idx * 0.06, 0.2), ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-[2rem] border border-stone-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
            >
              <div className="grid items-stretch md:grid-cols-2">
                <Link
                  to={`/blog/${post.slug}`}
                  className={`relative flex min-h-[280px] items-center justify-center overflow-hidden border-b border-[#FFD9A8]/30 bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF8F3] p-8 md:min-h-[340px] md:border-b-0 ${
                    idx % 2 === 1 ? 'md:order-2' : ''
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_60%)]" />
                  <ZigZagImage
                    src={post.image}
                    alt={post.title}
                    index={idx}
                    className="relative z-10 w-auto max-h-[230px] object-contain drop-shadow-[0_16px_34px_rgba(45,22,8,0.14)] md:max-h-[260px]"
                    style={{ objectFit: 'contain' }}
                  />
                  <div className="absolute left-4 top-4 z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD9A8] bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F97316] shadow-sm backdrop-blur">
                      <Tag size={13} /> {post.category}
                    </span>
                  </div>
                </Link>

                <div
                  className={`flex flex-col justify-center p-6 sm:p-8 md:p-10 ${
                    idx % 2 === 1 ? 'md:order-1' : ''
                  }`}
                >
                  <div className="mb-4 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="mb-4 text-2xl font-black leading-tight text-[#2D1608] transition-colors group-hover:text-[#F97316] md:text-3xl">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="mb-8 max-w-xl text-sm leading-relaxed text-stone-500 md:text-base">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F97316]/20 transition-all duration-300 hover:bg-[#EA6C0A] hover:gap-3"
                    >
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

