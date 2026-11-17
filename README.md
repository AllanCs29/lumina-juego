# Lúmina — Señales del Norte

**Versión 0.5.0 · Movimiento, laboratorio y Centinela por fases**

[**Jugar desde iPhone o PC**](https://allancs29.github.io/lumina-juego/)

Videojuego 2D para aprender programación desde cero mediante exploración, acertijos, plataformas y narrativa. Escenarios conectados: Distrito Aurora, Estación Umbral, Archivo de Ecos, Puerto de la Bruma, Pasarela Boreal y Faro del Silencio.

## Nuevo en v0.5.0
- **Laboratorio de lógica:** tres retos interactivos de funciones, arreglos y depuración desde el menú, con pistas, ejecución paso a paso y avance guardado.
- **Centinela evolucionado:** tres tipos de ataque con avisos, checkpoints por ronda y reinicio opcional del encuentro.
- **Animaciones más expresivas:** Iris reacciona a salto, carrera, impulso y aterrizaje; NIX y el Centinela tienen nuevos detalles de movimiento.
- **Escenarios más vivos:** nieve por profundidad, parallax de niebla en los paisajes nevados, sin modificar el motor de colisiones.
- **Ambiente original opcional:** audio generado por el juego en Web Audio, sin descargas de música, y vibración si el navegador lo admite.
- **Mantiene v0.4.8:** pinos esculpidos, faro detallado, cajas volumétricas, microtexturas y calidad Nítida 3×.
- **Pruebas de regresión:** `node tests/v048-art-smoke.mjs` y `node tests/v050-progress-smoke.mjs`.

## Se conserva de v0.4.7
- **Academia de Iris:** tutorial jugable opcional que aparece en la primera apertura y se repite desde el menú. Practica caminar, saltar, impulsar y usar una máquina.
- **Primer jefe:** Centinela del Archivo, un encuentro opcional en tres rondas que utiliza condiciones booleanas, esquivar ondas y seleccionar VERDADERO/FALSO.
- **Arte:** detalles adicionales en Iris, NIX, pinos, cajas y nuevos escenarios con sombras y volumen. El modo de calidad Nítida permite hasta 3× de densidad de renderizado.
- Compatibilidad con partidas anteriores y con el resto de misiones.

## Controles
PC: A/D o flechas, Espacio, Shift, E. En móvil: joystick, SALTAR, IMPULSO, USAR, con tamaño y posición configurables.

## Archivos
`index.html` es el juego autónomo en GitHub Pages. Incluye todos los módulos del juego dentro de un único HTML; `tests/v048-art-smoke.mjs` y `tests/v050-progress-smoke.mjs` permiten validar esta versión sin dependencias. Los archivos modulares del ZIP anterior no forman parte de este repositorio.

[Registro de cambios v0.5.0](CHANGELOG-v0.5.0.md) · [Guía de pruebas v0.5.0](QUE-PROBAR-v0.5.0.md) · [Descargar código ZIP](https://github.com/AllanCs29/lumina-juego/archive/refs/heads/main.zip)

**Verificado en v0.5.0:** sintaxis de los 23 bloques JavaScript y pruebas automatizadas de arte, evaluación educativa, compatibilidad de guardado y Centinela, ejecutadas en GitHub Actions. **Histórico v0.4.7:** 127 pruebas y escenarios en Chromium. **Pendiente de validar:** experiencia visual, audio, FPS y funcionamiento en Safari de iPhone real.