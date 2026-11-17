# Lúmina v0.4.3 — La señal comienza

## Implementado
- Cinemática original de seis escenas ilustradas y animadas (apagón, transmisión, Iris, NIX, viaje al norte, primera misión). Se muestra una vez incluso en partidas anteriores; al comenzar partida nueva se repite. Botón visible «Ver cinemática» para reproducirla cuando quieras sin borrar el avance.
- Acceso Z02 con profundidad física: vestibulo, pilares, corredor, persianas corredizas, cimentación, indicadores y rechazo rojo/verde. Sigue bloqueando el paso hasta completar la condición.
- Central eléctrica y control día/noche rediseñados como módulos industriales con laterales, bases y conexiones.
- Consola de variable `carga` sobre pedestal y puente con actuadores y letrero anclado. Consta de seis segmentos, colisión al terminar de desplegarse.
- Eliminados carteles que atravesaban la calle; fragmento flotante junto a la consola trasladado a la repisa para no taparla.
- NIX con volumen, sombra, patas móviles, parpadeo y ZZZ animadas.
- Indicaciones «Toca USAR» compactas arriba y sin duplicarse con mensajes temporales; arreglado un conflicto de CSS que expandía el aviso hasta media pantalla.
- Se conservan los capítulos anteriores, Cuaderno progresivo, guardado y controles móviles personalizables.

## Validación
- **101/101 pruebas unitarias aprobadas**.
- Playwright en móvil horizontal emulado: cinemática desde partida antigua, nueva partida, reproducción desde menú; sin errores JavaScript.
- Regresión móvil del puente desplegable, puerta, Archivo de Ecos, diálogo superior y menú; aprobada.
- Capítulo del faro: orbes, taller, programación de NIX, impulso, cristal, bucle y final completados en navegador automatizado.

## Pendiente
- Prueba manual en Safari físico: sonido, FPS efectivos, controles y guardado después de cerrar/reabrir el navegador.
- Arte final de los personajes, sprites de animación más elaborados, banda sonora y retos de programación adicionales.
- El nuevo prólogo es una cinemática animada con Canvas, no video prerenderizado ni doblaje.

Consulta [las pruebas de iPhone](QUE-PROBAR-v0.4.3.md).