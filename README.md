# LÚMINA — Señales del Norte

**v0.4.3 · La señal comienza**. Videojuego de aventura y aprendizaje de programación desde cero para Safari (iPhone horizontal) y PC.

## Jugar
https://allancs29.github.io/lumina-juego/

## Novedades
- Cinemática original de seis escenas al iniciar esta versión por primera vez, incluida la continuidad de partidas antiguas. Nueva partida la reproduce de nuevo; botón del menú permite revisarla.
- Puerta Z02, central, control día/noche, consola de variables y puente mecánico rediseñados para tener volumen, profundidad y función.
- NIX animado, fragmentos flotantes, prompts compactos y cámara móvil segura.
- Mapas conectados: Aurora → Estación Umbral → Puerto de la Bruma → Faro, con Azoteas y Archivo de Ecos opcionales.
- Aprendizaje: lógica Y/NO, variable `carga`, secuencias y bucles; Cuaderno progresivo.

## Desarrollo
El archivo `index.html` de este repositorio es el HTML autónomo para GitHub Pages. El ZIP de código fuente incluye `src/`, `styles/`, `tests/` y `scripts/build.py`. Ejecuta `npm run verify` para probar y compilar.

[Registro de cambios](CHANGELOG-v0.4.3.md) · [Pruebas para iPhone](QUE-PROBAR-v0.4.3.md)

**Validación:** 101 tests unitarios, regresión móvil emulada y capítulo anterior del faro automatizado. Pendiente validar personalmente en Safari físico.