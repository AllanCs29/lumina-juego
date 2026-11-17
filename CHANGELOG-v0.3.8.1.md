# Lúmina v0.3.8.1 — pulido móvil

## Implementado
- Autoatenuación de joystick y botones cuando ocultan a Iris (sin perder interactividad).
- Postes y cables recolocados en callejones reales; dibujados detrás del personaje.
- Resolución de Canvas configurable: Retro (hasta 1×), Equilibrada (hasta 2×), Nítida (hasta 3×).
- 60 FPS como límite por defecto; hasta 120 cuando el navegador demuestre soporte mediante requestAnimationFrame.
- Controles de configuración de nitidez y FPS en Menú → Ajustes.
- Pistas adaptadas al dispositivo: «Toca USAR» / «Toca IMPULSO» en móvil; «E» / «SHIFT» en PC.

## Verificaciones
- 67 pruebas unitarias aprobadas.
- Recorrido automatizado del capítulo del faro completado.
- Puzle urbano y colisión de puerta verificados.
- 10 inicios táctiles en tamaños horizontales emulados.
- Calidad 2× / 3× y autoatenuación reproducidas en Chromium.
- Sin errores JavaScript en esas pruebas.

## Pendiente de validar en iPhone
- Lectura visual de Iris debajo de los controles, especialmente al caminar.
- Nitidez y consumo energético en modo Nítida.
- 120 FPS solo si Safari ofrece rAF de alta frecuencia; no basta con pantalla ProMotion.
- Persistencia de ajustes tras volver a abrir Safari.
- Actualización efectiva de GitHub Pages (puede quedar una versión anterior en caché).

## Pruebas para el jugador
1. Camina detrás del joystick y observa su atenuación.
2. Prueba SALTAR/USAR durante la atenuación.
3. Recorre el distrito de día y noche y verifica que los postes no atraviesen fachadas.
4. Abre Menú → Ajustes y alterna Equilibrada/Nítida.
5. Comprueba «FPS efectivos» y si aparece 120.
6. Acércate a una consola; verifica «Toca USAR», nunca «E» en móvil.

## Próximas tareas
- Ajustes finos del HUD según pruebas en Safari físico.
- Nuevas interacciones urbanas y variables reales en los puzles.
