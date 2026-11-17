# Lúmina v0.4.6 — Profundidad y contraste en todo el mundo

## Cambios realizados
- **Faro del Silencio:** arquitectura reconstruida con volumen 3/4, paredes frontal y lateral, acceso retranqueado, escalones, cimientos, contrafuertes, lente y sombras sobre el suelo. Iluminación contextual al activarlo.
- **Personaje:** sombra de contacto únicamente cuando Iris está en el suelo (sin sombra suspendida en el aire).
- **HUD móvil:** indicador de impulso a la izquierda, separado de Pista y Menú.
- **Montañas y árboles:** nieve y vegetación de fondo más suaves, menos contraste; se conservan posiciones estables y anclaje al terreno.
- **Plataformas nevadas:** grosor, borde iluminado, soportes, vigas e hielo inferior, para separarlas del decorado.
- **Suelo:** capas de nieve, hielo y piedra diferenciadas y bordes claros para detectar las superficies jugables.
- **Aurora:** puertas, consola de variables, relés, puente, panel día/noche y señalización con sombras de contacto. Fachadas con iluminación direccional y cristales retranqueados.
- **Metro, Archivo de Ecos y azoteas:** cajas, lectores y superficies con planos laterales, sombras y materiales distinguibles.
- Se mantienen la campaña, los desafíos, NIX, la cinemática, los controles personalizables, el editor y los guardados anteriores.

## Verificaciones
- **120 pruebas unitarias aprobadas**.
- Prueba completa del capítulo nevado en Chromium: orbes, NIX, taller, impulso, cristales, programación del faro y final.
- Prueba móvil horizontal: contador de historia y panel de NIX sin desplazamiento de botones.
- **10 escenarios** inspeccionados visualmente en Chromium, sin errores de JavaScript.

## Pendientes de revisión
- Comprobar contraste y legibilidad en Safari físico del iPhone y rendimiento en 60/120 FPS.
- Continuar refinando escenas conforme aparezcan nuevas capturas y evaluaciones de jugadores.
- Esta actualización no sustituye los sprites o escenarios por arte 3D: mantiene el pixel art 2D con profundidad ilustrada y orden de capas.

[Pruebas para iPhone](QUE-PROBAR-v0.4.6.md) · [Reglas visuales](GUIA-ARTE-Y-PROFUNDIDAD.md)
