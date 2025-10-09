// app/page.tsx
import Link from "next/link";
import CampsiteGrid from "@/components/CampsiteGrid";
import Testimonial from "@/components/Testimonial";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

export const metadata = { title: "Camp Site Reservation" };

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-indigo-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Discover Your Perfect Camp Site
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              Book amazing campsites across Australia. From beachfront locations to mountain
              retreats, find your ideal outdoor adventure.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/campsites"
                className="rounded-lg bg-white px-6 py-3 font-medium text-indigo-700 shadow hover:bg-indigo-50 flex items-center gap-1"
              >
                <FiSearch /> Find Campsites
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-white/70 px-6 py-3 font-medium hover:bg-white/10 flex items-center gap-1"
              >
                <IoIosArrowForward /> Make Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING SEARCH BAR */}
      <section className="-mt-10 px-6">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-xl">
          <form action="/search" className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Location</label>
              <input
                name="q"
                type="text"
                placeholder="Where do you want to camp?"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Check-in</label>
              <input
                name="checkin"
                type="date"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Check-out</label>
              <input
                name="checkout"
                type="date"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow hover:bg-indigo-500"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* POPULAR CAMPSITES (live data) */}
      <CampsiteGrid
        limit={3}
        title="Popular Campsites in Australia"
        subtitle="Discover the most loved camping destinations across the continent"
        className="mx-auto max-w-6xl px-6 py-16 text-center"
      />

      {/* Optional: video anchor target */}
      <div id="intro-video" className="pb-8" />

      {/* ---- Testimonials ---- */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">What Our Campers Say</h2>
            <p className="mt-2 text-slate-600">Real experiences from real adventurers</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Testimonial
              name="Sarah Johnson"
              avatar="https://i.pravatar.cc/80?img=5"
              quote={`"Amazing experience! The booking process was seamless and the campsite exceeded our expectations. Perfect for a family getaway."`}
            />
            <Testimonial
              name="Mike Chen"
              avatar="https://i.pravatar.cc/80?img=12"
              quote={`"Great variety of locations and excellent customer service. Found the perfect spot for our weekend adventure. Highly recommended!"`}
            />
            <Testimonial
              name="Emma Wilson"
              avatar="https://i.pravatar.cc/80?img=47"
              quote={`"The platform made it so easy to find and book the perfect campsite. Beautiful locations and fair pricing. Will definitely use again!"`}
            />
          </div>
        </div>
      </section>

      {/* ---- CTA Banner ---- */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h3 className="text-3xl font-bold">Ready for Your Next Adventure?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-indigo-100">
            Join thousands of happy campers who have discovered their perfect outdoor getaway
            through our platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-indigo-700 shadow hover:bg-indigo-50"
            >
              <span>🔍</span> Browse Campsites
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/70 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              <span>📩</span> Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-white">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-white">
                    <path
                      fill="currentColor"
                      d="M12 2c.38 0 .72.2.93.53l7.7 13.2c.39.66-.08 1.5-.85 1.5H4.22c-.77 0-1.24-.84-.85-1.5l7.7-13.2c.21-.33.55-.53.93-.53Zm0 3.2L6.1 16h11.8L12 5.2ZM5 19h14v2H5v-2Z"
                    />
                  </svg>
                </span>
                <span className="text-lg font-semibold">CampSite</span>
              </div>
              <p className="text-sm text-slate-400">
                Your trusted partner for unforgettable camping experiences across Australia.
              </p>
              <div className="mt-4 flex items-center gap-3 text-slate-400">
                <a href="#" aria-label="Facebook" className="hover:text-white"></a>
                <a href="#" aria-label="Twitter" className="hover:text-white"></a>
                <a href="#" aria-label="Instagram" className="hover:text-white"></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search" className="hover:text-white">Search Campsites</Link></li>
                <li><Link href="/regions" className="hover:text-white">Popular Regions</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-3 font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/booking-guide" className="hover:text-white">Booking Guide</Link></li>
                <li><Link href="/cancellation" className="hover:text-white">Cancellation Policy</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Guidelines</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-3 font-semibold text-white">Contact Info</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><span>📞</span> 1800147</li>
                <li className="flex items-center gap-2"><span>✉️</span> shishir.01@outlook.com</li>
                <li className="flex items-center gap-2"><span>📍</span> Canberra, Australia</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Campsite Reservation. All rights reserved.{" "}
            <span className="mx-2">|</span>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}


