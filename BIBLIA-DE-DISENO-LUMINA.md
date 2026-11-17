# Biblia de diseño — Lúmina: Señales del Norte

**Documento rector del proyecto** · Primera versión: 17 de noviembre de 2026

## 1. Visión

**Una aventura de plataformas y descubrimiento en la que cada problema técnico enseña a pensar como programador y cada solución transforma físicamente el mundo.** Iris y NIX exploran ciudades invernales, islas, antiguas máquinas y faros. Se aprende sin notar una separación artificial entre «videojuego» y «clase».

**Tono:** frío, misterioso, íntimo y esperanzador. La historia y la ambientación deben invitar a descubrir el siguiente secreto; la dificultad de plataformas será moderada y asistible, pero la lógica mantiene una evaluación honesta.

### Los seis pilares no negociables

1. **Aprendo haciendo:** demostrar dentro del mundo, invitar a experimentar, retroalimentar y explicar. Las pantallas de texto son apoyo, no núcleo.
2. **Progreso real:** cada concepto desbloquea una herramienta o una intervención visible en máquinas y regiones; los retos incluyen variantes de verificación.
3. **Buen movimiento:** respuesta rápida, coherente y con tolerancia justa al error; coyote time, buffer, salto expresivo, impulso y checkpoints.
4. **Lectura visual inmediata:** plataformas, riesgos, objetos interactivos, fondo y personaje nunca compiten por la misma prioridad; volumen y píxeles coherentes.
5. **Juego amable con el tiempo:** guardar sin penalizar, detenerse cuando se quiera, retomar misiones largas desde hitos, cambiar asistencia.
6. **Elección sin frustración:** primero lógica y pseudocódigo; elegir después Python, C++ o JavaScript; nunca mezclar conceptos básicos con sintaxis avanzada no presentada.

## 2. Bucle principal y resultado esperado

```
EXPLORAR mundo → DETECTAR problema → OBSERVAR/INTUIR regla
       ↓
NIX MUESTRA (ejemplo breve) → IRIS EXPERIMENTA → PROGRAMA
       ↓
EJECUTAR + VER ESTADO → FALLO EXPLICABLE O ÉXITO VISIBLE
       ↓
COMPROBAR CON VARIANTE → RECOMPENSA EN EL MUNDO
       ↓
CHECKPOINT → NUEVA PISTA NARRATIVA → EXPLORAR
```

**Microbucle pedagógico:** observar → predecir → ejecutar → interpretar → corregir → transferir. La pantalla de un editor debe informar `paso actual`, `variable antes/después`, `motivo del error` y `qué componente del mundo reaccionó`.

**Macrobucle narrativo:** restaurar señales para llegar al próximo lugar, descubrir la causa del apagón, crear vínculo con NIX, ganar herramientas y acceder a secretos opcionales. No se usarán mecanismos de presión para retener sesiones.

## 3. Diseño de aprendizaje

| Orden conceptual | Presentación en mundo | Práctica autónoma | Prueba de dominio |
|---|---|---|---|
| Secuencia | Ordenar acciones para mover una máquina | Construir 2–4 pasos | Mismo objetivo con obstáculos nuevos |
| Variable | Caja `carga` que modifica iluminación/puente | Leer, asignar y actualizar | Cambiar valor inicial y adaptar secuencia |
| Condición | Puerta Z02 con energía/red/alarma | Formular SI, Y, O, NO | Cambiar sensores y comprobar ambos casos |
| Bucle | Pulsar tres veces el faro | REPETIR sin copiar órdenes | Repeticiones con valores diferentes |
| Arreglo | Lecturas de sensores en varias posiciones | Elegir índice correcto | Cambiar orden/lectura y evitar índice inválido |
| Función | Módulo reutilizable de NIX | Entradas y salidas | Invocación con al menos dos parámetros distintos |
| Depuración | Máquina defectuosa y traza paso a paso | Detectar cambio equivocado | Reparar error en un problema no visto |
| Lenguaje real | Comparar receta con sintaxis | Selección optativa y traducción | Curso posterior diferenciado por lenguaje |

