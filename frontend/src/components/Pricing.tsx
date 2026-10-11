"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const TIERS = [
  {
    id: "estudiante",
    name: "Estudiante",
    price_cop: 29900,
    price_display: "$29.900",
    description: "Para estudiantes individuales",
    audience: "Estudiantes de pregrado/posgrado",
    features: [
      "Acceso al repositorio (read-only) por 12 meses",
      "PDF del informe ejecutivo (40-60 paginas)",
      "Dataset limpio en CSV",
      "Notebooks reproducibles",
      "50% OFF con email .edu.co"
    ],
    popular: false
  },
  {
    id: "profesional",
    name: "Profesional",
    price_cop: 99000,
    price_display: "$99.000",
    description: "Para profesores e investigadores",
    audience: "Profesores, consultores, analistas",
    features: [
      "Todo lo de Estudiante, mas:",
      "Dataset en Parquet (listo para SQL/DuckDB)",
      "Acceso al dashboard interactivo por 6 meses",
      "Marts SQL listos para consultas",
      "Diccionario de datos completo",
      "Citacion sugerida (DOI al publicar)"
    ],
    popular: true
  },
  {
    id: "institucional",
    name: "Institucional",
    price_cop: 299000,
    price_display: "$299.000",
    description: "Para IES, facultades, centros",
    audience: "Universidades, facultades, centros de investigacion",
    features: [
      "Todo lo de Profesional, mas:",
      "Licencia de uso interno (hasta 5 usuarios)",
      "1 hora de consultoria via Google Meet",
      "Soporte de 30 dias via email",
      "Exportable a LMS (Moodle, Blackboard)"
    ],
    popular: false
  },
  {
    id: "gobierno",
    name: "Gobierno",
    price_cop: 999000,
    price_display: "$999.000",
    description: "Para entidades publicas",
    audience: "Ministerios, secretarias, ONG grandes",
    features: [
      "Todo lo de Institucional, mas:",
      "Licencia extendida (hasta 25 usuarios)",
      "Personalizacion de KPIs territoriales",
      "Soporte prioritario 90 dias",
      "Acceso anticipado a actualizaciones",
      "Consultoria de implementacion (3 horas)"
    ],
    popular: false
  }
];

export function Pricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {TIERS.map((tier, index) => (
        <motion.div
          key={tier.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={
            tier.popular
              ? "bg-amber-400/10 border-2 border-amber-400 rounded-lg p-6 relative"
              : "bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition"
          }
        >
          {tier.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full">
              MAS POPULAR
            </span>
          )}
          <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
          <p className="text-xs text-zinc-400 mb-3">{tier.description}</p>
          <div className="mb-1">
            <span className="text-3xl font-bold text-white">{tier.price_display}</span>
            <span className="text-sm text-zinc-500 ml-1">COP</span>
          </div>
          <p className="text-xs text-amber-400 mb-4">{tier.audience}</p>
          <ul className="space-y-2 mb-6">
            {tier.features.map((feature, i) => (
              <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                <Check className="w-3 h-3 mt-0.5 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            className={
              tier.popular
                ? "w-full py-2 bg-amber-400 text-zinc-900 font-semibold rounded-lg hover:bg-amber-300 transition"
                : "w-full py-2 border border-zinc-700 text-zinc-200 font-semibold rounded-lg hover:bg-zinc-800 transition"
            }
          >
            Comprar
          </button>
        </motion.div>
      ))}
    </div>
  );
}
