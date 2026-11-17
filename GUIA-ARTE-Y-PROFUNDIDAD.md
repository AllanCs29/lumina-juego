# Guía de dirección de arte: volumen y lectura visual (v0.4.6)

Regla principal: **el jugador debe saber qué es fondo, qué es obstáculo y qué puede activar sin leer una explicación.**

| Tipo | Tratamiento |
|---|---|
| Fondo lejano | Tonos azules/grises apagados, bajo contraste, parallax estable, sin colisión |
| Decoración del mundo | Color frío, sombra suave, anclada al terreno; no simular un obstáculo sólido |
| Plataformas transitables | Borde superior claro, canto con grosor y vigas o apoyos |
| Obstáculos que hay que saltar | Caras frontal/lateral, sombra de contacto y color diferenciado |
| Interactivos | Base física y color de estado; destello/animación al accionarse |
| Personajes | Silueta contrastada, sombra real únicamente al tocar el suelo |
| Arquitectura cercana | Fachada y retorno lateral, ventanas hundidas, cimientos, acceso y umbral |

Regiones revisadas: Distrito Aurora, Estación Umbral, Archivo de Ecos, Azoteas, Puerto de la Bruma, Taller de NIX, Pasarela Boreal y Faro del Silencio.

No se cambiaron los puzles, coordenadas de colisión, historia, guardado ni habilidades por motivos de arte.

Revisa la imagen en iPhone horizontal y pantalla de PC antes de aceptar nuevas escenas.

## Actualización v0.4.8
- Los pinos ya no comparten una silueta de tres triángulos lisos: ramas por niveles con planos delanteros y traseros, nieve y remates de agujas. Permanecen detrás del terreno.
- La roca, fachadas, taller, academia y cajas usan microtexturas deterministas que no cambian al mover el personaje. Solo se pintan dentro de la franja visible de cámara.
- El faro añade ventanas hundidas, piedra texturizada y una linterna de varios componentes.
- Para evaluar la nueva versión, comparar una misma escena en Retro y Nítida, observar FPS efectivos y compartir capturas de objetos que aún se lean planos.
- **Importante:** triplicar el raster no crea nuevos dibujos automáticamente; estos microdetalles añadidos sí son contenido artístico adicional. El objetivo siguiente es redibujar más fotogramas y elementos a mano.
