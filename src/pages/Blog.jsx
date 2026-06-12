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

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col"
            >
              <Link to={`/blog/${post.slug}`} className="block relative overflow-visible min-h-[260px] bg-gradient-to-b from-[#FFF8F3] to-white flex items-center justify-center p-8 border-b border-[#FFD9A8]/30">
                <ZigZagImage
                  src={post.image} 
                  alt={post.title} 
                  index={idx}
                  className="relative z-10 w-auto max-h-[200px] object-contain drop-shadow-[0_12px_28px_rgba(45,22,8,0.15)]" 
                  style={{ objectFit: 'contain' }}
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/95 backdrop-blur text-[#F97316] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-[#FFD9A8]">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-semibold text-stone-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-[#2D1608] mb-3 leading-tight group-hover:text-[#F97316] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-stone-500 text-sm mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[#F97316] font-bold text-sm hover:gap-3 transition-all">
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}

