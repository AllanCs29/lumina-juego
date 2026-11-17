# Auditoría integral de Lúmina v0.8.1
**17 de noviembre de 2026 · Revisión de producto, pedagogía autodidacta, arte/UX y programación**

## Alcance y método
Se revisaron el HTML autónomo, el laboratorio y su intérprete, progresión/guardado, render, física, menú, PWA, pruebas Node/Chromium y documentación del repositorio `AllanCs29/lumina-juego`. También se contrastaron criterios con Nielsen Norman Group, CAST UDL 3.0, literatura de aprendizaje con ejemplos, MDA y guías de accesibilidad para videojuegos. La revisión es de **código y estructura + CI automatizado**, no equivale a pruebas de comprensión de estudiantes reales, certificación WCAG ni un test físico en iPhone Safari. Se excluye deliberadamente cerrar la historia.

### Síntesis
| Área | Lo que funciona | Principal deuda | Prioridad |
|---|---|---|---|
| Enseñanza | Lógica antes de sintaxis, explicación previa, trazas y 2 escenarios para misiones 4–8 | Demostrar comprensión en **casos nuevos no anunciados**, evitar enseñanza demasiado textual | P0 |
| Aprendizaje autodidacta | Pistas, retomar borradores, tutor y tutorial repetible | Dar autonomía para explorar y repetir sin obligar a pasar por tres paneles en cada reto nuevo | P0 |
| Juego y diseño visual | Movimiento con tolerancias, checkpoints, seis áreas narrativas principales, menú reducido | Mundo y programas aún separados por modales; falta validación visual de todas las regiones | P0/P1 |
| Programación | Interprete limitado y determinista, guardado migrable, pruebas reales en Chromium | HTML monolítico, CSS acumulado, falta modularización e iOS real | P1 |

## 1. Enseñanza: el estudiante debe aprender, no adivinar

**Hallazgo E-01 — P0 · Transferencia todavía limitada.** En v0.8 cada una de las cinco misiones programables resuelve dos escenarios con valores distintos (`TRANSFER_CASES`, `validateTransfer`), mejora tangible frente a una única respuesta. Sin embargo, los pares de prueba están anunciados y son fijos. Un alumno podría aprender a satisfacer esos casos sin comprender el algoritmo. **Acción:** mantener A/B como práctica visible, agregar después una prueba C o múltiples escenarios no anunciados que compartan la misma regla, sin revelar la receta; usar casos límite válidos. **Aceptar cuando:** una solución hardcodeada falle, una general apruebe al menos 3 variantes y el alumno pueda explicar por qué.

**E-02 — P0 · Tutor excesivamente bloqueante.** `LogicLab.showGuide` mantiene `lab-run` desactivado hasta completar tres explicaciones por misión nueva. Enseñar antes de evaluar es correcto, pero no exige tres pantallas obligatorias. **Acción:** breve demostración interactiva inicial + opción «Intentar ahora» después de conocer el único concepto nuevo; ejemplos y desglose opcionales; asistencia aumentada si se equivoca. **Aceptar cuando:** alguien sin experiencia entiende la consigna y comienza a actuar en menos de un minuto, sin omitir conceptos esenciales.

**E-03 — P1 · El salto entre responder y programar es brusco.** Misiones 1–3 piden respuestas numéricas; desde la 4 se construyen recetas con bloques. **Acción:** insertar desafíos de completar/corregir 1–2 instrucciones antes de programar desde cero, sin ampliar el menú principal. **Aceptar cuando:** cada habilidad pasa de observar → predecir → completar → crear.

**E-04 — P1 · Poca práctica de recuperación.** El LAB se puede repetir, pero faltan recordatorios breves de conceptos anteriores en nuevas máquinas. **Acción:** usar una habilidad previa en cada nuevo nivel y dar feedback sobre la regla, no solo el número. **Aceptar cuando:** el jugador resuelve una variante tras un checkpoint o al regresar otro día sin que se le copie la respuesta.

**E-05 — P1 · Feedback más específico.** Se muestra la traza de A/B, pero los mensajes de fallo de misiones 5–8 son generales. **Acción:** indicar primer paso discrepante, valor antes/después, estado esperado, una pista conceptual y «probar otra vez». Nunca poner la solución exacta en la primera pista.

## 2. Autodidacta: libertad sin perder rumbo

