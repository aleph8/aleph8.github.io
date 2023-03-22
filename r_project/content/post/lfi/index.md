--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Ciberseguridad 
date: "2023-01-30" 
description: 
image: 
series: 
tags: 
- pentesting-web 
title: LFI 
--- 

LFI o *Local File Inclusion* es una de las dos vulnerabilidades del estilo File Inclusion que afecta comunmente a las aplicaciones web. En caso de explotarla satisfactoriamente, puede derivar en una RCE o *Remote Code Execution*.

Gracias a una variable, podemos apuntar directamente a un fichero del sistema de archivos del lado del servidor; una vez apuntado, se ejecutará del lado de servidor, con la rutina web correspondiente. Para explicarlo mejor, vamos a trabajar en un entorno controlado, desplegando nuestro propio servicio web en local, con el siguiente formato:

```bash
  php -S localhost:12345
```

Este servicio contiene un "index.php" que toma por GET el contenido de la variable de nombre "variable", de la siguiente forma:

<div style="text-align: center;"><img src="lfi1.png" alt="Image" width="600"></div> 

* LFI como Directory Path Traversal

Podemos confundir estas dos vulnerabilidades, ya que ambas pueden tener el mismo comportamiento. En esta ocasión vamos a ver el contenido de un fichero que se encuentra en el mismo directorio en el que tenemos desplegado nuestro servicio:

<div style="text-align: center;"><img src="lfi2.png" alt="Image" width="600"></div> 

* LFI como RCE

Supongamos que obtenemos una vía potencial para subir ficheros y localizarlos. En este caso podríamos hacer un exploit en php y apuntarlo para que se añada su contenido y ejecución a la rutina de la aplicación web. En este caso he preparado un fichero denominado "exploit.php" que ejecutará "phpinfo":

<div style="text-align: center;"><img src="lfi3.png" alt="Image" width="500"></div> 
