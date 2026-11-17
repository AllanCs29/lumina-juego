# Qué probar — Lúmina v0.7.0

## Prueba A · Misión de refugio, comprender la variable

1. Abre [Lúmina](https://allancs29.github.io/lumina-juego/) y continúa tu partida. Si acabas de comenzar, progresa por Aurora y despierta a NIX para descubrir el LAB en su Taller.
2. Ve al **Taller de NIX**. A la izquierda de la terminal LAB (cerca de x=631), observa la **persiana gris del refugio**. Acércate y usa E / USAR: NIX explica por qué el calefactor recibe diferentes valores.
3. Entra al LAB y llega a **Misión 4 · Calentar el refugio**. Completa las tres explicaciones si todavía no la habías superado.
4. Agrega, en este orden: **carga ← 2**, **carga ← carga + 3**, **MOSTRAR resultado**. Pulsa **Ejecutar**.
5. **Resultado esperado:** Prueba A entrada 2 → salida 5 **✓**; Prueba B entrada 4 → salida 5 **✕**. La máquina no debe encenderse todavía y la misión 4 no debe considerarse completada por este intento.
6. Borra el borrador, ahora usa **LEER carga del entorno → SUMAR 3 → MOSTRAR resultado**, y ejecuta.
7. **Resultado esperado:** Prueba A 2 → 5 **✓** y Prueba B 4 → 7 **✓**. Debe aparecer un mensaje de dominio y, si estabas en el Taller, el botón **Volver al mundo y ver el refugio encendido**.
8. Pulsa regresar y comprueba que la persiana aparece abierta, la luz es cálida y la nieve alrededor muestra el cambio. Inspecciona con E / USAR: Iris y NIX explican qué hace el programa.
9. Vuelve al menú, luego a la misma escena o reinicia la página sin borrar datos: el calefactor debe seguir encendido.
10. Repite la misión 4 si quieres; no debe borrar la recompensa, las otras misiones ni sus borradores.

**Partidas de v0.6.1 con misión 4 terminada:** conservan el avance del curso, pero deben repetir el reto nuevo para encender el calefactor. Esto evita conceder una prueba de dominio que no existía antes.

## Prueba B · Legibilidad en iPhone

1. Abre el LAB con el teléfono en horizontal y observa las tarjetas de explicación, estado, trazas y bloques.
2. Desde Menú → Configuración cambia **Tamaño de lectura: 100% → 115% → 130%**. Debes notar el cambio en el texto del laboratorio.
3. Comprueba que los botones para añadir, subir, bajar y quitar instrucciones son suficientemente grandes para tocarlos sin errores frecuentes.
4. Comprueba que el panel se pueda desplazar verticalmente sin cortar el botón Ejecutar ni el botón para regresar al mundo.
5. Sal y vuelve: el tamaño elegido debe conservarse.

## Prueba C · Regresiones

- La capa de Iris debe seguir quedando detrás del movimiento al girar en ambas direcciones.
- Los retos de programación siguen bloqueados al principio y se descubren en Taller de NIX tras resolver los prerrequisitos de la historia.
- Los retos 1–3 mantienen pseudocódigo, las explicaciones y la elección posterior del lenguaje.
- El Centinela conserva ataques y checkpoints; los orbes y las puertas originales funcionan sin cambios.
- iPhone Safari físico: confirmar carga, guardado, uso táctil, audio, orientación y regreso tras modo avión. Las pruebas automáticas de Chrome NO sustituyen a Safari.

## Verificar con Node
```sh
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
node tests/v060-missions-smoke.mjs
node tests/v070-refugio-smoke.mjs
node tests/v060-browser-smoke.mjs    # requiere Google Chrome/Chromium
```
También puedes consultar la pestaña [GitHub Actions](https://github.com/AllanCs29/lumina-juego/actions) y descargar sus capturas del navegador.

**Qué reportar con captura:** dispositivo, navegador, misión, entrada utilizada, bloque que falla, qué muestra la traza, y si el refugio cambió de apariencia. Si no está clara la diferencia entre «leer entrada» y «asignar número fijo», hay que mejorar el ejemplo pedagógico.

[Changelog completo](CHANGELOG-v0.7.0.md) · [Auditoría](AUDITORIA-PROFESIONAL-v0.6.1.md)
