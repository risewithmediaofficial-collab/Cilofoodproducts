export const staticRoutes = [
  '/about',
  '/products',
  '/contact',
  '/blog',
  '/csr',
  '/investors',
  '/insights',
  '/dealership',
]

export const locationSlugs = [
  'krishnagiri',
  'hosur',
  'dharmapuri',
  'chennai',
  'salem',
  'coimbatore',
  'tamil-nadu',
]

export const localSeoRoutes = [
  '/best-juice-krishnagiri',
  '/fresh-juice-hosur',
  '/healthy-juice-tamil-nadu',
  '/premium-juice-dharmapuri',
  '/summer-drinks-krishnagiri',
  '/juice-distributor-krishnagiri',
]

const blogSlugs = [
  'taste-the-tropics-mango-juice',
  'crisp-and-refreshing-apple-juice',
  'the-bold-flavor-of-grapes',
  'citrus-burst-orange-juice',
  'zesty-white-lemon',
  'green-lemon-carbonated-refreshment',
  'paneer-soda-nostalgia-in-a-bottle',
  'the-classic-cola-experience',
  'jeera-masala-the-digestive-refresher',
  'tropical-escape-pineapple-juice',
  'best-juice-in-krishnagiri',
  'fresh-juice-hosur-guide',
  'summer-drinks-krishnagiri-2026',
  'healthy-juice-tamil-nadu-brand',
]

export const blogRoutes = blogSlugs.map((slug) => `/blog/${slug}`)
export const locationRoutes = locationSlugs.map((slug) => `/location/${slug}`)

export const prerenderRoutes = [
  '/',
  ...staticRoutes,
  ...blogRoutes,
  ...locationRoutes,
  ...localSeoRoutes,
]

// vite-plugin-sitemap already includes the site root, so we omit `/` here.
export const sitemapRoutes = [
  ...staticRoutes,
  ...blogRoutes,
  ...locationRoutes,
  ...localSeoRoutes,
]
