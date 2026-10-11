"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function VideoSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Demo en video</h2>
        <p className="text-zinc-300">Presentacion del proyecto por Leonardo Mosquera</p>
      </div>

      {/* Video placeholder - se reemplaza con iframe de YouTube cuando tengas el video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-amber-400/5" />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-amber-400 ml-1" fill="currentColor" />
          </div>
          <p className="text-xl font-semibold text-white mb-1">Proximamente</p>
          <p className="text-sm text-zinc-400">Video demo de 2-3 min explicando el proyecto</p>
        </div>

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full">
            En produccion
          </span>
        </div>
      </motion.div>

      <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Que encontraras en el video?</h3>
        <ul className="space-y-2 text-sm text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span>El problema: 1 de cada 2 estudiantes no logra graduarse (TDCA acumulada ~46%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span>Como se construyo: arquitectura ETL + API + Frontend con datos oficiales del MEN</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span>Demo del dashboard interactivo con 15 anos de datos (2010-2024)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            <span>Como acceder a la investigacion completa + repositorio privado</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
