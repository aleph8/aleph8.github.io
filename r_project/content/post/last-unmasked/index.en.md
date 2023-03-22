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
título: The Last Unmasked (Juego para Android) 
--- 

This time I come with a game; the story of Lea and her journey as "The Last Unmasked". In this game our protagonist has to go jumping spectres, corrupted by "the abyss".

The game is programmed in Java using Android Studio as IDE. It is being quite a project because of the great world of mobile development that has come my way.

For example, when creating the associated world physics you had to take into account different types of programmable bodies; the ground is a "static" type while the main character is "dynamic". This is very relevant when starting the world for the different forces exerted on the different bodies.
<div style="text-align: center;"><img src="last1.png" alt="Image" width="200"></div> 

On the other hand, being an "infinite" game, I had to think of a way to generate the enemies optimally in such a way as to consume as few resources as possible. In other games you can make a map where the character reaches a goal and then the level ends; here, as long as the main character is alive, the game continues and only ends when he dies. That's why the way to implement this was with an algorithm that controlled the generation and position of the enemies respectively, so that when the "enemy" object left the stage, the algorithm would destroy it so as not to collapse the device. Otherwise the game would continue to generate enemies until it consumed all the resources of the phone in question.



Finally the designs (as well as the sprites) are created by me pixel by pixel. I made several sketches before I started to get an idea of what I wanted, being the final result what you can see in the images below.

<div style="text-align: center;"><img src="last2.jpg" alt="Image" width="700"></div>