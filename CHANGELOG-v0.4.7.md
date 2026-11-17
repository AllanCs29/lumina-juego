# Lúmina v0.4.7 — Academia de Iris y Centinela del Archivo

## Implementado
- Primera apertura: invitación **Aprender controles** o **Ahora no**, sin borrar el progreso existente.
- Tutorial jugable opcional con cuatro etapas: CAMINAR, SALTAR, IMPULSO y USAR. Se repite desde el menú. Usa los botones reales de PC/móvil, y al terminar devuelve a Iris a su partida.
- Jefe **Centinela del Archivo**: tres rondas de evaluación booleana (NO, Y, O); placas VERDADERO/FALSO en el escenario, ondas de energía que se pueden esquivar, feedback por respuesta y progreso 1/3–3/3.
- El encuentro se descubre en Archivo de Ecos después de recuperar las tres memorias; también está disponible desde **Menú → Capítulos y escenas de prueba**. Es opcional.
- Primer pase de pixel art más detallado: Iris algo más grande usando su atlas original; NIX con remaches y paneles; pinos y cajas con pequeños detalles; nuevos decorados de academia y arena con sombras, mecanismos y volumen.
- Se conservan mejoras anteriores: cámara móvil, controles personalizables, historia abreviada, cuaderno, puente, faro, NIX y archivos de guardado. Modo Nítida hasta 3× disponible.

## Validación
- **127 pruebas unitarias aprobadas**.
- Tutorial y Centinela completos probados en Chromium de escritorio y móvil horizontal, sin errores JavaScript.
- Regresión de capítulo del faro: orbes, NIX, impulso, cristal y bucle final.
- Regresión de Aurora: puerta lógica, energía, día/noche y controles táctiles.
- Límite: no equivale a validación en Safari de iPhone físico; FPS efectivos y guardado real requieren comprobarse allí.

## Pendientes
- Más animaciones por fotogramas, detalle de sprites y acabado artístico en todos los escenarios.
- Jefes con varios patrones, checkpoints y dificultad ajustable después de probar al Centinela.
- Música ambiental original, feedback háptico opcional, más misiones con funciones, arreglos y depuración.
- Equilibrar tutorial/jefe según la experiencia de jugadores que no saben programar.

[Qué probar](QUE-PROBAR-v0.4.7.md)