### Regla para nuevas lecciones
- Un único concepto nuevo por la primera demostración; mezclar con anteriores al final.
- **El jugador primero intenta entender** qué sucede. El diálogo formaliza después ese hallazgo, o lo presenta si se solicita ayuda.
- Explicación por capas: pista visual → pregunta → ejemplo breve → desglose paso a paso. No mostrar inmediatamente la solución completa.
- Error útil: detallar `qué esperaba`, `qué ocurrió`, `qué línea falló`, ofrecer una pista conceptual.
- Completar un ejemplo no demuestra dominio: usar al menos una **segunda variante** con datos diferentes (objetivo del producto, no consenso numérico universal).
- Repetición espaciada: traer conceptos previos a misiones posteriores, incluso si el usuario abandonó una sesión y regresó.
- Enseñar de menos a más: pseudocódigo sin lenguaje, bloques editables, pseudocódigo propio, traducción optativa y, al final, escritura de código real.

## 4. Plantilla obligatoria para cada nivel

```
IDENTIDAD: región, personaje, emoción objetivo
CONCEPTO: qué se aprende exactamente
PRECONOCIMIENTOS: qué debe haber visto primero
GANCHO: problema visual que provoca curiosidad
ZONA SEGURA: descubrir el control/mecánica sin penalización
DEMOSTRACIÓN: NIX muestra 1 ejemplo breve
PRÁCTICA: el jugador ordena, programa o manipula
VARIANTE: mismos principios con datos cambiados
TWIST: se mezcla con una habilidad conocida
RECOMPENSA: cambia la máquina/escena y se avanza en historia
CHECKPOINT: qué se guarda; cuánto se puede perder
ASISTENCIA: pistas/ralentización/remapeo
FALLOS PREVISTOS: errores probables y feedback asociado
PRUEBAS: novato, móvil, teclado, contraste y regresión
```

Los niveles deben prototiparse con siluetas y colisiones antes de añadir arte definitivo. El diseño de niveles guía con geometría, luz y objetivo visible; no mediante flechas invasivas constantes.

## 5. Sistema de arte: ley visual

### Capas y lectura
1. **Fondo**: contraste y saturación moderados, detalle fino subordinado; nunca se confunde con plataformas.
2. **Geometría jugable**: borde superior reconocible, cuerpo con espesor, cara lateral, apoyo/cimientos, sombra y material coherente. Lectura clara de colisiones.
3. **Personaje / peligro / interactuable**: silueta distintiva y acentos intencionales; cada categoría una gramática de forma + contraste + estado, jamás color aislado.
4. **Primer plano**: puede ocultar parcialmente escena solo si no tapa controles, riesgos u objetivo relevante. Oclusión predecible.
5. **HUD**: prioridad limitada a objetivo inmediato, interacción y estado; bajo ruido visual.

### Luz, volumen y pixel art
- Fijar una dirección principal de luz para cada escena; luces secundarias de máquinas deben iluminar objetos vecinos.
- Conectar siempre estructuras al suelo: sombra de contacto, fachada vs lateral, base, profundidad de puerta, nieve apoyada, relieve y cast shadow.
- Los grandes objetos no deben verse como un PNG flotante; respetar perspectiva relativa de personajes, roca, plataforma, pino, edificio, puente y faro.
- Validar cada recurso **a tamaño de juego en móvil y escritorio**. Más píxeles en el atlas por sí solos no añaden legibilidad si se comprimen a 40 px.
- Animar causas físicas: aceleración, desaceleración, anticipación, apex, caída, aterrizaje, arrastre de tela, inercia secundaria. El efecto jamás cambia una hitbox ni oculta una señal de peligro.
- Prueba visual: pantalla estática en 1 s debe permitir identificar qué se pisa, qué daña y qué se puede usar.

### Sonido
- Un evento clave debe dejar huella visual y auditiva; el sonido nunca es el único canal.
- Motivos musicales originales por escena, efectos con identidad por material; controles de volumen/mezcla separados.
- Reproducibilidad y baja estimulación cuando se active reducir movimiento/sonido.

## 6. Controles y accesibilidad

