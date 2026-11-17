# Plan de producción y compuertas de calidad — Lúmina

**Prioridad:** primero una experiencia pequeña y completa que demuestre diversión + aprendizaje + legibilidad, antes de expandir 8 sistemas aislados.

## Objetivos de producto verificables

| Id | Prioridad | Cambio específico | Prueba de aceptación |
|---|---|---|---|
| LUM-001 | P0 | Legibilidad y controles móviles | En iPhone horizontal ninguna instrucción crítica usa tamaño de letra minúsculo; controles principales dimensionados/apartados según Apple; nada tapa a Iris o el objetivo |
| LUM-002 | P0 | Desafíos con variables de entrada | Un programa debe resolver dos situaciones de datos diferentes sin que el intérprete fuerce siempre VERDADERO; fallo da una traza explicativa |
| LUM-003 | P0 | Primer circuito en mundo real | Programar el calefactor abre visualmente un refugio sin abrir ventana desconectada de gameplay; guardado de resultado y reintento seguro |
| LUM-004 | P0 | Ciclo pedagógico completo | Cada puzzle tiene objetivo, explicación interactiva, acción, feedback, variante de dominio, recompensa y checkpoint; el aprendiz puede repetir explicación |
| LUM-005 | P0 | Dirección de arte por categoría | Siluetas identificables de personaje, interactuable, obstáculo y peligro; luz y contacto coherentes; captura validada a escala de juego |
| LUM-006 | P1 | HUD adaptable | En móvil caben objetivo inmediato, USAR y estado sin ocultar juego; no scroll horizontal ni botones fuera de safe areas |
| LUM-007 | P1 | Checkpoints de misión | Guardar a mitad de misión y reanudar sin perder pasos o borrar progreso; pruebas de recarga y sesión offline |
| LUM-008 | P1 | Arquitectura modular | Código en carpetas fuente y build HTML en `dist`; comparar resultado con build actual y migración de partida |
| LUM-009 | P1 | Pruebas reales | Ejecución física Safari + teclado PC + Chrome móvil; registrar FPS, UI, dolor de pulgares, lectura y comprensión |
| LUM-010 | P1 | Audio accesible | Volúmenes de música/FX separados y feedback visual equivalente a cada evento auditivo importante |
| LUM-011 | P1 | Camino educativo progresivo | Secuencia → variable → condición → bucle → arreglo → función → depuración; mostrar traducción a lenguaje solo tras bases |
| LUM-012 | P1 | Tutor no invasivo | Mostrar guía cuando ayude, no obligar a leer largos paneles en cada repaso; pistas progresivas sin revelar solución |
| LUM-013 | P2 | Historia del Norte | Nuevo capítulo luego del faro, consecuencias por conocimientos dominados, decisiones y personajes memorables |
| LUM-014 | P2 | Jefes con lógica integrada | Ataques que telegrafían claramente, instrucciones que alteran arena, checkpoint por ronda, asistencia motriz |
| LUM-015 | P2 | Aprendizaje de sintaxis real | Lecciones por lenguaje elegible, compilación/ejecución aislada o simulación bien etiquetada, pruebas específicas |

**Importante:** P0 significa que se debe corregir antes de ampliar contenido, no que los errores sean fallos de seguridad.

## Propuesta de vertical slice

**Capítulo jugable: «La primera señal de NIX»** (propuesta de diseño, todavía no implementada).

1. Iris llega a un cuarto sin calefacción; la máquina tiene una etiqueta *carga = 2*. NIX pide que la energía llegue a 5.
2. En el mismo escenario, el jugador observa dos cajas y aprende una variable: `carga ← 2` y `carga ← carga + 3`.
3. Construye la receta con bloques en la consola. Al ejecutar, el contador, la luz, la puerta y la temperatura visual cambian **sin abandonar la escena**.
4. Si falla, la traza señala la instrucción y muestra qué valor esperaba la máquina. Primer error gratuito, sin pérdida de avance.
5. Una segunda máquina con valor inicial distinto exige **adaptar** el algoritmo, no repetirlo de memoria.
6. NIX dice qué aprendió Iris; aparecen calentador, niebla que desaparece y acceso a la siguiente zona.
7. Se guarda un checkpoint; un siguiente encuentro reusa la idea con una condición SI y una batalla corta con asistencia opcional.

