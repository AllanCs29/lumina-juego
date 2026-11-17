# Auditoría profesional de Lúmina v0.6.1

**Fecha:** 17 de noviembre de 2026  
**Objeto:** Lúmina — Señales del Norte, rama `main`, juego HTML/Canvas con PWA.  
**Método:** revisión de `README.md`, `CHANGELOG-v0.6.1.md`, `index.html`, cuatro suites de pruebas, flujos de CI y captura móvil aportada por el creador; contraste con guías industriales y literatura académica.  
**Límites:** no es una prueba con usuarios, análisis de perfiles clínicos, certificación de accesibilidad ni validación física de Safari/iPhone. Los juicios de «aceptable/parcial/urgente» son evaluación de diseño, no métricas científicas.

## Diagnóstico general

**Fortaleza central:** aventura original funcional con movimiento de plataformas, guía jugable de controles, máquinas de programación, NIX e Iris, registros de progreso, asistencia, efectos audiovisuales y pruebas de CI que ya ejecutan escenarios de navegador. **Debilidad central:** educación, acción de plataformas, progresión narrativa, dirección visual y UX móvil todavía no se diseñan como un sistema medible de principio a fin. La biblioteca de funciones creció más rápido que la validación con personas y la arquitectura de contenidos.

**Regla de dirección:** un avance educativo debe producir una consecuencia visible en el mundo. Un objeto o señal debe leerse claramente antes de ser usado. Una misión debe enseñar un concepto antes de evaluarlo, pero no imponer lectura innecesaria a quien ya lo domina. La satisfacción debe surgir de autonomía, competencia, curiosidad y progreso auténtico, nunca de presión para permanecer conectado.

## Inventario comprobado en el repositorio

- `index.html`: aproximadamente 469 kB, 3,669 líneas, 23 bloques `<script>`, 87.7 k caracteres de CSS, 46 reglas `@media`, 99 botones HTML declarados, 11 contenedores con clase `modal`. **Consecuencia:** buen empaquetado autónomo, pero alto acoplamiento y riesgo de regresiones por estilos redundantes. Los números son instantáneas de esta revisión, no límites de calidad universales.
- `Physics.CFG`: carrera, inercia, salto de altura variable, buffer de salto (`jumpBuffer=.15`), coyote time (`coyote=.13`), impulso y subpasos de colisión de hasta 1/120 s. **Fortaleza:** base sólida de game feel; necesita pruebas de dificultad y consistencia entre dispositivos.
- `Game.frame`: usa `requestAnimationFrame` y `dt` limitado, con modos 60/120 FPS y ajuste automático de nitidez opcional. **Pendiente:** perfiles sostenidos de FPS, batería, tiempo de cuadro y Safari físico.
- `Save.clean`: migración y saneamiento; checkpoints de plataformas, escenas, misiones de LAB y borradores. **Pendiente:** pruebas de corrupción/versionado y acceso más claro a «partida guardada».
- `LabUnlock`: laboratorio se descubre en Taller de NIX después de variable de Aurora y reparación de NIX; conserva progreso de jugadores anteriores. **Fortaleza reciente:** progresión contextual.
- `LogicLabModel`: ocho misiones (tres de respuesta, cinco de programación con bloques), tutor de tres pasos, pseudocódigo previo a lenguajes y selección posterior de traducción Python/C++/JavaScript. **Pendiente:** pruebas de transferencia con entradas distintas; los operadores booleanos del laboratorio usan valores fijos durante la ejecución; superar un único caso no asegura comprender la lógica.
- Renderizado de Iris: atlas de ocho celdas de 96 px dibujadas alrededor de 40–47 píxeles de ancho de personaje, con acentos adicionales y orientación de capa corregida. **Riesgo:** el detalle adicional puede desaparecer al reducir, aun si el atlas de origen tiene más resolución.
- Móvil: aparecen tamaños de letra de 9–10 px y botones en reglas CSS de 28–35 px, aunque otros controles grandes superan 44 px. No se identificó un ajuste general de tamaño de texto equivalente a las opciones de velocidad/calidad. **Urgente:** revisar legibilidad y tamaño de pulsación en iPhone.
- Pruebas existentes: cuatro archivos de test y dos workflows (`verificar-lumina.yml`, `navegador.yml`). **Fortaleza:** CI real y capturas de Chrome. **Pendiente:** Safari físico, keyboard-only, regresión visual automática, usuarios nuevos, contrastes cuantificados, presupuesto de frame y trayecto narrativo completo.

## Comparativa: práctica recomendada frente a Lúmina

