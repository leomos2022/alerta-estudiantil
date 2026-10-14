export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Alerta Estudiantil Colombia - Desercion en Educacion Superior",
    description: "Investigacion independiente con datos oficiales del SPADIES - Ministerio de Educacion Nacional de Colombia. 15 anos de datos (2010-2024), 4 metricas (TDA, TAI, TDCA, TGA) por 6 dimensiones (sexo, sector, metodologia, area de conocimiento, departamento, nivel de formacion).",
    url: "https://alerta-estudiantil.leomoslab.com",
    creator: {
      "@type": "Person",
      name: "Leonardo Mosquera",
      jobTitle: "Ingeniero de Software y Analista de Datos",
    },
    keywords: [
      "desercion estudiantil",
      "educacion superior Colombia",
      "SPADIES",
      "Ministerio de Educacion Nacional",
      "tasa de desercion anual",
      "tasa de desercion cohorte acumulada",
    ],
    temporalCoverage: "2010/2024",
    spatialCoverage: "Colombia",
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
