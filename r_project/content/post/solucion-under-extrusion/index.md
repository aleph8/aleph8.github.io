--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Impresión 3D
date: "2021-06-09" 
description: 
image: 
series: 
tags: 
title: Solución al Under Extrusion 
--- 
 
Nada más empezar a imprimir, parecía que todo iba bien con la impresora, pero las piezas salían a veces sin filamento en ciertas partes o las figuras no salían del todo bien (círculos por ejemplo).

Principalmente creía que sería problema de la calibración de la cama. Una vez calibrada seguía sucediendo lo mismo. Posteriormente pensé en la tensión de las correas que mueven los ejes (concretamente el X y el Y), pero tras tensarlas nada cambió.

El problema me tenía mosqueado, por lo que investigué un poco sobre el tema. Resulta que la Ender 3 (y la Pro) tiene un sistema de extrusión como el que se muestra en la siguiente imagen:

Este sistema de extrusión tiene un problema conocido como "Under-Extrusion" debido a lo siguiente:

* Puede ser que el muelle no ejerza la suficiente fuerza, es por esto que se puede apretar o aflojar el tornillo que se ve en la imagen. Me ha parecido ver, que modelos más antiguos no tienen este tornillo, pero hay piezas imprimibles para solucionar este problema. Si el problema persiste puede ser que sucediese lo contrario, es decir, que estuviera demasiado apretado. En ese caso bastaría con aflojarlo.

* Hay una rueda dentada que es la que empuja el filamento hacia el extrusor. El problema es que el filamento está en contacto con el eje Z y este engrasa el filamento por lo que a veces se puede escuchar una especie de "crack-crack" de la rueda dentada ya que no es capaz (por la grasa) de empujar al filamento ya que este resbala.

* Por último el soporte que viene con la impresora para el filamento puede no ser suficiente para que el carrete se deslice sin problemas. Esto conduce a que se vuelva a escuchar el ruido antes mencionado, ya que el sistema carece de la fuerza necesaria para tirar del filamento.


Una vez que sabía esto, lo primero que hice fue ajustar el tornillo. Parecía que la impresora imprimía mejor; había menos huecos e imperfecciones.

El problema era que seguía haciendo el mismo ruido, cada vez con más frecuencia, incluso llegaba a dejar de empujar el filamento a media impresión, destrozando todo el trabajo. Para solucionar este problema lo que hice fue imprimir un mango de repuesto al que venía de fábrica (el diseño está en thingiverse) al que se le insertaban varios rodamientos con el fin de facilitar el movimiento del carrete.

Para finalizar, coloqué un trozo de teflón para evitar el roce del filamento con el eje Z solucionando así los problemas mencionados anteriormente.