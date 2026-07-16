import Link from "next/link";
import {
  Wrench,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-surface text-ink-soft mt-auto border-t border-line">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 bg-gradient-to-br from-brand-purple to-brand-orange
                rounded-xl flex items-center justify-center"
              >
                <Wrench size={17} className="text-white" />
              </div>
              <div>
                <p className="font-display text-ink text-sm tracking-wide">OM Mobile Repair</p>
                <p className="text-xs text-brand-purple">Expert Device Care</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Professional repair services for all your devices. Fast
              turnaround, genuine parts, expert technicians.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-ink font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/book", label: "Book a Repair" },
                { href: "/my-repairs", label: "Track My Repair" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-brand-purple transition flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-ink font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-brand-orange shrink-0" />
                123 Repair Street, Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-brand-orange shrink-0" />
                +977 98-0000-0000
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-brand-orange shrink-0" />
                support@ommobile.com
              </li>
              <li className="flex items-center gap-2">
                <Clock size={15} className="text-brand-orange shrink-0" />
                Mon-Sat: 7:00 AM – 7:00 PM (Closed Sundays)
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div
          className="border-t border-line mt-10 pt-6 flex flex-col md:flex-row
          justify-between items-center gap-3 text-sm"
        >
          <p>© {currentYear} OM Mobile Repair Center. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-brand-purple transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-brand-purple transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
