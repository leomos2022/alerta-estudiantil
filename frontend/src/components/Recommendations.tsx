"use client";

import { motion } from "framer-motion";
import { Bell, BookOpen, DollarSign, Heart } from "lucide-react";

const RECOMMENDATIONS = [
  {
    id: "alerta",
    title: "Sistema de Alerta Temprana",
    icon: Bell,
    color: "#EF4444",
    description: "Implementar herramientas como SPADIES para identificar estudiantes en riesgo antes de que abandonen",
    actions: [
      "Monitoreo continuo de variables academicas y socioeconomicas",
      "Alertas automaticas para estudiantes con bajo rendimiento",
      "Dashboards para directores de programa"
    ]
  },
  {
    id: "academico",
    title: "Acompanamiento Academico",
    icon: BookOpen,
    color: "#FFB703",
    description: "Programas estructurados de tutorias y mentorias durante los primeros semestres",
    actions: [
      "Tutorias personalizadas para estudiantes de alto riesgo",
      "Cursos remediales en areas criticas (matematicas, lectura)",
      "Seguimiento individual del progreso academico"
    ]
  },
  {
    id: "financiero",
    title: "Apoyo Financiero",
    icon: DollarSign,
    color: "#2DD4BF",
    description: "Ampliar cobertura de becas, creditos y subsidios para estudiantes vulnerables",
    actions: [
      "Becas para estudiantes de estratos 1-3",
      "Creditos condonables para buen rendimiento",
      "Subsidios de transporte y alimentacion"
    ]
  },
  {
    id: "bienestar",
    title: "Bienestar Universitario",
    icon: Heart,
    color: "#A78BFA",
    description: "Fortalecer programas de bienestar integral y acompanamiento psicologico",
    actions: [
      "Atencion psicologica gratuita",
      "Programas de orientacion socioocupacional",
      "Actividades extracurriculares y deportivas"
    ]
  }
];

export function Recommendations() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {RECOMMENDATIONS.map((rec, index) => {
        const Icon = rec.icon;
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition"
          >
            <div className="flex items-start gap-4">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0"
                style={{ backgroundColor: rec.color + "20", color: rec.color }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{rec.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{rec.description}</p>
                <ul className="space-y-1">
                  {rec.actions.map((action, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: rec.color }}
                      />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