| Dimensión | Principio externo / criterio de diseño | Estado observado | Decisión |
|---|---|---|---|
| Promesa y bucle central | MDA: diseñar mecánica, observar dinámica y experiencia que produce | **Parcial:** aventuras y puzzles presentes; LAB a menudo es ventana lateral al mundo | Integrar resultado del programa en máquinas, iluminación, puentes y enemigos |
| Onboarding | Usabilidad + juego tutorial + aprendizaje situado | **Parcial:** tutorial jugable y pistas; LAB aún requiere tres pantallas textuales antes de retos nuevos | Una demostración interactiva breve, experimentar, después explicación opcional/repetible |
| Curva de aprendizaje | Apoyo gradual y práctica de recuperación | **Parcial:** orden conceptual mejoró, ocho retos fijos | Variar entradas, recuperar conocimientos antiguos, evaluar transferencia |
| Autonomía y motivación | Autonomía, competencia y relación (PENS/SDT) | **Parcial:** historia y exploración sí; selección y rutas de aprendizaje escasas | Variantes opcionales, asistencia regulable, logro por habilidad usada |
| Comportamiento ético | Evitar patrones oscuros, castigos por salir y FOMO | **Sólido en lo observado:** guardados, sin indicios de recompensas diarias o monetización compulsiva | Mantener cero streaks obligatorios, cofres, presión social o temporizadores de conexión |
| Game feel | Anticipación, tolerancia, respuesta y recuperación rápida | **Bien encaminado:** buffer, coyote, dash, checkpoints | Mapa de dificultad, medición de errores y reintento inmediato |
| Visual y profundidad | Silueta, contraste, separación de planos, consistencia de luz y contacto | **Parcial:** sombreados volumétricos; algunos objetos/sprites se sienten superpuestos | Norma única de luz, oclusión, contacto, capas y objetivos visuales |
| HUD y móvil | Objetivos visibles, botones táctiles grandes y tipografía legible | **Urgente:** fuentes pequeñas y botones de 28–35 px; overlays cercanos a gameplay | Escala de interfaz, safe areas, perfiles iPhone 16:9/19.5:9 y HUD por contexto |
| Accesibilidad | Inputs alternativos, contraste, pausas, motion reduction, texto configurable | **Parcial:** asistencia, remapeo táctil, reducción de movimiento | Tamaño de fuente, navegación teclado/foco, contrastes, lecturas y feedback multimodal |
| Narrativa y ritmo | Objetivo local legible + recompensa significativa + pausa | **Parcial:** seis regiones y misterio; poca unión entre LAB y narrativa principal | Arcos cortos, checkpoints por objetivo, decisiones y consecuencia narrativa |
| Sonido | Feedback específico y controlado | **Parcial:** efectos sonoros y ambiente original opcional | Mezcla separada, sonidos por material/estado, subtítulos/cues visuales |
| Ingeniería | Bajo acoplamiento, datos separados del motor, pruebas repetibles | **Parcial:** módulos lógicos dentro de un HTML monolítico | Modularización gradual, bundle autónomo para GitHub Pages |
| QA y métricas | Playtesting real e iteración con evidencia | **Parcial:** tests automatizados; faltan usuarios y Safari | Vertical slice, pruebas externas, indicadores de comprensión/fluidez |

## Hallazgos por severidad

### P0 — Corregir antes de añadir otro capítulo grande

**P0-01 · Aprender no equivale a acertar un ejemplo.** El laboratorio verifica respuestas y recetas con resultados fijos. Sus sensores booleanos de una misión se leen con valores constantes, lo que limita comprobar que una solución funcione si cambia el estado del entorno. Extender a casos de prueba múltiples de una misma regla, con datos variables; primero ejemplo visible, luego un caso nuevo no idéntico, por último uso de la misma técnica en una máquina del mundo. Mostrar qué estado cambia y por qué.

**P0-02 · Lectura móvil y tamaño de toque.** Auditar todos los 9–10 px y controles pequeños. Apuntar a 44×44 pt para controles táctiles primarios en iOS (recomendación de Apple), texto de lectura preferentemente 14–16 pt en áreas didácticas, con capacidad de ampliación. Tomar WCAG AA como objetivo para el HTML de interfaz: 4.5:1 texto corriente y 3:1 para componentes/indicadores esenciales. Una captura bonita no equivale a accesibilidad verificada.

**P0-03 · Integración de programación al mundo.** En v0.6.1 muchos retos viven en una ventana modal; al resolver un resultado debe abrir una compuerta, iluminar un faro, despertar NIX o alterar un escenario **ante los ojos del jugador**. Diseñar al menos una misión completamente jugable de principio a fin, sin salir del ciclo de exploración.

**P0-04 · Evitar contradicciones de interfaz.** El primer acceso sigue mostrando una carta de guía de tres pasos por misión. Que la explicación se pueda repetir y adaptar a conocimientos previos, y nunca implique que el jugador puede fallar simplemente por no haber leído tres pantallas completas. Separar «demostrar», «intentar», «pista» y «reto de dominio» con feedback distinto.

