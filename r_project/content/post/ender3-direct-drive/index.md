--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Impresión 3D 
date: "2022-01-13" 
description: 
image: 
series: 
tags: 
title: Ender 3 Pro Extrusión Directa
--- 

Como ya venía diciendo desde el principio, la extrusión tipo "Bowden" en esta Impresora me estaba dando problemas.

Este sistema de extrusión tiene una ventaja principal y es que posee una menor masa en lo que es el carro del extrusor, ya que el motor va acoplado directamente al chasis. Sin embargo, cuenta con diversos problemas que es lo que seguramente me haya estado pasando. Por ejemplo, puede ser que el motor que empuja al filamento no tenga suficiente fuerza. He aquí el sonido que mi impresora emitía al no tener la fuerza suficiente.

Una de las cosas que podía hacer, era actualizar el firmware de la  impresora ya que éste se encontraba en una versión un poco primitiva . Resulta que la impresora venía con una placa un poco complicada de actualizar (V1) , sobretodo porque había que hacer uso de una Arduino para "quemar" el bootloader. Por otro lado tenía bastante ganas de tener extrusión directa y me decanté por añadirla.Con la extrusión directa añadía mas peso al carro del extrusor, pero ganaba en velocidad de extrusión y en menos riesgos provocados por el motor. Además me permitía imprimir ciertos materiales con más requisitos de temperatura, como el TPU.

Posteriormente hice lo siguiente:

<div style="text-align: center;"><img src="ender3directdrive.jpg" alt="Image" width="500"></div> 

1. Imprimí un diseño que encontré en Thingiverse y me pareció idóneo.

2. Una vez que todo estaba impreso, procedí a desmontar el motor que venía de serie en el chasis (como extra, cambié la pieza de plástico que actuaba de pinza por una de aluminio, ya que estaba empezando a desgastarse).

3. Desmonté por completo el carro del extrusor y le acoplé la pieza impresa (ya de paso ajusté las ruedas excéntricas).

4. Volví a montar el carro y a conectar todos los cables desconectados . 


Desde que hice esta mejora, la impresora no me ha vuelto a dar ningún problema; imprime sin problemas y no se salta pasos. Además de esto, como se puede ver, también le cambié el ventilador de capa; el que venía de serie era poco efectivo, aunque de esto hablaré en otro momento.

