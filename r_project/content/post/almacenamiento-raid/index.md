--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Servidores 
date: "2022-05-20" 
description: 
image: 
series: 
tags: 
title: Almacenamiento RAID 
--- 

Redundant Array of Independant Disk (RAID) es un tipo de almacenamiento virtual de datos

Con varios discos físicos podemos crear un disco virtual con los siguientes propósitos: mejorar el rendimiento o redundancia de datos. Los datos se distribuyen de una forma u otra dependiendo el nivel RAID con el que el disco es configurado.

**RAID LEVELS (0-1-5)**

De momento solo estoy trabajando con los tres niveles elementales; el resto o están en desuso o son una combinación de estos tres niveles.

* **RAID 0 (striping)** : la capacidad del volumen en este nivel, es la suma de la capacidad de discos físicos que lo forman. Los datos son "segmentados" y distribuidos entre los discos. Se mejora el rendimiento, pero si uno de los discos falla se pierde toda la información.


* **RAID 1 (mirroring)**: en este nivel, los datos escritos en los discos son iguales; por tanto si uno de los discos falla, los datos pueden ser fácilmente recuperados. El rendimiento se puede ver afectado ya que se debe escribir la misma información en todos los discos.


* **RAID 5 (block-level striping)**: requiere al menos tres discos. En este caso uno de los discos no se usará, ya que en el caso de fallo o pérdida de datos, podrá calcularse por un simple cálculo de paridad.

