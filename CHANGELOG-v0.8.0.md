# Lúmina v0.8.0 — Evaluación con distintos estados del entorno

## Cambios implementados
- Cinco retos de programación (misiones 4 a 8) se evalúan con dos escenarios por solución. El mismo programa debe superar ambos antes de marcarse como aprendido.
- Misión 4: refugio, cargas 2→5 y 4→7. Mantiene el efecto físico y el guardado ya existentes.
- Misión 5: bucles que suman 6 a cargas iniciales 0 y 4; se puede usar LEER carga del entorno.
- Misión 6: arreglos de sensores [3,7,11] y [5,2,9]; los índices 0 y 1 siguen siendo la regla.
- Misión 7: el caso verdadero y el falso distinguen Y de O en los sensores de puerta.
- Misión 8: lectura de cargas 2 y 1; el resultado de (carga+3=5) debe ser verdadero y falso respectivamente.
- La interfaz muestra las dos entradas, los resultados, la meta y trazas por instrucción.
- El LAB ahora resume las habilidades aprendidas y el siguiente objetivo. En retos completados desde el mundo, permite volver directamente a la aventura y muestra una confirmación del avance. Mensajes de fallo específicos invitan a corregir.
- Se mantienen los guardados, desbloqueo del LAB, pseudocódigo inicial, traducciones de lenguajes, PWA e historia existente.
- Actualización de caché PWA y título de versión. Prueba nueva v080-transfer-smoke y ampliación del escenario Chrome E2E.

## Aspectos que NO están terminados
- La historia completa deliberadamente queda pendiente.
- Las consecuencias físicas de los retos 5 a 8 siguen siendo limitadas; el refugio es la integración más tangible.
- El modo Python/C++/JavaScript es vista de traducción, no ejecución real ni curso completo de sintaxis.
- No se ha validado manualmente Safari en iPhone físico ni realizado playtesting con principiantes.
- El motor sigue principalmente concentrado en index.html; falta modularización gradual.
- Los controles/HUD fuera del laboratorio necesitan revisión de accesibilidad en todos los tamaños móviles.

## Verificación
```sh
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
node tests/v060-missions-smoke.mjs
node tests/v070-refugio-smoke.mjs
node tests/v071-wayfinding-smoke.mjs
node tests/v080-transfer-smoke.mjs
node tests/v060-browser-smoke.mjs
```

Ver [Qué probar v0.8.0](QUE-PROBAR-v0.8.0.md) y [CI](https://github.com/AllanCs29/lumina-juego/actions). Un check automatizado no sustituye pruebas físicas y de comprensión.
