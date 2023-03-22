--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Ciberseguridad 
date: "2022-12-17" 
description: 
image: 
series: 
tags: 
- criptografía 
title: Creación de Contraseñas Robustas 
--- 

Cada vez es más frecuente que manejemos diversas contraseñas a la vez. Si queremos que estas sean seguras y estén protegidas a posibles ataques de fuerza bruta, basados en un diccionario personal, debemos asegurar la robustez de estas y cambiarlas periódicamente; algunas buenas prácticas son:

1. Combinar letras ( mayúscula y minúscula ) con números.

2. Usar palabras que no contengan relación contigo ( evita poner nombres, apellidos, fechas... ).

3. Transponer o sustituir las letras una vez tengas la contraseña.

4. Contraseña de considerable longitud ( conforme más caracteres más posibles contraseñas ).


Estas técnicas te garantizan una contraseña robusta pero pueden ser difíciles de memorizar, algunas opciones para solventar esto:

* [Técnica Diceware](https://diceware.dmuth.org/): nos permite obtener una cadena a partir de una serie de palabras que se ordenan aleatoriamente. Con memorizar la cadena, ya que es una serie de palabras en secuencia, tendríamos suficiente.

* Solución Hardware: implementación de un dispositivo que almacene y genere las contraseñas. Puedes ver un ejemplo con mi [Digital Key](/p/2022/digital-key) .

* Solución Software: gestores de contraseñas como KeePass.

<div style="text-align: center;"><img src="creation1.png" alt="Image" width="500"></div> 

Keepass es un gestor de contraseñas "Open Source" que nos permite guardar todas estas de forma segura, utilizando una única contraseña para poder acceder a la "Base de Datos" donde se encuentran almacenadas el resto.

Todo se almacena en un fichero que actúa como base de datos, con extensión "kdbx"; en este fichero, no solo se encuentran encriptadas las contraseñas, sino toda la información asociada a estas ( nombre de usuario, URL ... ) está encriptada en AES-256, con soporte a distintos algoritmos de cifrado mediante plugins. 

Además, KeePass también puede generar contraseñas robustas según elijamos en un conjunto de posibilidades, donde podremos seleccionar desde los caracteres a elegir hasta el algoritmo de cifrado.

KeePass es una buena opción a plantearse a la hora de trabajar con gestores de contraseñas.

Para la instalación en Ubuntu y derivados, basta con ejecutar:

```bash
  sudo apt install keepass2
```
