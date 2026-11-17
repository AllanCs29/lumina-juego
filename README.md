# Lúmina — Señales del Norte

**Versión 0.6.1 · Capa corregida, aprendizaje gradual y lenguajes opcionales**

[**Jugar desde iPhone, Mac o PC**](https://allancs29.github.io/lumina-juego/) · [**Descargar todo el código ZIP**](https://github.com/AllanCs29/lumina-juego/archive/refs/heads/main.zip)

Lúmina es una aventura 2D original para aprender lógica de programación desde cero mediante exploración, plataformas, misiones y narrativa. Iris y NIX recorren Distrito Aurora, Estación Umbral, Archivo de Ecos, Puerto de la Bruma, Pasarela Boreal y Faro del Silencio.

## Nuevo en v0.6.1
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

[**Cambios completos v0.6.1**](CHANGELOG-v0.6.1.md) · [**Qué probar personalmente**](QUE-PROBAR-v0.6.1.md) · [**Dirección de arte**](GUIA-ARTE-Y-PROFUNDIDAD.md) · [**Ver pruebas automáticas**](https://github.com/AllanCs29/lumina-juego/actions)

**Pendiente para el siguiente hito:** validación física en iPhone Safari, más fotogramas completamente redibujados, cursos especializados interactivos para cada lenguaje, ampliación de campaña después del faro y mayor integración de programas construidos dentro de mecanismos y combates. Consulta el changelog para una distinción exacta entre implementado y pendiente.
