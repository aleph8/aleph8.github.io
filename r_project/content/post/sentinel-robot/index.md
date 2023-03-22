--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Electrónica 
date: "2021-08-09" 
description: 
image: 
series: 
tags: 
title: Robot Centinela
--- 
 
En esta ocasión me he decantado por hacer una especie de “robot centinela” que tras detectar movimiento se acciona un mecanismo de disparo.

En primer lugar necesitaba algo que pudiera disparar. Para ello me dieron una Nerf antigua para que yo pudiera cacharrear. Una vez la abrí me dí cuenta, que dada la antigüedad, poco quedaba que se pudiera reutilizar, a excepción del cañón al que se acoplaban dos motores. Cada motor lleva acoplado una especie de cilindro por el que se desliza la bala en cuestión.

En segundo lugar nos encontramos con la electrónica. Quería que fuera algo compacto y decidí usar una Arduino Nano la cual me servía de sobra para lo que yo necesitaba. El problema es que la salida es de 5V y aproximadamente unos 40 mA, siendo esto insuficiente para conseguir toda la potencia de los motores. La solución por la que opté fue alimentar los motores externamente con una batería recargable de unos 12V.

El circuito que alimenta los motores en principio estaría abierto y cuando se detectase movimiento pasaría a cerrado. Para esto he usado un relé, en este caso una especie de “interruptor electrónico”, que posee una señal de control para abrir o cerrar el circuito. 

El robot detecta el movimiento mediante un sensor PIR que está dividido en dos celdas que miden la radiación infrarroja convirtiéndola en una señal eléctrica cuando esta cambia.

Por último quedaba el diseño y mi impresora no funcionaba por lo que me las tuve que apañar con una caja circular que encontré y me gustó; ya solo quedaba montar y preparar todo el circuito.
 
<div style="text-align: center;"><img src="sentinel1.jpg" alt="Image" width="200">&nbsp;&nbsp;&nbsp;<img src="sentinel2.jpg" alt="Image" width="200">&nbsp;&nbsp;&nbsp;<img src="sentinel3.jpg" alt="Image" width="200">&nbsp;&nbsp;&nbsp;<img src="sentinel4.jpg" alt="Image" width="200">
<p> Relé &nbsp;-&nbsp; Pinout Relé &nbsp;-&nbsp; Sensor PIR &nbsp;-&nbsp; Centinela </p>
</div> 
