import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const Investors = lazy(() => import('./pages/Investors'))
const Contact = lazy(() => import('./pages/Contact'))
const Insights = lazy(() => import('./pages/Insights'))
const Dealership = lazy(() => import('./pages/Dealership'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Location = lazy(() => import('./pages/Location'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CSR = lazy(() => import('./pages/CSR'))
const LocalSEOPage = lazy(() => import('./pages/LocalSEOPage'))

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 pt-28 pb-12">
      <div className="flex items-center gap-3 rounded-full border border-[#FFD9A8] bg-white/90 px-5 py-3 text-sm font-semibold text-[#7A4A2A] shadow-sm">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#F97316]" />
        Loading page...
      </div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<RouteLoader />}>
        <AnimatePresence mode="popLayout">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/dealership" element={<Dealership />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/location/:city" element={<Location />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/csr" element={<CSR />} />
            <Route path="/best-juice-krishnagiri" element={<LocalSEOPage pageSlug="best-juice-krishnagiri" />} />
            <Route path="/fresh-juice-hosur" element={<LocalSEOPage pageSlug="fresh-juice-hosur" />} />
            <Route path="/healthy-juice-tamil-nadu" element={<LocalSEOPage pageSlug="healthy-juice-tamil-nadu" />} />
            <Route path="/premium-juice-dharmapuri" element={<LocalSEOPage pageSlug="premium-juice-dharmapuri" />} />
            <Route path="/summer-drinks-krishnagiri" element={<LocalSEOPage pageSlug="summer-drinks-krishnagiri" />} />
            <Route path="/juice-distributor-krishnagiri" element={<LocalSEOPage pageSlug="juice-distributor-krishnagiri" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </div>
  )
}
