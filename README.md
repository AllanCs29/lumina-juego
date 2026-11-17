# Lúmina — Distrito Aurora

**Versión actual: v0.3.8 (Mobile First).**

Juego de plataformas y lógica protagonizado por Iris, una exploradora informática. Ciudad nocturna, puzles de puertas y el capítulo anterior de NIX y el faro.

## 🎮 Jugar desde iPhone y PC

**https://allancs29.github.io/lumina-juego/**

- **iPhone:** abre el enlace en Safari, gira a horizontal y pulsa «Nueva expedición».
- **Controles móviles:** joystick, Saltar, Usar e Impulso cuando esté disponible.
- **Personalización:** Menú → ⚙ Ajustes de juego y controles → ✥ Personalizar controles táctiles. Arrastra los botones, selecciona uno y cambia su tamaño con el deslizador. Pulsa «Listo».
- **Velocidad:** Menú → Ajustes → Velocidad de movimiento en móvil (60–110 %, de fábrica 78 %). También encontrarás el control de sonido.
- **PC:** A/D o flechas para moverte; Espacio para saltar; Shift para impulso; E para interactuar.

## Cambios en v0.3.8

- Escenario horizontal adaptable sin deformar personajes ni dejar barras laterales.
- Botones Pista y Menú dentro del área de juego.
- Título Distrito Aurora temporal al entrar, con fundido después de ~2 segundos.
- Tamaño/posición individuales de botones táctiles, guardados localmente.
- Movimiento táctil suavizado y velocidad configurable.
- Menú móvil compacto con ajustes plegables.
- Se conservan las misiones anteriores de NIX, puertas lógicas y faro.

## Validación y pendientes

- 63 pruebas unitarias aprobadas.
- Pruebas de navegador en Chromium móvil emulado (844×390, 740×360, 390×844) y PC.
- Puzle urbano, consola NIX y recorrido del faro comprobados con pruebas automatizadas.
- **Pendiente:** prueba manual de la comodidad, rendimiento y persistencia de controles en Safari de un iPhone físico.

El código completo modular y los tests están disponibles en el ZIP v0.3.8 entregado en el chat.

## Desarrollo

El archivo `index.html` es una versión autocontenida del juego. Los commits de la rama `main` se utilizan para publicar GitHub Pages.
