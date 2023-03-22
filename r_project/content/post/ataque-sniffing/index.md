--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Ciberseguridad 
date: "2023-02-24" 
description: 
image: landing.png
series: 
tags: 
title: Packet Sniffing (Concepto)
--- 

Un ataque 'sniffing' se realiza mediante la captura de paquetes en el tráfico de una red, pudiendo acceder a su contenido y recolectar datos, incluso ver credenciales en texto claro debido a una conexión no segura.

Pero ¿cómo puede pasar esto? Realmente esta técnica se usa para el análisis de redes, posibles problemas que  puedan ocasionarse, y están dirigidos a ciertos equipos. Por defecto nuestra tarjeta de red o NIC suele tener  esta función deshabilitada por un modo que se conoce como "promiscuous mode"; activando este modo, habilitamos la NIC para recibir todo el tráfico, lo que puede ser usado para automatizar el análisis de la red, o para acciones menos éticas.

Ya no solo esto, sino que en el caso de que un atacante esté buscando cierta información, este puede filtrar todos los paquetes para encontrarla, pudiendo dejar un proceso continuo que permanentemente esté escaneando la red objetivo.

Además del robo de credenciales, puede derivar en una serie de ataques, por ejemplo:

+ **Password Sniffing**: lo que hemos tratado anteriormente. Suele pasar en redes públicas con una seguridad débil.

+ **DNS poisoning**: consiste en redirigir el tráfico a sitios falsos (phising).

+ **Session Hijacking**: el uso de la información registrada puede ser usada para 'suplantar' la identidad en cierta plataforma y poder iniciar sesión sin el uso de credenciales.
