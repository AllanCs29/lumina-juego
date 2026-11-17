# Lúmina v0.7.1 — Flechas suaves y orientación contextual

## Qué se implementó
- **Orientación ligera cerca de Iris:** una pequeña flecha semitransparente indica izquierda/derecha hacia el siguiente objetivo real. Está dibujada dentro del mismo Canvas y acompaña a la cámara, sin crear un menú flotante que tape la escena.
- **Destino dinámico:** se recalcula según escena y estado de la partida, sin guardar coordenadas anticuadas. Distrito Aurora (consola de sensores, energía, variables, NIX, metro); metro (relé sin activar más cercano, tren); azoteas (antenas, salida); Archivo (lectores pendientes, Centinela, salida); puerto (orbe azul, taller, arco); taller (orbe violeta, banco, descubrimiento opcional del LAB, salida); pasarela (orbe de salto, balizas, impulso, barrera, faro); faro (consola y lente).
- **No molesta al interactuar:** la flecha desaparece si el jugador está a menos de 64 unidades horizontales del objetivo y permite que el prompt USAR/E tome el protagonismo. Tampoco aparece al hablar, en menús, durante las transiciones ni al practicar controles o combatir al Centinela.
- **Tres modos en Configuración → Orientación suave:** «Flechas discretas» (predeterminado), «Solo cuando pulso Pista» (la muestra 8 segundos junto con una etiqueta breve) o «Sin flechas». La preferencia se conserva en `localStorage` con la clave `lumina-guidance-mode-v1`. Respeta «Reducir movimiento» evitando la animación pulsante.
- **No cambia la dificultad ni el progreso:** las flechas orientan hacia un objetivo, no se mueven solas ni revelan automáticamente cómo resolver problemas; las rutas opcionales siguen siendo opcionales. El tutorial de controles y el jefe conservan su propia señalización.

## Verificación automatizada
- `tests/v071-wayfinding-smoke.mjs`: todas las regiones, objetivos prioritarios, punto pendiente más próximo, cambio de sentido, supresión al acercarse y opciones.
- `tests/v060-browser-smoke.mjs`: Chrome real: ambos sentidos, detección de dibujo del chevrón, apagado, modo solo Pista, botón Pista y preferencia persistente tras recargar sin conexión.
- El workflow de regresiones integra la nueva prueba.
- Se renovó el nombre de caché de PWA a `lumina-app-v071` para recibir la interfaz actualizada.

## Qué mejorar después
- La flecha proporciona orientación **horizontal** hacia un punto; no calcula rutas inteligentes ni pasos para saltos y plataformas de distinta altura. Evita afirmar que es un GPS.
- Validar visualmente tamaño, opacidad y superposición con controles en Safari de iPhone físico. Es posible ajustar el brillo a partir de capturas.
- Incorporar pistas espaciales suaves cuando el objetivo esté muy por encima/abajo y contrastar con usuarios que no conocen el mapa.
- Seguir con la arquitectura modular, legibilidad del HUD, problemas de aprendizaje con datos variables y ampliación de la historia.

## Accesos
[Qué probar](QUE-PROBAR-v0.7.1.md) · [Jugar Lúmina](https://allancs29.github.io/lumina-juego/) · [Plan profesional](PLAN-DE-PRODUCCION-Y-CALIDAD.md)
