--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Ciberseguridad 
date: "2023-02-06" 
description: 
image: 
series: 
tags: 
- pentesting-web 
title: RCE 
--- 

Llamamos RCE o *Remote Code Execution* a la ejecución de comandos arbitrarios gracias a la toma de control de un equipo remoto mediante alguna vulnerabilidad del servicio expuesto como [LFI](/p/2023/lfi).

Esto puede suceder, por ejemplo, si no está bien controlada la entrada de datos del usuario. Despliego el servicio web preparado para explicar esto y supongamos la siguiente situación:

Hay un servicio web que permite a sus usuarios ejecutar código en C++ en el navegador, sin necesidad de ejecutarlo en su dispositivo:

<div style="text-align: center;"><img src="rce1.png" alt="Image" width="900"></div> 

Como podemos ver en la salida, parece ser que internamente, el código que escribimos se pasa directamente a un archivo php que a nivel de sistema compila y muestra la salida en el servicio web.

Un atacante podría aprovechar esto para hacer lo siguiente:

<div style="text-align: center;"><img src="rce2.png" alt="Image" width="900"></div> 

El bloque de código señalado ejecuta un comando de lado del servidor gracias a la función de C '**popen**'. Posteriormente definimos un array de caracteres que será donde guardemos el stdout de nuestro comando, para posteriormente mostrarlo en el servicio web. Con el uso de la función '**fgets**' podemos hacer fácilmente esto último al pasar los argumentos: primero donde vamos a guardar aquello que leamos, segundo la longitud máxima de lo que queremos leer de la salida y por último de donde vamos a sacar la información ( de la ejecución del comando). 

En este caso vamos a ejecutar en la máquina víctima un 'ping' (protocolo ICMP) a localhost (recordad que es un entorno de prueba, pero en un escenario real se podría probar con nuestra ip para ver si tenemos conexión directa con el servidor y poder entablar una consola remota):

<div style="text-align: center;"><img src="rce3.png" alt="Image" width="900"></div> 


