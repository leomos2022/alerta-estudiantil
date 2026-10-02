# SPADIES - Contexto para Frontend

Documentacion de referencia sobre SPADIES para el desarrollo del frontend storytelling.
Autor del proyecto: **Leonardo Mosquera** - Ingeniero de Software y Analista de Datos.

---

## Que es SPADIES

SPADIES significa **Sistema para la Prevencion de la Desercion de la Educacion Superior**.

Es una herramienta informatica y estadistica oficial creada y administrada por el **Ministerio de Educacion Nacional de Colombia (MEN)**. Su objetivo principal es hacerle seguimiento al fenomeno de la desercion escolar y la graduacion en las instituciones de educacion superior del pais (universidades, instituciones tecnicas, tecnologicas, etc.).

---

## Para que sirve y como funciona

### 1. Monitoreo y Estadisticas

El sistema recopila y consolida informacion detallada de los estudiantes desde el momento en que ingresan a una carrera universitaria hasta que se graduan, abandonan temporalmente o desertan definitivamente. Permite calcular **tasas de desercion por periodo, por ano, por institucion, por programa academico y por genero**.

### 2. Identificacion de Factores de Riesgo

Una de sus funciones mas valiosas es que analiza que variables o factores aumentan la probabilidad de que un estudiante abandone sus estudios. Entre ellos se encuentran:

**Academicos**:
- Puntajes de las pruebas de Estado (ICFES / Saber 11)
- Rendimiento en los primeros semestres
- Habitos de estudio

**Socioeconomicos**:
- Estrato socioeconomico
- Nivel de ingresos de la familia
- Si el estudiante trabaja
- Si cuenta con algun tipo de apoyo financiero, credito (como ICETEX) o beca

**Institucionales**:
- Nivel de acompanamiento
- Bienestar universitario
- Tutorias que ofrece la universidad

### 3. Herramienta de Alerta Temprana

No solo sirve para ver cifras del pasado, sino que esta disenado para que las universidades puedan **identificar a tiempo a los estudiantes que estan en alto riesgo de abandonar la carrera**. De esta forma, las instituciones pueden activar rutas de apoyo (psicologico, economico o academico) antes de que el estudiante tome la decision de retirarse.

---

## Por que es importante

En el contexto de la educacion en Colombia, el SPADIES es la **fuente oficial mas confiable para entender la realidad del acceso y la permanencia universitaria**. Gracias a este sistema, tanto el Gobierno como las universidades pueden disenar politicas publicas y programas internos enfocados en retener al estudiantado y garantizar que mas jovenes logren terminar sus carreras profesionales.

---

## Aplicacion en el frontend de Alerta Estudiantil Colombia

### Secciones del storytelling a construir (manana)

1. **Hero**: "1 de cada X estudiantes no logra graduarse" (con TDA nacional mas reciente)
2. **Acerca de SPADIES**: Esta seccion usa el contexto de arriba para explicar la fuente
3. **La magnitud**: KPI cards (TDA, TAI, TDCA, TGA nacionales)
4. **Evolucion 2010-2024**: Line chart de TDA por ano
5. **Radiografia del desertor**: Barras por nivel formacion, sector, genero
6. **Donde desertan**: Choropleth por departamento
7. **Por que desertan**: Los 3 factores (academico, socioeconomico, institucional)
8. **Que pueden hacer las IES**: Recomendaciones + sistemas de alerta temprana

### Atribucion para el README y footer

- **Autor**: Leonardo Mosquera
- **Rol**: Ingeniero de Software y Analista de Datos
- **Proyecto**: Alerta Estudiantil Colombia
- **Fuentes**: SNIES (datos.gov.co) + SPADIES oficial (MEN)
- **Pipeline**: Recopilacion -> limpieza (Pandera) -> monitoreo -> analisis

### Frase clave para el hero

> "Datos oficiales del Ministerio de Educacion Nacional, escalados, limpiados y analizados por Leonardo Mosquera, Ingeniero de Software y Analista de Datos."
