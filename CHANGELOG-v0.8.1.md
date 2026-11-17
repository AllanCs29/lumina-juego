# Lúmina v0.8.1 — Menú sencillo y auditoría multidisciplinaria
## Funcionalidades implementadas
- Entrada limpia con **Jugar/Continuar**, **Aprender controles** y **Opciones** (un solo disclosure).
- Opciones de uso frecuente visibles dentro de Opciones, ajustes técnicos bajo un segundo desplegable.
- Los accesos LAB y Cuaderno dejan de aparecer antes de descubrirse.
- Nueva partida se muestra solo al existir progreso y mantiene confirmación de borrado.
- Repetir introducción solo aparece tras verla. Las escenas técnicas desaparecen del menú normal y se habilitan solo con `?dev=1` para QA.
- Nuevo estilo con objetivo táctil para acciones principales y foco de teclado.
- Nueva verificación E2E del menú y captura móvil en CI. Se conservan guardados y el laboratorio con ocho misiones.
- Caché de PWA actualizada a `lumina-app-v081`.

## Auditoría profesional
[Ver hallazgos priorizados](AUDITORIA-INTEGRAL-v0.8.1.md). Identifica deudas reales en enseñanza, autonomía, integración de mundos, lectura móvil y modularidad del código. El documento no supone que estas deudas estén solucionadas.

## Lo que sigue pendiente
- Validación física de Safari en iPhone y pruebas con personas principiantes.
- Rediseñar el tutor de tres paneles obligatorios para ofrecer práctica tras una breve explicación.
- Evaluación de dominio con casos nuevos no anunciados.
- Consecuencias físicas visibles de misiones 5–8 y auditoría integral de arte.
- Separación del archivo monolítico en módulos de producción.
- Historia completa, deliberadamente pospuesta.

## Comprobaciones
```sh
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
node tests/v060-missions-smoke.mjs
node tests/v070-refugio-smoke.mjs
node tests/v071-wayfinding-smoke.mjs
node tests/v080-transfer-smoke.mjs
node tests/v060-browser-smoke.mjs
```
La prueba de navegador produce `artifacts/lumina-v081-menu-movil.png` entre otras capturas, disponibles en las ejecuciones de GitHub Actions.
