# Qué probar — Lúmina v0.5.0

## Ruta recomendada (iPhone horizontal y PC)
1. Abre una partida anterior. Comprueba que tus orbes, escenas, logros y checkpoints anteriores siguen disponibles.
2. En **Menú → Laboratorio de lógica**, prueba estos resultados: función `duplicar(6)` → **12**; arreglo `sensores[1] + sensores[0]` → **10**; depuración `carga = 2; carga += 3` → **5**.
3. Introduce una respuesta equivocada en cada reto. Debe aparecer explicación y poder corregirse; después sal del laboratorio y vuelve a entrar para verificar persistencia.
4. Abre **Menú → Capítulos y escenas de prueba → Centinela** o encuéntralo en Archivo de Ecos. En la primera ronda elige VERDADERO; segunda FALSO; tercera VERDADERO.
5. Al completar la primera ronda, sal con el botón **Salir**, vuelve a entrar desde Archivo de Ecos y verifica que empieza en 2/3. Repite para 3/3. El progreso normal no debe borrarse.
6. Repite el encuentro y pulsa **Reiniciar rondas**: debe comenzar en 1/3, sin borrar el resto de la partida.
7. Esquiva la onda de la ronda 1 saltando; ronda 2 observa las ondas dobles; ronda 3 observa la columna ámbar y aléjate antes del rayo. Si falla el movimiento, prueba Asistencia.
8. En **Pasarela Boreal**, revisa estelas de impulso, bufanda y animación de carrera, salto y aterrizaje. Compara las mismas acciones con FPS 60 y 120, cuando el navegador lo permita.
9. Recorre el faro, puerto y pasarela para verificar que niebla y nieve se mueven en planos distintos sin tapar pinos ni plataformas.
10. En Configuración, habilita **Ambiente original** después de tocar la página: comprueba que se escucha suavemente, que se puede desactivar y que respetó la opción de Sonido general. No debería sonar al abrir la página sin interacción.
11. La opción **Vibración** aparecerá solo si el navegador declara soporte. Prueba recoger un orbe o una respuesta correcta después de activarla; no asumas que Safari de iPhone ofrece esa API.
12. Cierra el navegador, vuelve a cargar y confirma que no se perdió el progreso de la historia, el Centinela ni el laboratorio.

## Automatización local
```bash
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
```

## Qué reportar con una captura o video
Nombre de escena, dispositivo/navegador, calidad elegida (Retro/Equilibrada/Nítida), FPS efectivos, paso que falló y si ocurrió con Asistencia activada.

**Criterio:** el juego debe seguir jugable y comprensible para quien nunca ha programado; la nueva práctica y los ataques no deben bloquear el progreso principal.
