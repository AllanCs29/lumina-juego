# Qué probar — Lúmina v0.7.1

## 1. ¿Hacia dónde ir? (PC y móvil)
1. Abre una partida y entra a **Distrito Aurora**. Al estar lejos de la consola Z02, una flecha discreta cerca de Iris debe señalar en su dirección.
2. Camina pasando la consola sin activarla: la flecha debe cambiar hacia la **izquierda**. Vuelve a acercarte: debe desaparecer junto a la consola, donde aparece la indicación **E / USAR**.
3. Resuelve la puerta, activa el nodo eléctrico y después la estación de variables. La orientación debe cambiar automáticamente hacia el siguiente objetivo.
4. En **Estación Umbral**, activa el relé que tengas cerca. Si falta otro relé detrás, la flecha debe señalarlo; cuando ambos estén activos debe señalar el tren.
5. En **Archivo de Ecos**, comprueba que se priorizan lectores incompletos, luego el encuentro del Centinela.
6. En **Taller de NIX**, comprueba los pasos: orbe violeta, banco de NIX y descubrimiento del LAB si aún no lo has visitado. Después debe orientar hacia la salida al Puerto.
7. En **Pasarela Boreal**, observa los hitos de salto, balizas, impulso, cristal y arco al faro. La flecha indica la dirección general, no la secuencia exacta de saltos.

## 2. Opciones de configuración
En **Menú → Configuración → Orientación suave**, compara:
- **Flechas discretas:** visibles mientras exploras, de tamaño pequeño y poco brillo.
- **Solo cuando pulso Pista:** sin flechas por defecto; al pulsar «? Pista» se muestra una guía breve durante unos segundos.
- **Sin flechas:** vuelve a la exploración sin indicadores visuales.

Cierra el menú, recarga la página y confirma que se conserva el modo elegido. Después prueba la opción «Reducir movimiento».

## 3. Lo que no debe pasar
- Flecha atravesando la pantalla o tapando el joystick, botones de salto o la cara de Iris.
- Indicaciones hacia un relé, memoria u orbe que ya se completó.
- Flecha permanente encima de la consola mientras intentas interactuar.
- Flecha durante el tutorial de controles, el jefe, una cinemática o un diálogo.
- Perder partida, checkpoint o progreso educativo por cambiar la orientación.

## 4. Pruebas de consola y CI
```sh
node tests/v048-art-smoke.mjs
node tests/v050-progress-smoke.mjs
node tests/v060-missions-smoke.mjs
node tests/v070-refugio-smoke.mjs
node tests/v071-wayfinding-smoke.mjs
node tests/v060-browser-smoke.mjs  # necesita Chrome/Chromium
```

**Nota:** pruebas automáticas en Chrome no equivalen a un ensayo en Safari físico. Si una flecha es demasiado visible, muy pequeña o señala un destino confuso, envía una captura e indica escena, ubicación y avance de misión.

[Registro de cambios](CHANGELOG-v0.7.1.md) · [Lúmina jugable](https://allancs29.github.io/lumina-juego/)
