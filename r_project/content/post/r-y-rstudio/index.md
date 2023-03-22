---
aliases:
author: Alejandro García Peláez
categories:
- La senda de la programación
date: "2023-02-01"
description:
image: 
series:
tags:
title: R y Rstudio
---

# Conceptos Fundamentales

## Asignación de variables 

La asignación de variables se realiza con el uso de '<-'. Esta notación surge de las '*pipelines*' o tuberías que podemos ver presentes en algunos sistemas operativos como GNU/Linux (en el caso de Linux el uso de pipelines se lleva a cabo con la notación '|' que permite redirigir la salida de un comando o **stdout** a la entrada de otro o **stdin**).

Si queremos darle a la variable x el valor de la raíz cuadrada de 16, lo podríamos hacer de la siguiente forma:

```r
  x <- sqrt(16)
```

## Tipos de datos básicos

Similares a los de Python , con un pequeño cambio en la notación de los números enteros:

* Tipo '**numeric**': números reales y números enteros; la diferencia en la notación es que se debe escribir el número seguido de una L. 


* Tipo '**character**': cadena de caracteres.


* Tipo '**complex**': números complejos (por ejemplo 5+4i).


* Tipo '**logical**': valores lógicos; se evalúa como TRUE o FALSE.


Con la función '**class**' podemos ver el tipo del dato que le pasemos como argumento.

Con la función '**is.<type_data>()**' (donde 'type_data' lo sustituimos por el tipo que queramos comprobar) podemos comprobar si el argumento que le pasamos es de un determinado tipo.

## Casting

Con la función '**as.<type_data>()**' convertimos la variable o valor que le pasemos como argumento a otro tipo de dato (sustituyendo <type_data>). 

<p style="text-align: center"><b>¡¡CUIDADO!!</b></p>

Hay que gastar cuidado con esta operación, ya que, por ejemplo:

```r
  x <- as.numeric("Hello World!")
```

La operación anterior guarda en la variable x el valor **NA**.

## Valor NA

La constante **NA** la obtenemos en R cuando una operación no se ha podido realizar correctamente, como la del apartado anterior; además se puede usar para designar un valor que todavía desconocemos.

## Consultar información sobre una función

Si no sabemos qué es lo que hace una función o los argumentos que recibe, podemos escribir un interrogante seguido del nombre de esa función para obtener toda la información necesaria. Por ejemplo, queremos saber qué hace '**seq**':

```r
  ?seq
```

## Vectores

Los vectores son la estructura de datos más básica de R y la más importante. Los vectores solo pueden contener un tipo de dato en concreto; declaramos un vector de la siguiente manera:

```r
  x <- c(1,2,3,4,5)
```

Un vector es una estructura de datos unidimensional, por lo que si intentamos construir un vector de vectores R los convierte a un único vector (flat).

### Acceso a posiciones de un vector

Para acceder a las posiciones del vector lo hacemos mediante corchetes tal y como se muestra en el siguiente ejemplo:

```r
v <- c(1,2,3,4,5,6,7,8,9,10)  

v[1] # Obtenemos el primer elemento del vector, es decir el '1'  
v[1,4] # ERROR! La forma correcta es la siguiente  

v[c(1,4)] # Obtenemos el primer y cuarto elemento del vector  

v[1:5] # Obtenemos todos los elementos desde el primero hasta el quinto  

v[-c(2,3)] # Podemos usar el '-' para acceder a todas las posiciones excepto aquellas que no queramos  

v[ v < 5 ] # Obtenemos todos los valores menores que 5

```

### Funciones o expresiones útiles trabajando con vectores

Para más información sobre cada una de estas funciones, consulta la documentación.

* **seq**: genera valores dado un número de inicio y fin. Podemos definir la distancia entre números.

* **sum**: devuelve la suma de todos los componentes del vector.

* **min ó max**: devuelve el número más pequeño o más grande del vector, depende si usamos una función u otra.

* **unique**: dado un vector lo devuelve sin componentes repetidos.

* **rev**: devuelve el vector con los componentes en orden inverso.

* **order**: nos devuelve las posiciones en las que deberían ir los componentes del vector para que estuviera ordenado.

* **sample**: se usa para obtener una serie de valores aleatorios de un vector.

* La expresión **1:10** nos genera la secuencia de números del 1 (valor inicial) al 10 (valor final). Podemos usar esta expresión para generar la secuencia de valores que queramos.
