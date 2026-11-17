# Lúmina v0.4.8 — Qué revisar personalmente

1. Abre el juego en iPhone horizontal y en PC; en Menú → Opciones, alterna Retro, Equilibrada y Nítida. **Nítida** debe ofrecer textura más fina sin que los bordes se vean borrosos.
2. En Pasarela Boreal, inspecciona pinos al fondo y cerca del camino: ramas, nieve y tronco deben leerse como volumen y quedar **detrás** del terreno. Repite caminando y durante un salto.
3. En el Faro del Silencio, verifica que la estructura tiene ventanas hundidas, piedra texturizada, cimientos y que la luz se distingue del muro. Al activar el faro, confirma que puedes ver al personaje y la entrada.
4. Prueba las cajas de la Pasarela y del Distrito Aurora. Deben verse de madera/metal con caras y remaches, no como paneles planos. Revisa si la flecha ahora se ve pintada sobre la caja.
5. Revisa los balcones transitables, texturas de roca, edificios de Aurora y fachadas del taller: no deben desaparecer, parpadear o cambiar patrón al mover la cámara.
6. Repite Academia de Iris desde Menú → Aprender controles y abre el Centinela desde Capítulos y escenas de prueba; comprueba que saltar, impulsar, usar y elegir VERDADERO/FALSO funcionan.
7. Cierra, vuelve a abrir y confirma que tu progreso, capítulos, opciones, tutorial y checkpoints siguen guardados.
8. Observa los **FPS efectivos** en Nítida y Retro durante 1 minuto cada uno, sobre todo en Pasarela Boreal. Si notas tirones, prueba Equilibrada.
9. Si algo se ve demasiado plano o se superpone con Iris, comparte una captura con nombre de región, la calidad seleccionada y la posición aproximada.

**Prueba local de código (opcional):** `node tests/v048-art-smoke.mjs`. No requiere instalar paquetes.

**Criterio de aceptación visual:** cada objeto importante debe distinguirse del fondo por su contorno, luz, textura y contacto físico con el suelo.