**A-01 — P0 · Progreso y accesos contextualizados.** Resuelto en el menú v0.8.1: al empezar solo se ofrecen Jugar, Aprender controles y Opciones. Laboratorio y Cuaderno aparecen cuando son relevantes; el acceso técnico a saltar escenas está oculto en modo normal. **Pendiente:** probar si un alumno entiende cuál será su próximo objetivo dentro del escenario sin instrucciones externas.

**A-02 — P1 · Exceso de rutas informativas.** Conviven diálogo, cuaderno, tutorial, LAB, editor y máquinas de ciudad. Cada uno es útil, pero hay redundancia pedagógica. **Acción:** definir una sola pregunta de aprendizaje por misión; mostrar pista in situ y explicación ampliada a petición, no cinco ventanas compitiendo.

**A-03 — P1 · Progreso medible para el alumno.** Ya hay ocho insignias y resumen de habilidades, pero «8/8» no basta para expresar dominio. **Acción:** mostrar «Puedo: leer una variable / usar SI / depurar» y una microprueba voluntaria de transferencia; permitir repetir habilidades sin borrar la partida.

**A-04 — P1 · Sesiones cortas y retorno.** Guardados/checkpoints están presentes, pero hay que ensayar cortes durante tutoriales y editores. **Acción:** verificar que el regreso responde «¿Dónde estaba? ¿Qué aprendí? ¿Qué hago ahora?» en menos de 10 segundos, sin penalización por salir.

**A-05 — P1 · Opciones de lenguaje real.** Traducir pseudocódigo a Python/C++/JavaScript no es un curso ni ejecuta esos lenguajes. **Acción:** después de terminar la lógica, añadir lecciones específicas de sintaxis y escritura guiada, manteniendo el sistema de bloques como apoyo.

## 3. Diseño de juego, arte y experiencia

**D-01 — P0 · Resultado de programación demasiado modal.** Refugio/calefactor en Taller de NIX es una consecuencia física real. En otras misiones, la mayor parte de la recompensa sigue siendo un texto y el contador LAB. **Acción:** unir bucles con pulsos luminosos, arreglos con sensores de hielo, condiciones con compuerta y depuración con señal/faro; disparar cambios en el mundo únicamente cuando el programa sea correcto.

**D-02 — P0 · Legibilidad móvil incompleta.** El LAB elevó textos y blancos táctiles, pero otras interfaces tienen fuentes alrededor de 9–11 px y reglas compactas para pantallas horizontales. **Acción:** auditar HUD, controles, modales y diarios a escala 100/115/130 % en 844×390 y dispositivos menores, y comprobar contraste/objetivos táctiles por componente. No afirmar que cumple WCAG sin medición.

**D-03 — P1 · Arte con profundidad inconsistente.** A partir de las capturas aportadas por el creador, pinos y faro podían percibirse como imágenes superpuestas. Hay geometría, sombreado y sombras de contacto en `Renderer`, pero no basta con aumentar el atlas. **Acción:** hoja de estilo común por material; luz principal coherente, cara lateral, apoyo al suelo, sombra de contacto, oclusión, textura a tamaño final. **Aceptar cuando:** personaje, plataforma, peligro e interactuable se distinguen en 1 segundo a tamaño real de móvil.

**D-04 — P1 · Orientación solo horizontal.** Las flechas suaves v0.7.1 apuntan a objetivos de izquierda/derecha, no calculan recorridos verticales. **Acción:** señales leves en geometría, luces y elevación cuando el objetivo está en otra plataforma; no convertir en GPS que resuelva el nivel.

**D-05 — P1 · Buen movimiento, falta playtest.** Existen coyote time, salto variable, buffer, dash y checkpoints por ronda del Centinela. **Acción:** test de dificultad con novato y jugador habitual, medir errores involuntarios, lectura de ataques, recuperación y comodidad móvil. Asistencia motriz opcional sin facilitar incorrectamente la parte lógica.

**D-06 — P2 · Retención ética y ritmo.** Mantener curiosidad, recompensa útil, historia y retos en lugar de rachas, presión de conexión, pérdida de progreso y mecanismos de compulsión. La historia completa se revisará al cerrar los sistemas.

## 4. Ingeniería, arquitectura y calidad