**Criterio de éxito:** una persona que nunca vio programación puede explicar en lenguaje cotidiano qué hace `carga`, cambiar el valor inicial y construir otra solución sin que le lean la respuesta. No se declara aprendido únicamente por acertar un número.

## Estructura de cada entrega

1. **Meta de jugador:** qué debe sentir, entender y realizar.
2. **Cambio observable:** captura, escena o comportamiento.
3. **Tareas de ingeniería:** implementación por módulos, sin destruir partida.
4. **Verificación:** tests unitarios, regresión, navegador PC/móvil.
5. **Verificación pedagógica:** variante de datos, feedback ante error, transferencia.
6. **Accesibilidad:** tamaños, contraste, movimiento, asistencia, teclado/tacto.
7. **Comprobación del creador:** lista breve y concreta para iPhone y PC.
8. **Pendientes reales:** qué se queda fuera y motivo; no afirmar que fue probado si no lo fue.

## Playtests sugeridos

No son estándares científicos ni cantidades obligatorias; son una guía práctica para una primera ronda cualitativa.

- Al menos una persona sin experiencia con programación.
- Al menos una persona que use con frecuencia juegos de plataformas.
- Al menos una persona en pantalla móvil pequeña.
- Si es posible, un participante con necesidades de accesibilidad relevantes y consentimiento explícito.

**Se observa, sin explicar previamente:** si identifica qué se puede usar; dónde mira; qué entiende por variable; qué cree que ocurrirá al ejecutar; en qué momento busca ayuda; si llega a checkpoints; si quiere continuar por curiosidad y no por presión.

**Preguntas de salida:** «¿Qué aprendiste?», «¿Qué harías si carga iniciara en 4?», «¿Qué lugar te dio curiosidad?», «¿Qué objeto se veía pegado o plano?», «¿Qué botón te costó tocar?», «¿Qué puedes hacer cuando regresas al juego?».

No incluir telemetría personal sin acuerdo y controles claros.

## Matriz de pruebas automáticas a añadir

- Física: plataformas en extremos, dash izquierda/derecha, bordes, salto buffer y reintento.
- Interprete: propiedades sobre diferentes valores iniciales, errores típicos, límites de bucles, resultados booleanos verdaderos **y falsos**, arrays índice 0 y último.
- Guardado: partidas heredadas, localStorage sin permisos, JSON corrupto, progreso de mitad de misión, actualizaciones PWA.
- UI: foco/restauración al cerrar modal, uso solo con teclado, menús consistentes, fuentes escaladas, safe areas, reducir movimiento.
- Render: escenarios representativos en Retro/Equilibrada/Nítida, héroe izquierda/derecha, PNG diffs y comprobación humana de siluetas.
- Rendimiento: 60 FPS con presupuesto de 16.7 ms por cuadro, sin imputar un 120 FPS que Safari no entrega; tiempo de render, energía, batería y comportamientos al bloquear/reabrir pantalla.
- Integración narrativa: partida nueva → sensores → variables → NIX → LAB → un desafío → checkpoint → recarga offline → continuar → faro.
- Safari físico: orientación, gesto navegador, pantalla de inicio PWA, audio, vibración, guardado, táctil, bajo consumo.

## Orden de implementación aconsejado

**Milestone A — Claridad y dominio:** LUM-001, 002, 004, 005.  
**Milestone B — Vertical slice conectado:** LUM-003, 006, 007, 011, 012.  
**Milestone C — Base robusta:** LUM-008, 009, 010.  
**Milestone D — Nuevas islas y profundidad:** LUM-013, 014, 015.

La prioridad se volverá a ordenar después de pruebas reales. La regla es **no añadir capítulos sin haber validado la calidad del bucle principal**.

[Auditoría](AUDITORIA-PROFESIONAL-v0.6.1.md) · [Biblia de diseño](BIBLIA-DE-DISENO-LUMINA.md) · [Jugar](https://allancs29.github.io/lumina-juego/)
