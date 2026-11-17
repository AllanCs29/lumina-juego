# Lúmina v0.4.8 — Arte con volumen, no pegatinas

## Implementado
- **Pinos reconstruidos** en tres niveles de ramas escalonadas, silueta irregular, caras de luz/sombra, tronco, raíces y nieve depositada. Paletas y densidad distintas en planos de fondo y plano medio. Siguen detrás de la superficie jugable; no cambian las colisiones.
- **Faro mejorado** con textura de mampostería, ventanas hundidas, detalle en cimientos y una linterna reforzada con montantes y marcos.
- **Suelo y repisas** con vetas de roca, microtexturas, tornillería y estratos; las sombras y bordes siguen indicando superficies transitables.
- **Cajas de carga** con cara lateral, refuerzos, remaches y marca pintada sobre el propio objeto. La marca ya no flota sobre el escenario.
- **Detalles transversales** en fachadas del Distrito Aurora, taller, Academia de Iris y armadura del Centinela.
- **Microtexturas deterministas y con descarte fuera de cámara**: no cambian entre fotogramas y disminuyen en modo Retro. El modo Nítida agrega detalle del material real además de aumentar densidad de rasterizado.
- No se alteraron los puzles, checkpoints, tutorial, jefes, lógica de guardado, hitboxes ni movimiento.

## Verificación realizada
- Sintaxis de los 23 bloques JavaScript comprobada.
- Pruebas de renderizado de métodos de pinos cercanos/lejanos, suelo, repisas, cajas, faro y Centinela con contexto Canvas simulado.
- Las texturas dieron idéntica salida al repetirse; hubo 0 operaciones de textura en zona fuera de cámara. En una región de muestra, modo Retro: 32 operaciones y Nítida: 178.
- Prueba automatizada reproducible en `tests/v048-art-smoke.mjs`, ejecutable con `node tests/v048-art-smoke.mjs`. Workflow GitHub Actions: `.github/workflows/verificar-lumina.yml`.
- **Límite**: estos son tests de sintaxis y de llamadas al Canvas simulado. No sustituyen una revisión visual real, FPS, accesibilidad o una prueba en Safari/iPhone. No se repitió aquí la suite histórica de 127 tests del ZIP anterior.

## Pendiente
- Validar el resultado en Safari iPhone y PC, comparar capturas en los mismos puntos de cada escena y ajustar contraste donde aún parezca plano.
- Dibujar más cuadros de animación en Iris/NIX, golpes y reacción ambiental.
- Profundizar parallax y efectos luminosos sin ocultar plataformas.
- Añadir patrones de jefe, checkpoints más completos y nuevas lecciones de programación.

[Guía de revisión](QUE-PROBAR-v0.4.8.md) · [Dirección de arte](GUIA-ARTE-Y-PROFUNDIDAD.md)
