import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500
                rounded-xl flex items-center justify-center"
              >
                <span className="text-lg">🔧</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">OM Mobile Repair</p>
                <p className="text-xs text-blue-400">Expert Device Care</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Professional repair services for all your devices. Fast
              turnaround, genuine parts, expert technicians.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/book", label: "Book a Repair" },
                { href: "/my-repairs", label: "Track My Repair" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-blue-400 transition flex items-center gap-1.5"
                  >
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                📍 123 Repair Street, Tech City
              </li>
              <li className="flex items-center gap-2">📞 +91 98765 43210</li>
              <li className="flex items-center gap-2">
                📧 support@ommobile.com
              </li>
              <li className="flex items-center gap-2">
                🕐 Mon-Sat: 9:00 AM – 7:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row
          justify-between items-center gap-3 text-sm"
        >
          <p>© {currentYear} OM Mobile Repair Center. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-blue-400 transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-blue-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
