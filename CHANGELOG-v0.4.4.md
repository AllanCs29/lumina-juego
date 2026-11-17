# Lúmina v0.4.4 — Aprender jugando

## Enfoque de esta versión
Menos lectura obligatoria, más interacción y retroalimentación. El aprendizaje no desaparece: la teoría queda disponible cuando el jugador la solicita o desbloquea el Cuaderno.

## Cambios implementados
- **Prólogo:** cuatro escenas breves animadas, avance automático, botón Siguiente y Omitir. Continúa la historia de Iris, NIX y Aurora.
- **Lógica:** consola Z02 con objetivo de una frase, interruptores, visualización Y / puerta y respuesta inmediata. Explicación detallada opcional mediante **ⓘ Aprender**.
- **Variables:** estación `carga = 1 → 5` disponible directamente, sin lección de tres páginas obligatoria. Las operaciones y el resultado llevan el protagonismo.
- **NIX:** el tablero se abre inmediatamente y permite construir una ruta. Guía puntual y explicación ampliada opcionales.
- **Orbes:** desbloquean la habilidad con un mensaje breve sin congelar la exploración.
- **Historia:** acortados textos redundantes al abrir puerta, encender red, encontrar registros, activar relés o despertar NIX; los detalles permanecen consultables mediante Cuaderno y código.
- **Diseño:** paneles educativos reducidos; bitácora detallada plegada de forma predeterminada. Se conservan puertas, puente físico, mapas, controles y guardado.

## Verificaciones
- **105 pruebas unitarias aprobadas**.
- Chromium móvil emulado: apertura automática de prólogo, interacción lógica errónea/acertada, ejecución de variable, NIX y Cuaderno progresivo. Sin excepciones JavaScript en ese recorrido.
- Regresión del capítulo del faro: cuatro orbes, programación de NIX, impulso, cristal, bucle y final completos en navegador emulado.

## Pendiente
- Validación real en Safari de iPhone, FPS y guardado al cerrar/reabrir.
- Comprobar con nuevos jugadores que la menor lectura no permite pasar los retos solo por tanteo sin entender los conceptos.
- Más enseñanza mediante consecuencias, animaciones y pequeñas preguntas situacionales.
