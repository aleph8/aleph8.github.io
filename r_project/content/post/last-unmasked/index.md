--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Software 
date: "2021-09-22" 
description: 
image: 
series: 
tags: 
title: The Last Unmasked (Android Game) 
--- 

Esta vez vengo con un juego; la historia de Lea y su travesía como "The Last Unmasked". En este juego nuestra protagonista tiene que ir saltando a espectros, corrompidos por "el abismo".

El juego está programado en Java usando Android Studio como IDE. Está siendo todo un proyecto por el gran mundo de desarrollo móvil que se ha hecho paso en mi camino.

Por ejemplo, a la hora de crear las físicas del mundo asociadas tenías que tener en cuenta distintos tipos de cuerpos programables; el suelo es de tipo "estático" mientras que el personaje principal es "dinámico". Esto es muy relevante a la hora de iniciar el mundo para las distintas fuerzas que se ejercen sobre los distintos cuerpos.
 
<div style="text-align: center;"><img src="last1.png" alt="Image" width="200"></div> 

Por otro lado, al ser un juego "infinito" he tenido que pensar una manera de generar a los enemigos  óptimamente de tal manera que se consuman los menos recursos posibles. En otros juegos puedes hacer un mapa donde el personaje llega a una meta y ahí se acaba el nivel; aquí mientras el protagonista siga vivo, el juego continúa y solo acaba cuando muere. Es por eso que la manera de implementar esto fue con un algoritmo que controlase la generación y posición de los enemigos respectivamente, de tal forma que cuando el objeto "enemigo" saliese del escenario, el algoritmo lo destruyera para no colapsar el dispositivo. De no ser así el juego seguiría generando enemigos hasta consumir todos los recursos del teléfono en cuestión.

Por último los diseños (al igual que los sprites) están creados por mí pixel a pixel. He hecho diversos bocetos antes de ponerme a ello para hacerme una idea de lo que quería siendo el resultado final el que podréis ver en las imágenes de abajo.

<div style="text-align: center;"><img src="last2.jpg" alt="Image" width="700"></div> 