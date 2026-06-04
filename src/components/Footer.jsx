import { Link } from 'react-router-dom'
import { memo } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

/*
  ExternalLink was imported but never used — removed.
  motion was imported but never used — removed.
  Both added to the JS bundle and created unnecessary tree-shaking work.
*/

/* ══════════════════════════════════════════════════════════
   DEVICE CAPABILITY  (computed once at module load)
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   STATIC DATA  (hoisted out of render — no re-creation cost)
══════════════════════════════════════════════════════════ */
const quickLinks = [
  { name: 'Home',       path: '/' },
  { name: 'About Us',   path: '/about' },
  { name: 'Products',   path: '/products' },
  { name: 'CSR',        path: '/csr'      },
  { name: 'Contact Us', path: '/contact'  },
]

const Footer = memo(function Footer() {
  return (
    <footer
      className="bg-gray-900 text-white relative overflow-hidden"
      /*
        contain: layout style — prevents footer repaints from propagating
        upward and triggering full-page reflows. Paint containment is omitted
        here because the gradient pseudo-element at the top crosses the border,
        and paint containment would clip it. layout + style is safe.
      */
      style={{ contain: 'layout style' }}
    >
      {/* ── Decorative top line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#F97316]/50 to-transparent" />

      {/*
        Orb blur: on mobile this is clipped by overflow-hidden anyway and
        contributes nothing visually — hidden with a class to save fill-rate.
        On desktop it's a static element (no animation), so no willChange needed.
      */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-14 sm:pt-16 pb-8 relative z-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">

          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="font-black text-2xl tracking-tight bg-linear-to-r from-[#F97316] to-[#A8430F] bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Richi
              </div>
              <div>
                <div className="font-black text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Food Products
                </div>
                <div className="text-xs text-[#FFD9A8] tracking-widest uppercase">Premium Beverages</div>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Premium beverage manufacturer from Tamil Nadu. Delivering quality fruit juices, carbonated drinks, and packaged water with excellence since 2008.
            </p>

            {/*
              flex-wrap ensures badges don't overflow on very narrow screens
              without changing the desktop layout.
            */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-[#F97316]/20 text-xs text-[#FFD9A8] border border-[#F97316]/30">
                FSSAI Certified
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#F97316]/20 text-xs text-[#FFD9A8] border border-[#F97316]/30">
                Quality Assured
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-black text-lg mb-4 sm:mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    /*
                      touchAction: manipulation removes the 300ms tap delay on iOS/Android.
                      The animated dot (w-1 → group-hover:w-3) uses transition-[width]
                      instead of transition-all — only width is animating, scoping the
                      transition calculation prevents full style recalc on hover.
                      On mobile, hover never fires so this is a no-op, but it's still
                      cheaper if the browser inspects the rule at all.
                    */
                    style={{ touchAction: 'manipulation' }}
                    className="text-white/70 hover:text-[#F97316] transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#F97316] group-hover:w-3 transition-[width] duration-300 shrink-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-lg mb-4 sm:mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#F97316] mt-0.5 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:richifoodproduct@gmail.com"
                  style={{ touchAction: 'manipulation' }}
                  className="text-white/70 hover:text-[#F97316] transition-colors text-sm break-all"
                  /*
                    break-all prevents long email addresses from overflowing
                    the column on narrow mobile screens.
                  */
                >
                  richifoodproduct@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#F97316] mt-0.5 shrink-0" aria-hidden="true" />
                {/*
                  Wrapping the phone number in <a href="tel:..."> makes it
                  natively tappable on mobile — no JS needed, zero cost,
                  major UX improvement for the target audience (dealership
                  partners calling from phones).
                */}
                <a
                  href="tel:+919443518521"
                  style={{ touchAction: 'manipulation' }}
                  className="text-sm text-white/70 hover:text-[#F97316] transition-colors"
                >
                  94435 18521 / 99443 66592
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#F97316] mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-white/70 text-sm">Karagur Village, Paiyur - 2, Krishnagiri District - 635112</p>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © 2026 Richi Food Products. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              style={{ touchAction: 'manipulation' }}
              className="text-white/40 hover:text-[#F97316] text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{ touchAction: 'manipulation' }}
              className="text-white/40 hover:text-[#F97316] text-xs transition-colors"
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default Footer
