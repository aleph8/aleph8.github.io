---
id: 30052022
title: ESXi VMware 
specialty: pillars
author: "Alejandro García Peláez"
date: "30-05-2022"
categories: []
tags: []
group: Server
links:
- 02052022
---


:::::{.spanish}


ESXi es un hypervisor bare-metal. Esto significa que el sistema operativo no se encuentra como intermediario entre la virtualización software y el hardware, ya que al ser bare-metal, ESXi es instalado directamente en el servidor.

Para obtener la imagen con la que bootear e instalarlo, debemos acceder a la página oficial de VMware. Una vez registrados, podemos descargar la última versión de ESXi para crear un dispositivo booteable.


<div style="text-align: center;"><img src="images/esxi1.png" alt="Image" width="700"></div> 

Una vez hemos hecho esto, booteamos desde el dispositivo. En mi caso he hecho esto cambiado el orden de inicio dentro de las opciones del Integrated Dell Remote Access Controller (iDRAC) en "System BIOS"; esto también puede hacerse presionando la tecla correspondiente en el arranque del servidor.

Posteriormente, solo hay que seguir los pasos que nos indiquen.

<div style="text-align: center;"><img src="images/esxi2.png" alt="Image" width="700"><br><img src="images/esxi3.png" alt="Image" width="700"></div> 

:::::

:::::{.english}

ESXi is a bare-metal hypervisor. This means that the operating system is not an intermediary between the software virtualization and the hardware, since being bare-metal, ESXi is installed directly on the server.

To obtain the image with which to boot and install it, we must access the official VMware website. Once registered, we can download the latest version of ESXi to create a bootable device.


<div style="text-align: center;"><img src="images/esxi1.png" alt="Image" width="700"></div> 

Once we have done this, we boot from the device. In my case I have done this by changing the boot order within the Integrated Dell Remote Access Controller (iDRAC) options in "System BIOS"; this can also be done by pressing the corresponding key on server boot.

Subsequently, you only have to follow the steps indicated.

<div style="text-align: center;"><img src="images/esxi2.png" alt="Image" width="700"><br><img src="images/esxi3.png" alt="Image" width="700"></div> 

:::::