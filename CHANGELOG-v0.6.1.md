# Lúmina v0.6.1 — Aprender antes de programar

## Lo que se corrigió
- **Capa y bufanda de Iris:** el complemento de pixel art había sido colocado en el lado delantero del personaje (coordenadas locales positivas). Al invertir dirección ese accesorio apuntaba hacia donde avanzaba. Ahora todas las partes dinámicas se colocan **detrás** de Iris en el eje local, y la inversión horizontal las mantiene a la espalda al correr izquierda/derecha. No se tocan colisiones ni físicas.
- **Laboratorio desbloqueado demasiado pronto:** en partidas nuevas el botón del menú está desactivado y las estaciones repartidas por el mapa permanecen ocultas. Solo aparece la primera estación en **Taller de NIX** cuando ya resolviste la variable del Distrito Aurora (`cityVariableSolved`) y reparaste/activaste a NIX (`robot`). Debes llegar a la terminal física y usar E / USAR para descubrir el laboratorio. NIX explica por qué empiezas por lógica y pseudocódigo.
- **Compatibilidad del guardado:** `labDiscovered` queda guardado. Una partida antigua con misiones de laboratorio completadas conserva el acceso y sus avances; ninguna otra escena ni checkpoint se resetea.

## Aprender lógica y pseudocódigo desde cero
- Los primeros tres desafíos ahora trabajan **instrucciones en orden**, **variables como cajitas** y **condiciones SI**. Se quitó la sintaxis de JavaScript de estas introducciones.
- Los ocho desafíos tienen una explicación específica de tres pasos: concepto, ejemplo y qué hacer en la práctica. Para un desafío nuevo debes recorrerla antes de ejecutar la respuesta. Siempre puedes regresar a «Volver a leer la explicación».
- La misión 4 enseña a construir una receta con bloques; después vienen bucles, arreglos, booleanos y depuración.
- En las consolas del mundo, tanto **la puerta Z02** como **la estación de variable carga**, se explican las operaciones en pseudocódigo. La estación de variables muestra qué es la «cajita carga» y permite recorrer los cambios paso a paso. Ver código es opcional, pero las explicaciones no dependen de abrirlo.

## Elección del lenguaje, cuando tenga sentido
- Al completar las primeras cuatro misiones se habilita **Ver las instrucciones en un lenguaje real**, dentro del Laboratorio.
- Puedes seleccionar **Pseudocódigo, Python, C++ o JavaScript**. La selección queda guardada.
- En misiones con bloques aparece una traducción de lo que construiste. Esta es una vista didáctica; el motor sigue ejecutando el intérprete seguro de bloques, no código Python/C++/JavaScript arbitrario.
- Ningún lenguaje se exige o presenta al comenzar la historia. Aprender una sintaxis concreta es una etapa posterior al dominio de las bases.

## Pruebas
- `tests/v048-art-smoke.mjs`: sintaxis y dibujo.
- `tests/v050-progress-smoke.mjs`: progreso anterior, checkpoints y trazas de pseudocódigo.
- `tests/v060-missions-smoke.mjs`: migración, desbloqueo en Taller de NIX, guías, intérprete, traducciones y guardado.
- `tests/v060-browser-smoke.mjs`: navegador Chrome real; comprueba bloqueo inicial, llegada al taller, tutorial obligatorio, ocho desafíos, lenguaje posterior, orientación correcta de la capa, panel móvil y PWA sin conexión.

## Limitaciones y próximas mejoras
- Sigue pendiente probar directamente Safari en un iPhone físico y ajustar las animaciones del personaje sobre ese dispositivo.
- La elección del lenguaje proporciona **traducción y una preferencia persistente**, no todavía un curso completo independiente de Python/C++/JavaScript ni un intérprete para cada uno.
- Falta ampliar el contenido después del faro, más jefes y ejercicios donde escribir programas de mayor complejidad sin bloques predefinidos.

[Qué revisar](QUE-PROBAR-v0.6.1.md) · [Jugar](https://allancs29.github.io/lumina-juego/)