**P-01 — P1 · Monolito HTML/CSS.** `index.html` supera aproximadamente 490 kB e incluye 23 bloques JavaScript embebidos, además de reglas visuales de versiones previas. **Riesgo:** cambios pequeños afectan sectores no relacionados; difícil refactorizar y probar aislamiento. **Acción:** migración progresiva a `src/physics`, `src/world`, `src/render`, `src/programming`, `src/learning`, `src/ui`, `src/save`, con salida compilada autónoma para Pages. No romper la URL ni la clave de guardado.

**P-02 — P1 · Evaluación y contenido acoplados.** Las tareas, opciones, guías y pruebas de dominio viven juntas dentro del bloque del LAB. **Acción:** separar reglas de ejecución, definición declarativa de misiones y validación pedagógica, manteniendo un intérprete determinista, límites de instrucciones y sin `eval`.

**P-03 — P1 · Más pruebas de regresión de estado.** Ya se prueban Node y Chromium para física/escenas, programa, guardado, menú y PWA. Faltan casos extremos de `localStorage` bloqueado o corrupto, interrupción durante reto, teclado/tab/escape, calidad y tasas de refresco, además de iPhone Safari físico. **Acción:** matriz explícita por navegador y dominio, no dar el sello «completo» por un solo test Chrome.

**P-04 — P1 · Offline, despliegue y versionado.** El `service worker` cachea la app y sustituye versiones mediante nombre de caché; los datos viven solo en el dispositivo. **Acción:** renovar caché con cada release, mostrar versión actual, verificar offline tras actualizar y proporcionar exportación/importación de partidas antes de ampliar la campaña.

**P-05 — P2 · Modo pruebas.** Los botones de saltar escenas no deben estar en el menú de jugador. En v0.8.1 solo se revelan deliberadamente agregando `?dev=1` a la URL. Este parámetro no es autorización ni seguridad: sirve únicamente para QA. A futuro se puede sustituir por herramientas de desarrollo fuera del build de producción.

## Priorización de trabajo (orden recomendado)

| Hito | Alcance | Evidencia de terminado |
|---|---|---|
| 0 · Menú | Tres opciones, desbloqueo contextual, ajustes avanzados, escenas QA ocultas | E2E Chrome PC+móvil, sin pérdida de progreso; **implementado v0.8.1** |
| 1 · Enseñanza | Guía interactiva opcional, casos nuevos no anunciados, feedback paso a paso | Novato resuelve 3 variaciones y explica su razonamiento sin copiar |
| 2 · Mundo | Una reacción física por concepto + pistas ambientales + arte consistente | Se ve la máquina cambiar al ejecutar, sin depender solo de modales |
| 3 · Accesibilidad y robustez | UI auditada, teclado, móvil, Safari real, guardado, modularización | Matriz de regresiones verde y pruebas manuales documentadas |
| 4 · Expansión | Nuevos jefes y mecánicas de lenguaje real; trama final aparte | Definiciones y playtests antes de escribir historia completa |

## Métricas útiles (sin telemetría obligatoria)
- Porcentaje de principiantes que descubren la primera interacción sin explicación externa.
- Capacidad de transferir la misma regla a una entrada nueva.
- Tiempo hasta primera acción significativa y número de pantallas de lectura obligatoria.
- Errores motrices frente a errores conceptuales (no mezclarlos).
- Reanudación de una sesión interrumpida, legibilidad del texto y ubicación del objetivo.
- FPS estables y calidad visual en PC, móviles y Safari real.

## Fuentes de diseño/educación
- Nielsen Norman Group, progressive disclosure: https://www.nngroup.com/articles/progressive-disclosure/
- CAST UDL 3.0, autonomía, feedback y progreso: https://udlguidelines.cast.org/
- Game Accessibility Guidelines: https://gameaccessibilityguidelines.com/full-list/
- Microsoft Xbox Accessibility Guideline 112: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/112
- WCAG 2.2: https://www.w3.org/TR/wcag/
- Hunicke, LeBlanc y Zubek, MDA: https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/
- Investigación de worked examples en aprendizaje con juegos: https://eric.ed.gov/?id=ED491961

**Límite honesto:** esta auditoría estructura prioridades verificables; no afirma que todos los hallazgos estén corregidos ni que la historia sea una producción final. Las mejoras deben rastrearse en commits, pruebas de navegador y ensayo de personas.
