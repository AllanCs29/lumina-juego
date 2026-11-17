# Lúmina v0.6.0 — Expedición de NIX

## Objetivo de esta entrega
Convertir las lecciones opcionales en una progresión de programación jugable, con terminales integradas en las regiones, controles móviles, guardado real, un desenlace narrativo adicional y modo sin conexión instalable donde el navegador lo permita. Mantener intacto el juego previo.

## Implementado

### 1. Academia de programación — ocho misiones
- Misiones 1–3: funciones, arreglos y depuración mediante respuestas verificadas y pistas.
- Misiones 4–8: programación con un editor de bloques interactivo. Se agregan y reordenan instrucciones, se eliminan bloques, se guardan borradores y se ejecuta un intérprete cerrado que muestra cambios de estado.
- Temas: variables, suma, multiplicación, repetición (bucle), arreglo con índices, operaciones booleanas Y/O, condiciones y verificación del resultado.
- No se ejecuta JavaScript arbitrario. El intérprete tiene repertorio limitado y máximo de 14 bloques; el progreso no se entrega antes de acertar.
- Las misiones se pueden repetir al completarlas. El botón Siguiente requiere resolver la actual.
- La graduación (8/8) activa una memoria adicional al consultar el Archivo de Ecos y una variante del final del faro.

### 2. Misiones en el propio mundo
- Terminales LAB accesibles mediante **USAR / E** desde Distrito Aurora, Estación Umbral, Archivo de Ecos, Puerto de la Bruma, Taller de NIX y Faro del Silencio.
- Indicador de misiones completadas dibujado directamente en cada terminal; se puede salir y seguir caminando sin volver al menú.
- Menú principal con acceso directo y progreso visible.

### 3. Arte y jugabilidad
- Se preservaron los pinos esculpidos, el faro con relieve, las cajas volumétricas y los pisos texturizados de v0.4.8.
- Iris añade detalles de pixel art en ocho estados/fotogramas de movimiento sobre el atlas y animaciones de bufanda, salto, carrera, caída, impulso y aterrizaje. Las hitboxes no cambian.
- NIX y el Centinela mantienen sus animaciones; el jefe cuenta con tres patrones, advertencias y checkpoint por ronda.
- Parallax invernal y nieve por planos de profundidad, con opciones de movimiento reducido.

### 4. Móvil, accesibilidad y rendimiento
- Panel de laboratorio adaptable a horizontal móvil, controles de pulsación suficientemente visibles y etiquetas accesibles para subir, bajar y eliminar cada bloque.
- Preferencia de **reducir movimiento**: limita partículas, niebla animada y destellos sin cambiar la lógica ni los controles.
- **Calidad automática opcional**: reduce la densidad gráfica tras varios intervalos de FPS deficientes. No promete forzar 120 FPS si el navegador no los entrega.
- Sonido ambiental original opcional y vibración únicamente donde la API esté disponible, conservados de v0.5.0.

### 5. Instalación sin conexión
- `manifest.webmanifest`, `icon.svg` y `sw.js` agregados.
- El service worker guarda los archivos esenciales tras una apertura en línea. Navegación sin conexión comprobada con Chrome automatizado, incluida persistencia de las misiones resueltas.
- La página sigue siendo autónoma (`index.html` con código y recursos de juego incorporados); no requiere servidor externo para jugar después de cargar el shell.
- Limitación: no se ha validado el comportamiento real de instalación, almacenamiento o ciclo de vida de una PWA en iOS Safari.

## Compatibilidad de partidas
Se mantuvo la clave de almacenamiento anterior. Se amplía el esquema `version:1` con `labCompleted` (8 misiones), `labDrafts` saneados a un máximo de 14 bloques por reto, `labMastered` y `labEpilogueSeen`. Los datos previos de escenas, logros, orbes, fragmentos, checkpoints y puzzles se conservan. La migración conserva las tres misiones originales si ya estaban completadas.

## Pruebas automáticas
- `node tests/v048-art-smoke.mjs`: sintaxis y dibujo de arte y texturas.
- `node tests/v050-progress-smoke.mjs`: guardado legado, respuestas y tres fases del Centinela.
- `node tests/v060-missions-smoke.mjs`: ocho misiones, intérprete y fallos esperados, guardado y manifiesto.
- `node tests/v060-browser-smoke.mjs`: Chromium real sin dependencias de npm; interfaz, botones de bloques, escenario, móvil horizontal, recarga offline, persistencia y capturas.
- CI por GitHub Actions: `verificar-lumina.yml` y `navegador.yml`.

Estas pruebas **no equivalen** a una prueba física en Safari/iPhone, ni garantizan fluidez en todos los dispositivos.

## Pendiente / evolución futura
- Probar y ajustar visualmente el juego en Safari físico (controles, multitouch, audio, modo horizontal, PWA, duración de batería y FPS).
- Redibujar sprites completos de Iris, NIX y enemigos para más cuadros genuinamente diferentes en lugar de depender del atlas base con detalles superpuestos.
- Integrar aún más las misiones de programación a la ruta principal y a mecanismos de mundo físico. Las 8 misiones actuales se ejecutan en terminales integradas, pero siguen siendo optativas.
- Ampliar historia posterior al Faro del Silencio: nuevas islas, jefes, cinemáticas, más herramientas y desafíos de programación abiertos.
- Generar iconos raster PNG específicos para instalación en iOS y evaluar funcionamiento offline en cada navegador.
- Hacer una revisión artística de cada escena, sobre todo profundidad, iluminación, lectura de plataformas y accesibilidad.

## Accesos
- Juego: https://allancs29.github.io/lumina-juego/
- Código ZIP: https://github.com/AllanCs29/lumina-juego/archive/refs/heads/main.zip
- Pruebas: [QUE-PROBAR-v0.6.0.md](QUE-PROBAR-v0.6.0.md)
