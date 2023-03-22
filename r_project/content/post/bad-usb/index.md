--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Ciberseguridad 
date: "2022-11-03" 
description: 
image: 
series: 
tags: 
- hacking-tools 
title: Bad Usb 
--- 

Cuando vemos este objeto, podemos pensar de primeras que es una memoria USB, sin nada particular; incluso puede darse la situación de que lo conectes en tu ordenador creyendo que lo es, y que no le va a pasar nada.

El problema surge, cuando vemos su interior, con lo que nos daremos cuenta, que no es ni mucho menos algo normal:

<div style="text-align: center;"><img src="bad1.jpg" alt="Image" width="400"></div> 

Vemos que internamente está construido por un pequeño procesador de 60 MHz y 32 Bits, lo que lo convierte en un dispositivo programable y potencialmente peligroso, ya que a través de la micro SD pueden ser cargados una serie de script, para que una vez conectado se comporte como un “teclado oculto”.

Pero ¿cómo que nuestro ordenador no lo detecta como dañino? La respuesta es sencilla, y es que realmente nuestro dispositivo piensa que es un teclado más, como si alguien estuviera escribiendo; con este pequeño dispositivo y un poco de ingeniería social, se pueden llevar a cabo multitud de ataques, desde acceso remoto mediante reverse-shell hasta la descarga y ejecución en segundo plano de programas maliciosos.

Además, está al alcance de cualquiera; por ejemplo, con una pequeña búsqueda en Google podemos obtener el script de un keylogger para que nuestro pequeño “teclado camuflado” haga el resto.

Podemos tomar algunas medidas de prevención:

* Obviamente, lo principal es no conectar cualquier USB a nuestro ordenador. A lo mejor alguna vez os encontráis una memoria USB por la calle, y tenéis el impulso de conectarla directamente para ver su contenido. Al hacer esto, os exponéis a un potencial daño.

* Algunos scripts, están configurados para un "entorno por defecto". Por ejemplo, en Windows, a la hora de ejecutar como administrador la cmd, seguimos una serie de pasos preestablecidos:

  * Clicamos el botón de Windows

  * Buscamos cmd

  * Ejecutamos como administrador

  * Le damos "sí" para permitir el acceso

  * Ejecutamos libremente todo lo que queramos.

Estos pasos pueden ser fácilmente automatizados, por lo que deberíamos tener este tipo de situaciones por defecto con algún paso imprevisto de por medio, de tal forma que el programa malicioso quede inutilizado; en el caso de ejemplo, bastaría con tener que insertar la contraseña del usuario antes de realizar acciones con permisos elevados.