---
id: 09062021
title: UnderExtrusion 
specialty: pillars
author: "Alejandro García Peláez"
date: "09-06-2021"
categories: []
tags: ["ender 3","3d print"]
group: 3dprint
links:
- 07062021
---


:::::{.spanish}

Nada más empezar a imprimir, parecía que todo iba bien con la impresora, pero las piezas salían a veces sin filamento en ciertas partes o las figuras no salían del todo bien (círculos por ejemplo).

Principalmente creía que sería problema de la calibración de la cama. Una vez calibrada seguía sucediendo lo mismo. Posteriormente pensé en la tensión de las correas que mueven los ejes (concretamente el X y el Y), pero tras tensarlas nada cambió.

Este sistema de extrusión tiene un problema conocido como "Under-Extrusion" debido a lo siguiente:

* Puede ser que el muelle no ejerza la suficiente fuerza, es por esto que se puede apretar o aflojar el tornillo que se ve en la imagen. Me ha parecido ver, que modelos más antiguos no tienen este tornillo, pero hay piezas imprimibles para solucionar este problema. Si el problema persiste puede ser que sucediese lo contrario, es decir, que estuviera demasiado apretado. En ese caso bastaría con aflojarlo.

* Hay una rueda dentada que es la que empuja el filamento hacia el extrusor. El problema es que el filamento está en contacto con el eje Z y este engrasa el filamento por lo que a veces se puede escuchar una especie de "crack-crack" de la rueda dentada ya que no es capaz (por la grasa) de empujar al filamento ya que este resbala.

* Por último el soporte que viene con la impresora para el filamento puede no ser suficiente para que el carrete se deslice sin problemas. Esto conduce a que se vuelva a escuchar el ruido antes mencionado, ya que el sistema carece de la fuerza necesaria para tirar del filamento.


Una vez que sabía esto, lo primero que hice fue ajustar el tornillo. Parecía que la impresora imprimía mejor; había menos huecos e imperfecciones.

El problema era que seguía haciendo el mismo ruido, cada vez con más frecuencia, incluso llegaba a dejar de empujar el filamento a media impresión, destrozando todo el trabajo. Para solucionar este problema lo que hice fue imprimir un mango de repuesto al que venía de fábrica (el diseño está en thingiverse) al que se le insertaban varios rodamientos con el fin de facilitar el movimiento del carrete.

Para finalizar, coloqué un trozo de teflón para evitar el roce del filamento con el eje Z solucionando así los problemas mencionados anteriormente.

:::::

:::::{.english}

As soon as I started printing, it seemed that everything was going well with the printer, but the pieces sometimes came out without filament in certain parts or the figures did not come out well (circles for example).

I mainly thought it was a problem with the bed calibration. Once calibrated, the same thing kept happening. Later I thought about the tension of the belts that move the axes (specifically the X and Y), but after tightening them nothing changed.

This extrusion system has a problem known as "Under-Extrusion" due to the following:

* It may be that the spring is not exerting enough force, which is why the screw shown in the picture can be tightened or loosened. I thought I saw that older models do not have this screw, but there are printable parts to solve this problem. If the problem persists, it may be that the opposite is true, i.e. it is too tight. In that case it would be enough to loosen it.

* There is a sprocket that pushes the filament into the extruder. The problem is that the filament is in contact with the Z axis and this greases the filament so sometimes you can hear a kind of "crack-crack" of the sprocket as it is not able (because of the grease) to push the filament as it slips.

* Finally the support that comes with the printer for the filament may not be sufficient for the spool to slide smoothly. This leads to the aforementioned noise being heard again, as the system lacks the necessary force to pull the filament.


Once I knew this, the first thing I did was to adjust the screw. It seemed that the printer printed better; there were fewer gaps and imperfections.

The problem was that it kept making the same noise, more and more frequently, and even stopped pushing the filament halfway through the print, destroying the whole job. To solve this problem what I did was to print a replacement handle to the one that came from the factory (the design is in thingiverse) to which several bearings were inserted in order to facilitate the movement of the spool.

Finally, I placed a piece of Teflon to prevent the filament from rubbing against the Z axis, thus solving the problems mentioned above.

:::::