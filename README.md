# Lúmina — Señales del Norte

**Versión 0.4.8 · Arte con volumen y microdetalles**

[**Jugar desde iPhone o PC**](https://allancs29.github.io/lumina-juego/)

Videojuego 2D para aprender programación desde cero mediante exploración, acertijos, plataformas y narrativa. Escenarios conectados: Distrito Aurora, Estación Umbral, Archivo de Ecos, Puerto de la Bruma, Pasarela Boreal y Faro del Silencio.

## Nuevo en v0.4.8
- **Arte sistémico:** pinos con ramas y planos separados, faro con mampostería y ventanas hundidas, cajas tridimensionales, roca, repisas, edificios y armadura del Centinela más detallados.
- **Mayor profundidad real:** sombras de contacto, colores por plano y marcas integradas en la geometría, no etiquetas flotantes.
- **Rendimiento:** texturas reproducibles, descarte fuera de cámara y densidad variable según Retro/Equilibrada/Nítida. La calidad 3× no solo multiplica la resolución: también incluye microdetalles adicionales.
- **Verificación automática:** 23 scripts revisados sintácticamente y prueba de renderizado con Canvas simulado. Ejecuta `node tests/v048-art-smoke.mjs`.

## Se conserva de v0.4.7
- **Academia de Iris:** tutorial jugable opcional que aparece en la primera apertura y se repite desde el menú. Practica caminar, saltar, impulsar y usar una máquina.
- **Primer jefe:** Centinela del Archivo, un encuentro opcional en tres rondas que utiliza condiciones booleanas, esquivar ondas y seleccionar VERDADERO/FALSO.
- **Arte:** detalles adicionales en Iris, NIX, pinos, cajas y nuevos escenarios con sombras y volumen. El modo de calidad Nítida permite hasta 3× de densidad de renderizado.
- Compatibilidad con partidas anteriores y con el resto de misiones.

## Controles
PC: A/D o flechas, Espacio, Shift, E. En móvil: joystick, SALTAR, IMPULSO, USAR, con tamaño y posición configurables.

## Archivos
`index.html` es el juego autónomo en GitHub Pages. Incluye todos los módulos del juego dentro de un único HTML; `tests/v048-art-smoke.mjs` permite validar esta versión sin dependencias. Los archivos modulares del ZIP anterior no forman parte de este repositorio.

[Registro de cambios v0.4.8](CHANGELOG-v0.4.8.md) · [Guía de pruebas v0.4.8](QUE-PROBAR-v0.4.8.md) · [Descargar código ZIP](https://github.com/AllanCs29/lumina-juego/archive/refs/heads/main.zip)

**Verificado en v0.4.8:** sintaxis de 23 bloques JS y llamadas de dibujo de elementos clave sobre Canvas simulado; GitHub Actions ejecuta estos tests. **Histórico v0.4.7:** 127 pruebas y escenarios en Chromium. **Pendiente de validar:** apariencia real, rendimiento y funcionamiento en Safari físico.