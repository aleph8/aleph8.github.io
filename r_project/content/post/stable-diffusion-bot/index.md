--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Software 
date: "2022-10-18" 
description: 
image: 
series: 
tags: 
title: Stable Diffusion Bot
--- 

Stable Diffusion es un modelo de aprendizaje capaz de generar imágenes digitales a partir de descripciones en lenguaje natural con el uso de un "prompt".

Quería probar y experimentar con algún modelo generador de imágenes y Stable Diffusion cuenta con su repositorio en Github; el problema, es que a día de hoy no cuento con una gráfica potente para trabajar con gráficos y, por tanto, por increíble que pueda parecer, tenía que buscar la manera de ejecutarlo en CPU, ya que mi objetivo es ejecutarlo en local.

Tras buscar un poco, encontré el un repositorio que me solucionaba todo, permitiendo ejecutar el modelo usando CPU. Solo quedaba crear el bot, para el cual he empleado la API de Discord en Python.

Los tiempos de ejecución oscilan entre los 2,4 minutos hasta 15 minutos dependiendo los  "inference steps" que le pasemos como argumento. Como extra he hecho un ajuste lineal para estimar el tiempo en función de los "inference steps". Aquí se pueden apreciar los resultados:

<div style="text-align: center;"><img src="stable1.png" alt="Image" width="500">&nbsp;&nbsp;&nbsp;<img src="stable2.png" alt="Image" width="500">&nbsp;&nbsp;&nbsp;<img src="stable3.png" alt="Image" width="500">&nbsp;&nbsp;&nbsp;<img src="stable4.png" alt="Image" width="500"></div> 

