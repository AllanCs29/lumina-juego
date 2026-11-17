# Lúmina v0.6.0 — Guía de revisión

## Paso 1. Comprobar la partida anterior
1. Abre https://allancs29.github.io/lumina-juego/ y verifica que la portada indica **ALFA 0.6.0**.
2. Entra a **Continuar**. No pulses **Nueva partida** si quieres conservar el guardado anterior.
3. Confirma que se conservan escena, orbes, memorias, puentes y avance del Centinela.
4. Si resolviste las primeras tres tareas del laboratorio en v0.5.0, deben seguir marcadas como completadas.

## Paso 2. Jugar las nuevas misiones
Desde el menú abre **Laboratorio de programación** o busca una terminal LAB dentro de una región y usa **E / USAR**.
1. Funciones: identificar el resultado devuelto.
2. Arreglos: recuperar dos valores mediante índices.
3. Depuración: identificar el valor al corregir una condición.
4. Calentar el refugio: crear una variable, modificarla y mostrar el resultado.
5. Faros repetidos: usar `REPETIR 3` para generar pulsos.
6. Sensores del hielo: leer y sumar datos de un arreglo.
7. Compuerta lógica: combinar condiciones mediante **Y**.
8. Señal de Lúmina: asignar, sumar, comparar y mostrar una condición.

En las misiones 4–8 comprueba que **+** agrega bloques, **↑ / ↓** los cambia de posición, **×** los elimina, **Ejecutar** muestra una traza y **Pista** no completa el programa automáticamente. Sal y vuelve a entrar: el borrador debe conservarse. El botón **Siguiente misión** permanece bloqueado hasta que la actual sea correcta.

## Paso 3. Recompensa y continuidad
Al completar 8/8, confirma que el menú y las terminales reflejan el avance. En Archivo de Ecos, al interactuar con el terminal tras vencer al Centinela, debe aparecer una nueva memoria. Si llegas al final del faro con 8/8, la conclusión debe reconocer la señal reconstruida.

## Paso 4. Probar móvil y opciones
- En iPhone Safari y PC, prueba controles de salto, movimiento, impulso, USAR, navegación por la academia, cerrar ventanas y regresar al juego.
- Prueba pantallas horizontales pequeñas: el panel de programación debe desplazarse verticalmente dentro de su ventana sin cortar botones.
- Activa **Reducir movimiento** y comprueba que disminuyen nieve móvil, destellos y partículas.
- Activa **Calidad automática** y observa si reduce nitidez tras baja tasa de fotogramas, sin borrar el progreso.
- Comprueba Audio y Vibración donde estén disponibles. En iOS Safari la API Vibrate puede no estar admitida.

## Paso 5. Probar instalación y uso sin internet
1. Abre el juego **con internet** y deja que termine de cargar.
2. En iPhone Safari usa el menú Compartir → **Agregar a pantalla de inicio** (si aparece).
3. Abre desde el acceso directo, comprueba que carga y crea un pequeño progreso.
4. Cierra y activa modo avión. Abre de nuevo. Comprueba si el navegador mantiene el juego y el progreso.
5. Vuelve a internet para instalar actualizaciones. Si no se actualiza, cierra pestañas de juego y vuelve a abrir en línea.

**Nota:** GitHub Actions verificó la navegación offline en Chromium, no en Safari físico. El comportamiento de instalación y actualización depende del navegador.

## Regresión del arte y del jefe
- En Pasarela Boreal: compara pinos, nieve, contacto con el suelo y plataformas en Retro/Equilibrada/Nítida.
- En Faro del Silencio: ventanas hundidas, cimientos, contraste y legibilidad de Iris frente al fondo.
- Iris debe mostrar diferentes detalles durante caminar, correr, saltar, caer e impulsarse. NIX debe seguir animándose.
- Centinela: las ondas dobles y el rayo vertical deben avisar antes de atacar. Las rondas completadas se guardan. **Reiniciar rondas** reinicia el encuentro sin borrar otras misiones.
- Repite el tutorial de Academia de Iris desde el menú: debe funcionar como la primera vez.

## Para reportar fallos
Incluye dispositivo, navegador, calidad seleccionada, modo asistencia, región del juego, acciones exactas para reproducir y captura/video. Prioriza un ejemplo donde se vea arte plano o un botón que quede tapado.

## Pruebas por terminal
```sh
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
node tests/v060-missions-smoke.mjs
# Chrome o Chromium instalado:
node tests/v060-browser-smoke.mjs
```

Las capturas automáticas de la versión móvil se guardan como artefactos de GitHub Actions, en el flujo **Lúmina · navegador real**.
