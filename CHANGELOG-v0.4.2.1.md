# Lúmina v0.4.2.1 — Doble toque sin zoom

## Corrección
- El escenario, el canvas y todos los controles táctiles usan `touch-action: none` únicamente durante el modo móvil.
- Protección complementaria contra `dblclick` y `gesturestart` nativos dentro del escenario.
- Los gestos en menús o fuera del juego no se bloquean globalmente; no se usa `user-scalable=no`.
- Los botones SALTAR/USAR y el joystick conservan su lógica basada en `pointerdown`.

## Validación
- 94 pruebas unitarias aprobadas.
- En Chromium móvil emulado, dos toques sucesivos mantuvieron `visualViewport.scale` en 1.
- No se registraron errores JavaScript durante la prueba.
- **Pendiente:** confirmar en Safari del iPhone físico.

## Qué probar
1. Doble toque rápido en SALTAR y USAR.
2. Doble toque en una zona vacía del escenario.
3. Verificar que la pantalla no se amplíe y que los controles respondan.
