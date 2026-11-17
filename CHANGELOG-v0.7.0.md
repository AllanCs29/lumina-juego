# Lúmina v0.7.0 — La primera señal de NIX

**Primer hito implementado del plan profesional de producción** · 17 de noviembre de 2026.

## Objetivo
Probar en una *vertical slice* el ciclo: **encontrar problema en el escenario → construir pseudocódigo → verificarlo con dos entradas → ver consecuencia física → guardar avance**. La mejora concreta se aplica al refugio del Taller de NIX. El resto de retos se conserva.

## Hecho y visible

### Misión 4: variable que se adapta
- **Antes:** fijar `carga ← 2`, sumar 3 y mostrar 5 era suficiente para superar el reto.
- **Ahora:** la máquina evalúa **el mismo programa** en dos contextos: entrada 2 → meta 5 y entrada 4 → meta 7. Un programa que fija un número puede acertar el primer escenario, pero **no aprobar ambos**.
- Nuevo bloque: `carga ← LEER carga del entorno`. El programa **LEER → SUMAR 3 → MOSTRAR** se adapta a entradas diferentes.
- El feedback muestra qué salida produjo cada contexto, si pasó y la traza paso a paso; ante error indica por qué fijar un valor no es equivalente a leer la entrada.
- La misión solo se añade a `labCompleted` después de pasar **las dos** pruebas. No se ejecuta código del usuario arbitrario; se conserva el intérprete limitado a instrucciones permitidas.
- En la traducción opcional posterior a Python, C++ o JavaScript se muestra cómo leer una entrada real, en lugar de usar una variable `entrada` sin declararla.

### Refugio físico en el Taller de NIX
- Objeto dibujado en la posición x≈631; persiana de metal, cimientos, sombras, nieve y estado frío si no tiene electricidad.
- Después del doble acierto, el refugio pasa a tonos cálidos, la persiana queda visualmente abierta, se emite luz y aparecen pequeños efectos de calor cuando movimiento reducido está desactivado.
- Se añade una interacción `USAR / E` para inspeccionarlo: antes de resolverlo, NIX explica el problema; después, relata por qué el programa funciona con valores diferentes.
- Un botón **Volver al mundo y ver el refugio encendido** facilita regresar sin perder el estado de la partida.
- La misión es **opcional**: no bloquea el camino principal ni obliga a completar el LAB para continuar a la pasarela y al faro.

### Guardado compatible
- Se añade `refugePowered: boolean` al esquema de partida existente y a su saneamiento, manteniendo los datos anteriores y la clave `localStorage`.
- Partidas antiguas con la misión 4 completada **no reciben automáticamente** el nuevo premio físico: deben repetir el desafío actualizado una vez. Sus misiones ya completadas permanecen guardadas.
- El calefactor continúa encendido tras salir al menú, navegar por otras regiones y recargar (también se prueba la recarga sin conexión en Chrome).

### Lectura y pantalla táctil
- En el Laboratorio, texto de objetivo, explicación y retroalimentación con tamaño base de 14 px, escalable.
- En la paleta, botones de instrucciones y botones de edición / ejecución se impone un mínimo de 44 px de alto en las reglas nuevas.
- Nueva preferencia **Configuración → Tamaño de lectura**: Normal (100%), Grande (115%), Muy grande (130%); almacenada localmente.
- El panel del LAB conserva desplazamiento interno en teléfonos horizontales pequeños, sin ampliar el lienzo de juego ni cambiar sus colisiones.

### Pruebas
- Nueva `tests/v070-refugio-smoke.mjs`: programa generalizable con 2, 4 y otras entradas; fracaso de respuesta fija; guardado y migración; traducción a tres lenguajes.
- Se amplía la prueba de navegador `tests/v060-browser-smoke.mjs` para pulsar bloques reales, demostrar el error del caso B, corregirlo, volver al mundo, inspeccionar el estado del refugio, revisar tamaño de toque/lectura y recarga offline.
- `verificar-lumina.yml` ejecuta ahora cuatro suites unitarias/regresión; `navegador.yml` mantiene Chrome real y capturas móviles.
- Se renovó el caché del service worker a `lumina-app-v070` para que el dispositivo obtenga la nueva versión cuando vuelva a estar conectado.

## Aún NO terminado

1. **LUM-001 completo:** se mejoró el panel LAB, pero existen otros textos de 9–10 px y botones pequeños fuera de él; falta auditar y ampliar todo el HUD móvil y menús.
2. **LUM-002 global:** la misión del refugio ya verifica transferencia, pero funciones, arreglos y booleanos siguen necesitando entradas diferentes y pruebas de casos positivos/negativos.
3. **LUM-003 final:** se agregó una consecuencia visual real en el mundo, pero la edición del programa aún se realiza en una ventana modal. Falta conectar la máquina con un editor integrado directamente al escenario.
4. **LUM-004:** el tutor conserva tres pantallas de explicación; falta sustituir buena parte de esa lectura obligatoria por demostraciones cortas e interactivas.
5. **LUM-005:** el refugio nuevo sigue reglas de volumen y contacto, pero falta una revisión visual de todas las regiones.
6. Pendientes anteriores: prueba física de iPhone Safari, más sprites redibujados cuadro a cuadro, nuevos jefes y campaña posterior al faro.

## Dirección
[Plan de producción](PLAN-DE-PRODUCCION-Y-CALIDAD.md) · [Biblia de diseño](BIBLIA-DE-DISENO-LUMINA.md) · [Qué probar](QUE-PROBAR-v0.7.0.md) · [Juego](https://allancs29.github.io/lumina-juego/)
