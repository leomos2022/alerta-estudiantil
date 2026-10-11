"use client";

import { motion } from "framer-motion";
import { GraduationCap, Wallet, Building2 } from "lucide-react";

const FACTORS = [
  {
    id: "académico",
    title: "Académicos",
    icon: GraduationCap,
    color: "#EF4444",
    description: "Relacionados con el rendimiento académico del estudiante",
    items: [
      "Puntajes en pruebas de Estado (ICFES / Saber 11)",
      "Rendimiento en los primeros semestres",
      "Hábitos de estudio deficientes",
      "Brecha entre expectativas y realidad académica"
    ]
  },
  {
    id: "socioeconómico",
    title: "Socioeconómicos",
    icon: Wallet,
    color: "#FFB703",
    description: "Condiciones económicas y sociales del estudiante",
    items: [
      "Estrato socioeconómico",
      "Nivel de ingresos de la familia",
      "Trabaja mientras estudia",
      "Acceso a crédito (ICETEX) o becas",
      "Apoyo familiar limitado"
    ]
  },
  {
    id: "institucional",
    title: "Institucionales",
    icon: Building2,
    color: "#2DD4BF",
    description: "Factores relacionados con la institución educativa",
    items: [
      "Nivel de acompañamiento institucional",
      "Programás de bienestar universitario",
      "Tutorías y mentorías disponibles",
      "Flexibilidad curricular",
      "Recursos de apoyo psicológico"
    ]
  }
];

export function RiskFactors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {FACTORS.map((factor, index) => {
        const Icon = factor.icon;
        return (
          <motion.div
            key={factor.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition"
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
              style={{ backgroundColor: factor.color + "20", color: factor.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{factor.title}</h3>
            <p className="text-sm text-zinc-300 mb-4">{factor.description}</p>
            <ul className="space-y-2">
              {factor.items.map((item, i) => (
                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: factor.color }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
