---
id: 18102022
title: Stable-Bot a Stable Difussion Discord Bot 
specialty: pillars
author: "Alejandro García Peláez"
date: "18-10-2022"
categories: []
tags: []
group: Programming
links:
- 02052022
---

:::::{.spanish}


Stable Diffusion es un modelo de aprendizaje capaz de generar imágenes digitales a partir de descripciones en lenguaje natural con el uso de un "prompt".

Quería probar y experimentar con algún modelo generador de imágenes y Stable Diffusion cuenta con su repositorio en Github; el problema, es que a día de hoy no cuento con una gráfica potente para trabajar con gráficos y, por tanto, por increíble que pueda parecer, tenía que buscar la manera de ejecutarlo en CPU, ya que mi objetivo es ejecutarlo en local.

Tras buscar un poco, encontré el un repositorio que me solucionaba todo, permitiendo ejecutar el modelo usando CPU. Solo quedaba crear el bot, para el cual he empleado la API de Discord en Python.

Los tiempos de ejecución oscilan entre los 2,4 minutos hasta 15 minutos dependiendo los  "inference steps" que le pasemos como argumento. Como extra he hecho un ajuste lineal para estimar el tiempo en función de los "inference steps". Aquí se pueden apreciar los resultados:

<div style="text-align: center;"><img src="images/stable1.png" alt="Image" width="500"><br><img src="images/stable2.png" alt="Image" width="500"><br><img src="images/stable3.png" alt="Image" width="500"><br><img src="images/stable4.png" alt="Image" width="500"></div> 

:::::

:::::{.english}

Stable Diffusion is a learning model capable of generating digital images from natural language descriptions with the use of a prompt.

I wanted to try and experiment with some image generating model and Stable Diffusion has its repository on Github; the problem is that I don't have a powerful graphic to work with graphics and, therefore, as incredible as it may seem, I had to find a way to run it on CPU, since my goal is to run it locally.

After searching a little, I found a repository that solved everything, allowing to execute the model using CPU. The only thing left was to create the bot, for which I used the Discord API in Python.

The execution times range from 2.4 minutes to 15 minutes depending on the inference steps we pass as arguments. As an extra I have made a linear adjustment to estimate the time depending on the inference steps. Here you can see the results:

<div style="text-align: center;"><img src="images/stable1.png" alt="Image" width="500"><br><img src="images/stable2.png" alt="Image" width="500"><br><img src="images/stable3.png" alt="Image" width="500"><br><img src="images/stable4.png" alt="Image" width="500"></div> 

:::::