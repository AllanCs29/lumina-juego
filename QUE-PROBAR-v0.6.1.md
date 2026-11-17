# Qué revisar — Lúmina v0.6.1

## 1. Capa de Iris
En Distrito Aurora o Pasarela Boreal, corre hacia la derecha, luego hacia la izquierda. La capa/bufanda debe seguir **detrás del movimiento** (no sobresalir hacia la dirección de avance). Prueba también al impulsarte, saltar y caer. Si el atlas original tapa una parte de la bufanda, comparte una captura de ambos sentidos con el mismo encuadre.

## 2. Laboratorio bloqueado por historia
En **Nueva partida**, el laboratorio del menú debe aparecer bloqueado. Antes de descubrirlo no deben aparecer terminales LAB distribuidas por la ciudad ni permitir abrir los retos. Avanza por las máquinas principales: condición de la puerta Z02, variable carga y reparación de NIX. En el Taller de NIX, cuando NIX esté reparado, encuentra la terminal LAB, acércate y pulsa USAR / E. Después del diálogo inicial se activa el laboratorio en el menú y en otras regiones.

**Partida antigua:** si completaste retos en v0.6, el laboratorio conserva el acceso para no perder avance previo.

## 3. Aprender antes de resolver
En una misión sin completar comprueba los tres pasos didácticos (qué es, ejemplo y tu tarea). El botón Ejecutar debe permanecer deshabilitado hasta tocar **Entendido · empezar reto**. Revisa que la primera misión trate de instrucciones, la segunda de variables y la tercera de condiciones, sin JavaScript ni C++ obligatorios.

## 4. Dónde se ve la programación
- **Distrito Aurora, puerta Z02:** la explicación enseña SI, Y y NO en pseudocódigo.
- **Estación de variable carga:** aparece la analogía de la cajita. Usando «Ejecutar un paso», se debe ver cómo cambia carga; el desplegable muestra el pseudocódigo con INICIO, SI, MOSTRAR/acciones y FIN.
- **Taller de NIX:** primero aprende a ordenar instrucciones y reparar la máquina. El laboratorio ofrece 8 misiones con explicaciones y ejecución de bloques.
- **Laboratorio después de misión 4:** aparece un selector Pseudocódigo/Python/C++/JavaScript. Elige uno, mira la traducción del programa y comprueba que se mantiene al cerrar y volver, incluso tras recargar.

## 5. Móvil y guardado
Prueba iPhone horizontal, controles táctiles, accesibilidad de flechas de reordenamiento, cerrar el laboratorio sin perder partida, y modo sin conexión después de cargar la página online. La prueba automática usa Chrome; la verificación física de Safari sigue pendiente.

## Cómo ver el estado de las pruebas
En GitHub visita `Actions` y comprueba **Lúmina · verificaciones**, **Lúmina · navegador real** y **pages build and deployment**. Los resultados incluyen las pruebas y capturas automatizadas.

[Registro de cambios](CHANGELOG-v0.6.1.md) · [Repositorio](https://github.com/AllanCs29/lumina-juego)
