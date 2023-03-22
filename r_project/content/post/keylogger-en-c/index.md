---
aliases:
author: Alejandro García Peláez
categories:
- Ciberseguridad
date: "2021-11-29"
description:
image: 
series:
tags:
- hacking-tools
title: Keylogger en C
---

Un spyware es un tipo de virus informático que tras infectar el ordenador de la víctima busca la manera de conseguir todo tipo de información de esta (desde capturas de pantalla hasta grabar audio o acceder a la cámara).

Un keylogger es un tipo de spyware que registra las pulsaciones del teclado de la víctima para obtener datos personales: contraseñas, datos bancarios, acceso a cuentas...

Usando C he programado un keylogger; el funcionamiento de este es sencillo:

* En primer lugar se ejecuta el programa en el ordenador infectado:

<div style="text-align: center;">
  <img src="key1.png" alt="Image" width="500">
</div>

* Después el usuario víctima introduce todo tipo de información:

<div style="text-align: center;">
  <img src="key2.png" alt="Image" width="400">
</div>

* Para finalizar, esta información se guarda de alguna manera. En mi caso lo he programado para que se guarde en "archivo.txt" en el mismo directorio de ejecución del programa:

<div style="text-align: center;">
  <img src="key3.png" alt="Image" width="400">
</div>

