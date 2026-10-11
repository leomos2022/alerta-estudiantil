"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  tda: number;
  year: number;
}

export function Hero({ tda, year }: HeroProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = tda / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= tda) {
        setCount(tda);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [tda]);

  const oneInX = Math.round(100 / tda);

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-[#0B0F19] px-6 py-20">
      <div className="max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full">
            Datos oficiales SPADIES - {year}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            <span className="text-amber-400">1 de cada {oneInX}</span> estudiantes
            <br />
            abandona la universidad cada año
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-8">
            La tasa de desercion anual en Colombia se ubica en {count.toFixed(2)}% ({year}).
            Un fenomeno con consecuencias económicas, sociales y personales.
            Investigación independiente basada en datos oficiales del Ministerio de Educación.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#kpi" className="px-6 py-3 bg-amber-400 text-zinc-900 font-semibold rounded-lg hover:bg-amber-300 transition">
              Ver hallazgos
            </a>
            <a href="#cta" className="px-6 py-3 border border-zinc-700 text-zinc-200 font-semibold rounded-lg hover:bg-zinc-800 transition">
              Investigación completa - $29.900 COP
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