### P1 — Construir sobre una vertical slice de calidad

**P1-01 · Dirección artística de producción.** Para personajes/objetos: sombreado común, píxeles coherentes, volumen frontal/lateral, contacto y sombra, oclusión, color según función. Mantener el sprite reconocible **al tamaño final**, no solo en el atlas ampliado. Distinguir claramente decorado, plataforma sólida, peligro, objeto interactivo y objetivo mediante forma + valor + señal, nunca solo color.

**P1-02 · Ritmo y checkpoints.** Una misión larga se divide en objetivos cortos retomables; guardar tras máquinas, memorias, retos y jefes. Ofrecer práctica sin penalización, asistencia ajustable y replay sin borrar progreso.

**P1-03 · Arquitectura fuente.** Mantener `index.html` publicable, pero desarrollar fuentes separadas por dominios (física, render, inventario, guías, progresión, UI, guardado, escenas, audio, tests) y generar la página a partir de un build. Migración incremental con la suite actual como protección.

**P1-04 · Playtesting observable.** Probar con principiantes de programación y jugadores experimentados. Medir voluntariamente: comprensión sin pistas, errores por reto, finalización, tiempo hasta primera acción significativa, texto legible, abandono por frustración y sensación de autonomía. No recolectar datos sin consentimiento.

### P2 — Expansión después de tener una base validada

- Capítulo norte posterior al faro con nuevos puzzles de funciones y arreglos con datos cambiantes.
- Jefes como exámenes de conceptos combinados: anticipación de ataque + lógica, con asistencia para reflejos y control motriz.
- Misiones de programación libre gradual sin bloques, después del dominio del pseudocódigo.
- Paquetes específicos de aprendizaje de Python/C++/JavaScript, **después** de la etapa de lógica, con sus propias pruebas y objetivos.
- Música original adaptativa, ambientes por zona, mejoras de NPC y cinemáticas sin interrumpir continuamente el control.

## Riesgos: experiencia vs. manipulación

Diseñar para **querer volver** con misterio, progreso significativo, dominio, relaciones y libertad de descanso. Excluir de los criterios de éxito la permanencia compulsiva: no pérdida de recompensas al salir, no rachas obligatorias, no aleatoriedad opaca para retener, no castigos por días sin jugar y no recurrir a falsas urgencias. El progreso relevante es de comprensión y exploración, no de minutos acumulados.

## De qué fuentes procede cada regla

**Ciencia y marcos publicados, no reglas inventadas:**  
1. Hunicke, LeBlanc y Zubek (2004), MDA: https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/  
2. Tracy Fullerton, `A Playful Production Process`, MIT Press: https://mitpress.ublish.com/book/a-playful-production-process-for-game-designers-and-everyone  
3. Plass, Homer y Kinzer (2015), `Foundations of Game-Based Learning`: https://eric.ed.gov/?id=EJ1090277  
4. CAST (2024), UDL Guidelines 3.0: https://udlguidelines.cast.org/engagement/  
5. Richard Mayer, investigación multimedia, señalización y segmentación: https://academic.oup.com/edited-volume/35466/chapter-abstract/337856136  
6. Dunlosky y cols. (2013), pruebas de práctica y práctica distribuida: https://www.psychologicalscience.org/journals/pspi/1529100612453266/  
7. Self-Determination Theory / PENS: https://selfdeterminationtheory.org/player-experience-of-needs-satisfaction-pens/  
8. Zagal, Björk y Lewis (2013), patrones oscuros en juegos: https://research.chalmers.se/en/publication/177148  
9. Game Accessibility Guidelines: https://gameaccessibilityguidelines.com/full-list/  
10. Xbox Accessibility Guidelines: https://learn.microsoft.com/en-us/xbox/accessibility/guidelines  
11. Apple, UI Design Dos and Don'ts: https://developer.apple.com/design/tips/  
12. W3C WCAG 2.2: https://www.w3.org/TR/wcag/  
13. Nielsen Norman Group, diez heurísticas de usabilidad: https://www.nngroup.com/articles/ten-usability-heuristics/  
14. The Level Design Book, blockouts y wayfinding: https://book.leveldesignbook.com/process/blockout  
15. web.dev, rendimiento de renderizado: https://web.dev/articles/rendering-performance/

**Decisiones de producto propias de Lúmina, NO umbrales científicos obligatorios:** orden concreto de capítulos, tiempos por checkpoint, número de ejercicios, metas de lectura, número de tests por habilidad, identidad visual y qué misiones deben sentirse memorables. Deben validarse mediante playtesting.

---

**Estado de este documento:** auditoría y especificación; **no** equivale a haber implementado estas mejoras. La implementación debe quedar trazada en commits, tests y pruebas con jugadores.
