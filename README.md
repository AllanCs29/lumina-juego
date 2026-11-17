# Lúmina — Señales del Norte

**Versión 0.8.1 · Menú más simple, progresión contextual y auditoría integral**

[**Jugar desde iPhone, Mac o PC**](https://allancs29.github.io/lumina-juego/) · [**Descargar todo el código ZIP**](https://github.com/AllanCs29/lumina-juego/archive/refs/heads/main.zip)

Lúmina es una aventura 2D original para aprender lógica de programación desde cero mediante exploración, plataformas, misiones y narrativa. Iris y NIX recorren Distrito Aurora, Estación Umbral, Archivo de Ecos, Puerto de la Bruma, Pasarela Boreal y Faro del Silencio.

## Nuevo en v0.8.1 — Menú esencial y auditoría integral

- **Tres decisiones al abrir el juego:** Jugar/Continuar, Aprender controles y Opciones. La pantalla inicial ya no es una lista de tareas y menús técnicos.
- **Preferencias de uso frecuente en Opciones:** orientación, tamaño de lectura, sonido y reducción de movimiento; los controles táctiles, FPS, calidad, ambiente y vibración quedan bajo Ajustes avanzados.
- **Desbloqueo contextual:** Laboratorio y Cuaderno se muestran únicamente después de descubrirlos. Nueva partida solo aparece si existe un progreso iniciado. La cinemática se puede repetir después de haberla visto.
- **Menú de QA separado:** cambiar de escena y repetir pruebas de jefe se oculta en modo normal; para desarrolladores, agregar `?dev=1` a la URL permite mostrar las herramientas de prueba.
- **Accesibilidad y regresión:** el menú usa `details/summary` con teclado, foco visible, controles principales de al menos 44 px y verificación real en Chromium de la estructura y ajustes en pantalla móvil. La captura móvil queda como artefacto en GitHub Actions.
- **Auditoría de cuatro áreas:** enseñanza, aprendizaje autónomo, diseño/arte/UX e ingeniería con hallazgos P0/P1/P2 y criterios de aceptación. **Documento de análisis, no funcionalidades ya implementadas.**
- **Compatibilidad:** mismas partidas, mismas ocho misiones, mismo entorno offline; caché PWA renovada a v0.8.1.

[Auditoría integral v0.8.1](AUDITORIA-INTEGRAL-v0.8.1.md) · [Qué probar](QUE-PROBAR-v0.8.1.md) · [Registro de cambios](CHANGELOG-v0.8.1.md)

## Se conserva de v0.8.0

## Nuevo en v0.8.0
- **Cinco desafíos programables con doble evaluación:** refugio, bucles, sensores de arreglos, compuertas booleanas y depuración. Las misiones 5 a 8 comprueban dos estados diferentes del entorno y exigen una sola receta que funcione en ambos.
- **El bloque LEER carga se reutiliza:** ahora puede emplearse en bucles y depuración. Una receta con un valor inicial fijo puede resolver el caso A, pero no aprobar ambos.
- **Arreglos variables:** los sensores cambian de [3, 7, 11] a [5, 2, 9]. El jugador debe leer las posiciones indicadas, no memorizar una suma.
- **Condiciones auténticamente booleanas:** hay un caso que permite abrir y otro que debe bloquear el acceso. Usar O en lugar de Y puede producir una respuesta incorrecta.
- **Más claridad didáctica:** cada consigna explica los estados A/B y la ejecución muestra el valor obtenido, la meta y la traza.
- **Conserva el trabajo anterior:** código autónomo en HTML, bloque de aprendizaje, progreso previo, tutorial, modo offline, música y exploración de v0.7.1.
- **Pruebas nuevas:** `node tests/v080-transfer-smoke.mjs`, añadida a GitHub Actions; sigue siendo necesaria una prueba personal en iPhone Safari.

[Registro de cambios v0.8.0](CHANGELOG-v0.8.0.md) · [Qué probar en v0.8.0](QUE-PROBAR-v0.8.0.md)

## Se conserva de v0.7.1


- **Brújula visual discreta:** una pequeña flecha semitransparente cerca de Iris indica si el siguiente objetivo está a la izquierda o a la derecha. No es una ruta automática ni un indicador permanente que tape el escenario.
- **La flecha cambia cuando completas el objetivo:** Aurora (consola, nodo, variables, NIX, metro), Estación Umbral (relés no activados, tren), Archivo (lectores y jefe), Azoteas (antenas), Puerto (orbe/taller/arco), Taller de NIX (orbe/programación/LAB opcional/salida), Pasarela Boreal (orbes/checkpoints/cristal/faro) y Faro (terminal/lente).
- **Sin saturación visual:** desaparece a 64 unidades del destino y durante diálogos, menús, transiciones, tutorial de controles o jefe Centinela. Se mantiene más tenue con `Reducir movimiento`.
- **Tres ajustes persistentes:** `Configuración → Orientación suave → Flechas discretas / Solo cuando pulso Pista / Sin flechas`. El modo `Pista` muestra la dirección durante unos segundos y, si corresponde, una etiqueta breve del destino.
- **Móvil y PC:** se dibuja directamente en el lienzo siguiendo la posición y cámara de Iris, sin botones adicionales en pantalla ni cambios a físicas o guardados anteriores.
- **Pruebas:** `node tests/v071-wayfinding-smoke.mjs` valida todos los destinos y la supresión cerca del objetivo; los tests con Chrome comprueban dibujo en ambos sentidos, ajustes, pulsar Pista y persistencia offline.

[Qué probar en v0.7.1](QUE-PROBAR-v0.7.1.md) · [Cambios completos](CHANGELOG-v0.7.1.md)

## Se conserva de v0.7.0

- **Una misión que comprueba aprendizaje real.** En la cuarta misión del Laboratorio de NIX, el mismo programa debe resolver dos entradas distintas: **2 → 5** y **4 → 7**. Fijar `carga ← 2` no basta. El nuevo bloque **LEER carga del entorno** permite trabajar con valores que cambian.
- **Calefactor y refugio físicos en el Taller de NIX.** Antes del reto la persiana está cerrada, hay hielo y la luz es fría. Al superar los dos casos, se abre, emite luz cálida y puedes inspeccionarlo con **USAR / E** para escuchar una explicación de Iris y NIX. **El cambio se guarda entre partidas.**
- **Feedback paso a paso:** se muestra el valor inicial, la salida, la meta y la traza para ambas pruebas. En caso de error se explica por qué una receta que funcionó una vez puede fallar cuando cambia la entrada. El ejemplo del tutorial usa datos distintos de los de la evaluación y no muestra una solución ya escrita.
- **Mejoras de lectura móvil:** el panel de programación tiene texto didáctico más legible y objetivos táctiles de un mínimo de 44 px. En **Menú → Configuración → Tamaño de lectura** puedes elegir 100%, 115% o 130%, con preferencia guardada.
- **Pruebas de regresión ampliadas:** intérprete para distintas entradas, fallo honesto de soluciones fijas, guardado del refugio, traducciones de `LEER` a Python/C++/JavaScript y navegación móvil real en Chrome, incluido funcionamiento offline.
- **Compatibilidad:** guarda la partida anterior. Si una partida vieja ya tenía la misión 4 terminada, conserva el avance, pero el refugio pide superar **la nueva prueba de dominio** para encenderse.

[Registro detallado de v0.7.0](CHANGELOG-v0.7.0.md) · [Qué probar en el juego](QUE-PROBAR-v0.7.0.md)

## Se conserva de v0.6.1
- **Capa de Iris:** corrigió la dirección de la capa y bufanda al correr y saltar a izquierda/derecha, sin cambiar colisiones.
- **Retos por descubrimiento:** el laboratorio se desbloquea al encontrar la estación LAB en el **Taller de NIX**, después de completar la lógica/variable de Aurora y reparar a NIX. En una nueva partida está bloqueado en el menú y oculto fuera del taller. Se preserva acceso de partidas antiguas con misiones completadas.
- **Tutor de tres pasos para cada desafío:** primero explica con analogías, después muestra un ejemplo, finalmente deja practicar. En desafíos nuevos no puedes ejecutar hasta terminar la introducción.
- **Primero lógica, después sintaxis:** las primeras tres misiones enseñan secuencias, variables y condiciones usando pseudocódigo. Las consolas originales de Aurora también explican su programa con pseudocódigo y trazas, sin pedir leer JavaScript.
- **Lenguaje elegible más adelante:** al superar las primeras cuatro misiones puedes elegir Pseudocódigo, Python, C++ o JavaScript para **ver una traducción** del programa construido. Es una vista didáctica, no un entorno que ejecute esos lenguajes.
- **Más pruebas:** cobertura con navegador real de desbloqueo, enseñanzas, ambas direcciones de la capa, traducciones, consola de variables y recarga sin conexión.

## Se conserva de v0.6.0

- **Ocho misiones progresivas:** funciones, arreglos, depuración, variables, bucles, operaciones booleanas y condiciones. Las últimas cinco se resuelven **construyendo programas con bloques**; no se limitan a responder un número.
- **Editor didáctico:** agregar, ordenar, eliminar y ejecutar instrucciones. Muestra una traza del estado de las variables; los borradores y los logros se guardan.
- **Terminales LAB dentro del juego:** se puede entrar desde las seis regiones principales mediante USAR/E, además del acceso del menú.
- **Recompensa por graduación:** al superar 8/8 aparece una memoria adicional en Archivo de Ecos y se amplía el final en el faro.
- **Arte y animación:** nuevos detalles de pixel art ligados a ocho fotogramas/estados de Iris; bufanda, movimiento y estelas. Se conserva el volumen de árboles, faro, cajas, repisas, edificios y otros objetos.
- **Jefe mejorado:** tres patrones del Centinela, avisos de ataque, asistencia y checkpoints por ronda. Tutorial jugable de controles desde la primera apertura y el menú.
- **Rendimiento y accesibilidad:** ajuste automático opcional de nitidez cuando bajan los FPS, reducción de movimiento y destellos, audio original opcional y vibración si el navegador la admite.
- **PWA y offline:** manifiesto, icono y service worker. La recarga sin conexión con persistencia fue verificada en Chrome automatizado.

## Jugar y guardar progreso

El juego conserva la misma clave de guardado que v0.5.0, por lo que **Continuar** mantiene escenas, orbes, puzzles, memorias, progreso del jefe y misiones anteriores. Ahora se guardan también los borradores del laboratorio. No uses **Nueva partida** si quieres conservar tu avance actual.

En PC: **A/D o flechas** para moverse, **Espacio** para saltar, **Shift** para impulso y **E** para interactuar. En móvil: joystick y botones táctiles SALTAR, IMPULSO y USAR, personalizables. Puedes volver a practicar en **Aprender controles**.

## Modo sin conexión e instalación

En una conexión segura (GitHub Pages) abre el juego **una vez con internet** para instalar los recursos básicos en la caché del navegador. En navegadores compatibles usa la opción de instalación o **Agregar a pantalla de inicio**. Luego puedes intentar abrir sin conexión. Los datos se guardan localmente en el navegador/dispositivo y no se sincronizan automáticamente entre equipos.

**Importante:** el modo offline y el editor se probaron en Chromium real y en las pruebas automatizadas. No se ha realizado una validación física en Safari para iPhone; la disponibilidad del icono, sonido y comportamiento offline depende del navegador y su política de almacenamiento.

Para abrirlo localmente desde la carpeta descargada:

```sh
python3 -m http.server 8000
```

Después visita `http://localhost:8000`. Esto permite probar el service worker en localhost. Abrir directamente `index.html` puede funcionar como HTML autónomo, pero no registra el service worker en `file://`.

## Pruebas y desarrollo

El juego se publica principalmente como `index.html` con código y sprites incorporados. Recursos adicionales: `manifest.webmanifest`, `icon.svg`, `sw.js`, guía de arte, documentación, tests y workflows de GitHub Actions.

```sh
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
node tests/v060-missions-smoke.mjs
node tests/v070-refugio-smoke.mjs
node tests/v071-wayfinding-smoke.mjs
node tests/v080-transfer-smoke.mjs
node tests/v060-browser-smoke.mjs  # requiere Chrome/Chromium
```

Los workflows de CI comprueban sintaxis, escenas, intérprete de bloques, migración de guardado, operaciones de la interfaz, pantalla móvil horizontal y recarga offline, y conservan capturas como artefactos descargables de GitHub Actions.

## Estándares profesionales de diseño y aprendizaje

El rumbo de cada versión se evalúa ahora con tres documentos de producción basados en literatura de diseño de videojuegos, investigación educativa, UX y accesibilidad:

- [Auditoría profesional de Lúmina v0.6.1](AUDITORIA-PROFESIONAL-v0.6.1.md): evaluación honesta de lo que funciona y los problemas que todavía existen.
- [Biblia de diseño](BIBLIA-DE-DISENO-LUMINA.md): visión, mecánicas, experiencia buscada, arte, narrativa, progreso educativo, accesibilidad y ética de retención.
- [Plan de producción y calidad](PLAN-DE-PRODUCCION-Y-CALIDAD.md): tareas prioritarias, criterios de aceptación, prueba con personas, propuesta de capítulo jugable y roadmap.

**Nota:** las especificaciones no implican que sus mejoras ya estén implementadas; cada función requiere desarrollo y pruebas antes de marcarla como terminada.

## Entrega y próximos pasos

[**Cambios completos v0.7.1**](CHANGELOG-v0.7.1.md) · [**Qué probar personalmente**](QUE-PROBAR-v0.7.1.md) · [**Dirección de arte**](GUIA-ARTE-Y-PROFUNDIDAD.md) · [**Ver pruebas automáticas**](https://github.com/AllanCs29/lumina-juego/actions)

**Siguientes prioridades según auditoría:** reducir explicaciones obligatorias del LAB sin omitir enseñanza, reforzar evaluación con casos nuevos, integrar programación al mundo, revisar contraste y legibilidad móvil, modularizar el motor y validar físicamente en Safari iPhone. La historia completa permanece reservada para revisión posterior. Más adelante: sprites más expresivos, cursos específicos de cada lenguaje, jefes nuevos y campaña posterior al faro. Consulta el changelog para una distinción exacta entre implementado y pendiente.
