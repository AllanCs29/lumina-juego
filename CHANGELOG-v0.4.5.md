# Lúmina v0.4.5 — Claridad y control

## Correcciones
- Diálogos con contador independiente de páginas: 1/3, 2/3, 3/3, etc. La cinemática conserva su contador 1/4.
- Editor de NIX: altura estable de la lista de órdenes, scroll interno y botones de dirección, recoger y ejecutar siempre en su lugar.
- El modo horizontal móvil ya no desplaza el panel de acciones al agregar nuevos pasos.
- Parallax: teselas de montañas ancladas a coordenadas del mundo, sin variaciones de tamaño o altura al atravesar límites.
- Árboles de Pasarela Boreal colocados solamente donde hay suelo real, sin aparecer sobre pozos.
- Cajas de salto cálidas con volumen y sombra, distinguibles de los árboles de fondo.
- Se mantienen el capítulo del faro, NIX, los orbes y las misiones urbanas anteriores.

## Validación
- 109 pruebas unitarias aprobadas.
- Navegador móvil emulado: 4 órdenes consecutivas de NIX con botones sin movimiento vertical (253.8px → 253.8px).
- Diálogos 1/3, 2/3 y 3/3 verificados.
- Montañas comparadas antes y después de cruzar un límite de repetición: misma geometría.
- Árboles verificados dentro del terreno y alejados de las cajas.
- Regresiones: consola lógica y variables urbanas; faro completo con NIX, saltos, impulso, cristal y bucle.

## Pendiente
- Safari real del iPhone: reacción táctil, cámara, ahorro de batería y guardado.
- Opinión de jugadores sobre claridad del mapa nevado y NIX a distintos tamaños de pantalla.

[Pruebas recomendadas](QUE-PROBAR-v0.4.5.md)