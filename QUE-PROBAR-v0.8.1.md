# Qué probar personalmente — Lúmina v0.8.1
## Menú nuevo
1. Abre desde cero sin haber jugado: la pantalla muestra solo Jugar, Aprender controles y Opciones como acciones principales.
2. Entra en Opciones. Debes ver orientación, tamaño de lectura, sonido, reducir movimiento y Ajustes avanzados.
3. Verifica que LAB y Cuaderno **no aparezcan antes de desbloquearlos**. Tras encontrar el Taller de NIX, debe aparecer el acceso al LAB. Al descubrir memorias, debe aparecer Cuaderno.
4. Nueva partida debe aparecer solo cuando haya progreso; si la presionas, debe pedir confirmación antes de borrar. Usa **Conservar partida** si deseas mantener tus avances.
5. Las escenas de prueba ya no deben aparecer. Solo para QA: añade `?dev=1` a la dirección de GitHub Pages y abre Opciones. No uses estos saltos al evaluar la progresión normal.
6. En PC usa Tab, Shift+Tab, Enter y Espacio para navegar; comprueba que Opciones indique foco y que el botón Jugar siga funcionando.
7. En iPhone horizontal confirma que no haya botones cortados ni scroll horizontal, que el panel pueda deslizarse al desplegar preferencias y que Jugar no quede escondido.
8. Cambia Flechas, escala de lectura y Reduce movimiento; vuelve al mundo, regresa al menú y comprueba que los valores se conservan.
9. Pulsa Aprender controles y confirma que el tutorial se inicia sin borrar partida.
10. Comprueba que la historia, el LAB y el editor de NIX siguen funcionando como en v0.8.0.

## Auditoría a validar con una persona novata
- ¿Entiende qué hacer en menos de 30 segundos sin explicarle el menú?
- ¿Puede reconocer un objeto interactivo y localizar el siguiente objetivo sin flechas invasivas?
- ¿Puede explicar la diferencia entre variable, condición, bucle y arreglo?
- ¿Resuelve una variación del mismo problema sin repetir una respuesta fija?
- ¿Identifica en qué instrucción falló y qué cambió en la máquina?
- ¿Puede suspender y retomar una misión sin perder su avance?

## No confundir con completado
La historia completa, ejecución real de Python/C++/JavaScript, auditoría visual de todos los escenarios y validación física de Safari siguen pendientes.

[Entrar al juego](https://allancs29.github.io/lumina-juego/) · [Auditoría](AUDITORIA-INTEGRAL-v0.8.1.md) · [Pruebas automáticas](https://github.com/AllanCs29/lumina-juego/actions)
