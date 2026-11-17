# Lúmina v0.4.2 — La señal bajo la ciudad

## Mejoras implementadas
- Menú rediseñado: **Continuar**, **Nueva partida** (confirmación de borrado), **Configuración**, Cuaderno progresivo y capítulos de prueba en apartado secundario.
- Prólogo animado original de **6 escenas**, repetible u omitible.
- **Puente físico** en Distrito Aurora: hueco real del suelo, 6 segmentos que se despliegan tras programar `carga = 5`, con colisión únicamente al finalizar la animación.
- Puerta Z02 tridimensional: destello rojo con sonido al intentar cruzarla cerrada; apertura y color verde al resolver los sensores.
- **Archivo de Ecos**, nuevo mapa opcional conectado a Estación Umbral, 3 lectores y un misterio que enlaza NIX, Aurora y el faro.
- Lección nueva de **Datos**, bloqueada hasta recuperar el primer registro.
- Consola de variables simplificada y diálogos arriba para evitar el solapamiento con botones en móvil.
- NIX con movimiento, ZZZ y luces; orbes y fragmentos con flotación y destellos; cajas volumétricas con sombras; continuación visual de suelos en bordes.
- Sonido activado por defecto con SFX originales diferenciados para inicio, menú, error, puerta, puente, recogidas, NIX y viaje. En Safari requiere el primer toque del usuario.
- Controles personalizables y zona segura de cámara, 60 FPS de base, 120 FPS experimental con medición efectiva.
- Conserva mapas, puzles, guardado y campaña de versiones anteriores.

## Validación
- **92 pruebas unitarias aprobadas**.
- Navegador Chromium escritorio y móvil emulado: menú, borrar/cancelar partida, cinemática 6 escenas, puerta, puente con colisión, Archivo de Ecos, diálogo superior.
- Regresión: distrito, lógica, azoteas, variable, NIX, metro, puerto; sin errores JavaScript registrados durante esos recorridos.

## Pendiente y limitaciones
- Prueba manual en Safari iPhone físico: fluidez, control, audio, FPS efectivos, persistencia después de cerrar/reabrir.
- El navegador de pruebas bloqueó recarga de archivos locales/localhost. Se verificaron lectura y normalización del guardado por pruebas unitarias, no una recarga física.
- No hay banda sonora completa, solo efectos sintetizados. Faltan ciclos de animación completos, NPC, misiones largas, funciones, arreglos y bucles avanzados.
- El Archivo de Ecos es opcional y corto, no un capítulo completo.

[Guía de pruebas](QUE-PROBAR-v0.4.2.md)
