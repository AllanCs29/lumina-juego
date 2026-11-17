# Lúmina v0.4.0 — Señales del Norte

## Implementado
- Prólogo original de cuatro escenas animadas e ilustradas dentro del videojuego, con botones para avanzar u omitir.
- Cuaderno progresivo: Historia se desbloquea tras el prólogo; Lógica al encontrar la consola; Variables en la estación; NIX al llegar a él. Los otros temas aparecen bloqueados hasta descubrirse en la aventura.
- Campaña conectada: Distrito Aurora → Estación Umbral → Puerto de la Bruma → Taller de NIX → Pasarela Boreal → Faro del Silencio.
- **Dos mapas nuevos:** Estación Umbral, con dos relés y tren hacia las montañas; Azoteas de Aurora, ruta opcional con dos antenas y una señal misteriosa.
- Regreso desde el faro al metro, y posibilidad de visitar la ciudad de nuevo.
- Bitácora lateral contextual por región y progresos propios de cada zona.
- 120 FPS experimental disponible manualmente, con medición de fotogramas efectivos y opción de repetir la prueba; 60 FPS predeterminado. La física no se acelera.
- Guardado compatible con estados de las versiones anteriores.

## Validación
- **83 pruebas unitarias aprobadas** (77 anteriores + 6 nuevas).
- Prueba de navegador que completó: prólogo → Cuaderno → condición booleana → azoteas → variable carga → NIX → metro → puerto.
- Transición de final del faro de vuelta al metro verificada por separado.
- Introducción en móvil horizontal emulado sin errores de JavaScript detectados.
- Frecuencia real medida en Chromium de pruebas: alrededor de 60 FPS, aun con la opción experimental de 120 seleccionada.

## Limitaciones
- Falta verificar la experiencia en Safari de iPhone físico, incluyendo guardado, animación, sensibilidad de los controles, rendimiento y 120 FPS.
- Metro y azoteas son primeras iteraciones cortas, no capítulos completos.
- Aún faltan personajes secundarios, escenas cinemáticas más elaboradas, música, efectos y más ejercicios profundos con variables, bucles y funciones.
- Las pruebas de navegador usan posicionamiento controlado para recorrer algunos tramos; no equivalen a superar manualmente todas las plataformas.

[Guía de pruebas](QUE-PROBAR-v0.4.0.md)
