"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap } from "lucide-react";

const NAV_LINKS = [
  { href: "#kpi", label: "KPIs" },
  { href: "#evolution", label: "Evolucion" },
  { href: "#radiografia", label: "Radiografia" },
  { href: "#donde", label: "Departamentos" },
  { href: "#porque", label: "Factores" },
  { href: "#recomendaciones", label: "Recomendaciones" },
  { href: "#video", label: "Demo" },
  { href: "#cta", label: "Pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "bg-[#0B0F19]/90 backdrop-blur-md border-b border-zinc-900 py-3"
          : "bg-transparent py-5")
      }
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-white font-bold">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <span className="text-base">Alerta Estudiantil</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md transition"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#cta"
            className="ml-4 px-4 py-2 text-sm font-semibold text-zinc-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition"
          >
            Investigacion completa
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-zinc-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-[#0B0F19] border-t border-zinc-900"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-md transition"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4 py-2 text-sm font-semibold text-zinc-900 bg-amber-400 rounded-lg text-center"
              >
                Investigacion completa
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
