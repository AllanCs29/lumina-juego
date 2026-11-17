# Lúmina v0.3.9 — Distrito Aurora · aprender programación desde cero

## Cambios principales
- **Historia:** Iris, estudiante de informática, investiga un apagón. Sin energía, las puertas y el transporte urbano quedan bloqueados. El jugador conoce el motivo de cada misión; textos omitibles y consultables en el Cuaderno.
- **Cuaderno de programación:** lecciones cortas, analogías sencillas, código de ejemplo y revisión desde el menú.
- **Misión 1 — Lógica booleana:** consola gráfica de tres sensores: ENERGÍA, RED y ALARMA. Aprende VERDADERO/FALSO, los operadores Y/NO y la condición `energía Y red Y NO alarma`; explicación paso a paso y salida física de puerta.
- **Misión 2 — Variables:** estación de datos con variable numérica `carga`, que empieza en 1. Se programan instrucciones +1, +2, −1 y ×2, se ejecutan paso a paso o todas, se visualiza el valor, y se desbloquea el puente cuando `carga = 5`.
- **Misión 3 — NIX urbano:** mini-programa con movimientos y pulso para despertarlo; posteriormente acompaña a Iris.
- **Exploración:** ciudad extendida, nuevos edificios, pasarelas y tres fragmentos de memoria opcionales; transición noche/día al activar energía.
- **Mobile-first:** la cámara calcula una zona segura según posición y tamaño actual de joystick, SALTAR, USAR e IMPULSO; mantiene a Iris fuera de los botones al llegar a ambos límites del mundo. Ajustes de calidad y FPS anteriores conservados.
- **Compatibilidad:** migración de partidas anteriores y capítulo del faro disponible.

## Comprobaciones
- 77 pruebas unitarias aprobadas.
- Flujo urbano completo probado en Chromium de escritorio.
- Flujo de las consolas táctiles probado en móvil horizontal emulado.
- Cámara segura validada en diez posiciones desde un extremo del mapa al otro.
- Regresión automatizada del capítulo antiguo completada al repetir una ejecución que dio un timeout al recoger un orbe.

## Limitaciones y tareas pendientes
- El desempeño y la persistencia deben verificarse en Safari de iPhone físico.
- No se han integrado todavía arreglos, funciones y bucles complejos dentro de esta nueva misión urbana.
- Falta profundidad narrativa de NPC, sonido, animaciones y niveles urbanos adicionales.
- Ajustar dificultad, recompensas y precisión de algunos tutoriales según la evaluación del usuario.

## Para probar
Leer u omitir la introducción; revisar Cuaderno; intentar una condición incorrecta y otra correcta; encender la central; construir `+2, +2` para llegar de 1 a 5; ejecutar NIX (dos DERECHA y PULSO); recoger fragmentos; recorrer límites del mapa y recolocar controles; cerrar y reabrir Safari; verificar el capítulo nevado.
