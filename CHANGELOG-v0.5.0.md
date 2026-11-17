# Lúmina v0.5.0 — Movimiento, desafíos y el Centinela

## Nuevas funciones
- **Laboratorio opcional (Menú → Laboratorio de lógica):** tres ejercicios interactivos de funciones, arreglos y depuración. El usuario introduce respuestas enteras, ejecuta la comprobación, recibe pistas y ve un rastreo de valores. Se conserva el progreso `labCompleted` en la partida, sin abrir un intérprete de código arbitrario.
- **Centinela con tres patrones:** primera ronda con onda, segunda con dos ondas escalonadas y tercera con columna de energía que marca el lugar antes del ataque. Señales de anticipación, respuesta visual y modo asistencia que reduce la exigencia.
- **Checkpoint por ronda:** `guardianCheckpoint` guarda 0–3; al regresar al encuentro se restaura la última ronda sin volver a contestar las anteriores. El botón `Reiniciar rondas` permite repetirlo desde cero.
- **Animaciones de Iris:** sprite con escala de estiramiento en salto, compresión al aterrizar, movimiento de carrera, respiración sutil en reposo, bufanda que responde a la velocidad y estelas del impulso. Se mantienen exactamente las hitboxes.
- **NIX y Centinela:** pequeños movimientos adicionales en pies, antena, brazos y señales del jefe.
- **Ambiente invernal:** capas de nieve con diferentes velocidades, bruma en parallax en Pasarela Boreal, puerto y faro, sin modificar colisiones.
- **Música original opcional:** sonido ambiental sintético por Web Audio, sin archivos externos, activado únicamente mediante controles del usuario.
- **Vibración opcional:** feedback al recoger y resolver cuando el navegador soporta la API de vibración. No se anuncia como disponible si el navegador carece de ella.
- **Compatibilidad de guardado:** nuevos campos integrados al esquema v1 existente, sin borrar orbes, misiones, checkpoints antiguos ni historial.

## Verificaciones automatizadas
- `tests/v048-art-smoke.mjs`: comprueba sintaxis de los módulos del juego, materialidad de dibujos y estabilidad de microtexturas.
- `tests/v050-progress-smoke.mjs`: evalúa respuestas de funciones/arreglos/depuración, compatibilidad de guardado y puntos de control/patrones del Centinela.
- Workflow `.github/workflows/verificar-lumina.yml` ejecuta ambas pruebas con Node 22 en cada actualización de `main`.
- Los fotogramas de arte se simulan con API Canvas mínima; estas pruebas no prueban apariencia real en pantalla ni rendimiento de Safari.

## Aún pendiente / ideas de siguientes etapas
- **Revisión en iPhone real:** FPS estables, compatibilidad de Web Audio con interrupciones, orientación y guardado.
- Crear más fotogramas originales de pixel art para Iris, NIX y enemigos, no solo deformación y animación procedural del atlas existente.
- Convertir el laboratorio opcional en misiones narrativas integradas al mundo, con construcción libre de programas y evaluación más compleja.
- Ampliar jefes, habilidades, música original de escenas completas y accesibilidad (vibración no disponible en todos los navegadores).
- Ajustar contraste y profundidad visual según capturas de jugadores.

[Qué probar en v0.5.0](QUE-PROBAR-v0.5.0.md) · [Jugar](https://allancs29.github.io/lumina-juego/)