- Misma acción = mismo botón/gesto, salvo remapeo explícito. Enseñar controles al primer inicio, menú para repetir tutorial y pistas contextuales.
- Móvil: zonas táctiles grandes y separadas, sin tapar al personaje ni salientes importantes; objetivo aproximado 44×44 pt para controles primarios en iOS, coherente con Apple.
- Tipografía de misión suficientemente legible, opción de aumentar escala; no usar 9 px como cuerpo de instrucciones esenciales.
- Referencia de interfaz WCAG AA: contraste de texto habitual 4.5:1, iconos esenciales 3:1, foco visible, no sólo color.
- Pausa/resume y guardado; tutorial en modo seguro; asistencia en plataformas y lectura; sin tiempo límite obligatorio en programación.
- Variantes de entrada teclado/tacto; filtros de partículas, destellos y movimiento; narración subtitulada y teclado accesible.
- Las opciones se guardan de manera persistente y no confunden dificultad motriz con conocimiento lógico.

## 7. Diseño de recompensas y permanencia ética

**Se premia:** entender, crear soluciones distintas, explorar sin ayuda, salvar un personaje, reparar máquina y descubrir historia.  
**No se usa:** obligación de login diario, rachas que castigan desconexiones, loot boxes, recompensas ocultas, presión falsa, temporizadores de compra o pérdida de progreso por descansar.

El juego debe ofrecer la opción de terminar tras cada checkpoint con resumen de lo logrado y próximo paso, sin penalización. Una persona puede aprender en sesiones cortas; la aventura debe respetarlo.

## 8. Ingeniería, datos y pipeline

- **Fuente modular** (objetivo): `src/physics`, `src/world`, `src/render`, `src/animations`, `src/programming`, `src/learning`, `src/ui`, `src/audio`, `src/save`, `src/accessibility`; `content/` para narrativas, puzzles y reglas; `assets/` para atlas y audio.
- **Salida única** opcional: un build integrado compatible con GitHub Pages, permitiendo offline y conservando hash/clave de partidas. No romper `index.html` de golpe.
- La ejecución de programas del jugador va a intérprete aislado y determinista; nunca `eval` de código escrito por el jugador.
- Una misma lógica pedagógica alimenta UI, juego, ejecución, historia y tests (evitar dos verdades separadas).
- Estado de progreso versionado y migrable; checkpoint atómico, guardado resiliente a interrupciones.
- Ciclo de render desacoplado de cálculo de física. Probar 60 y 120 Hz sin cambiar velocidades; 60 Hz representa presupuesto aproximado de 16.7 ms de frame, no garantía de FPS.
- Instrumentación local de desarrollo; cualquier medición de personas requiere transparencia y consentimiento.

## 9. Definición de «terminado» por característica

Una función solo se marca lista si: (a) expresa un objetivo del jugador; (b) está integrada al bucle del mundo; (c) enseña o refuerza lo previsto; (d) es legible en iPhone y PC; (e) soporta las preferencias de accesibilidad pertinentes; (f) no rompe partidas anteriores; (g) tiene test unitario, integración y prueba de navegador; (h) se probó manualmente con al menos una persona que no participó en su diseño cuando la funcionalidad afecta aprendizaje/UX; y (i) incluye cambios, pendientes y una lista concreta de pruebas para el creador.

**Prohibido declarar «validado en Safari» sin hacerlo en un iPhone real.** Un test en Chrome móvil emulado no lo sustituye.

## 10. Documentos complementarios

- [Auditoría de la versión 0.6.1](AUDITORIA-PROFESIONAL-v0.6.1.md)
- [Plan y criterios de aceptación](PLAN-DE-PRODUCCION-Y-CALIDAD.md)
- [Guía visual previa](GUIA-ARTE-Y-PROFUNDIDAD.md)
- [Registro de cambios](CHANGELOG-v0.6.1.md)

**Base externa:** MDA (Hunicke et al.), `A Playful Production Process` (Fullerton), Plass et al. sobre game-based learning, CAST UDL 3.0, Mayer, Dunlosky, PENS/SDT, Game Accessibility Guidelines, XAG, Apple HIG, Nielsen heuristics y WCAG. URLs exactas en la auditoría.
