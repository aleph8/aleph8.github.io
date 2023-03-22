--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Laboratory 
date: "2022-07-06" 
description: 
image: 
series: 
tags: 
title: Arachne 
--- 

[Arachne is a completely open source project](https://github.com/aleph8/Arachne); you can find all the design and programming files in its repository.

## Inspiration

I have always been fascinated by everything related to "nature's creation". Something that has always caught my attention are arachnids, from their amazing survival methods (for example autotomy, also present in lizards), as well as the way they hunt their prey to their incredible design.

Influenced by this, I started to think about a bio-inspired robot, which would be able to stand up, after standing up. This is when "Arachne" was born. The name comes from Greek mythology.

## Leg design

I mainly focused on the design; I thought that the most aesthetic was the design with six legs, but this meant higher costs in terms of electricity, printing, time... etc. So I put this idea aside for the future and focused on functionality. It was time to design the legs.
<div style="text-align: center;"><img src="arachne1.png" alt="Image" width="500"></div>

The leg has three degrees of freedom to perform the movement. As we can see in the image, we have three servomotors, one per section: end, center, chassis.

## Chassis design

Once the legs were designed, it was the turn of the chassis, where the electronics would go. The chassis is divided into two levels.

<div style="text-align: center;"><img src="arachne2.png" alt="Image" width="500"></div>

The first level is more robust, because it is the union of all the legs and must provide the necessary robustness to the final design. The second level is screwed to the servomotors of the chassis; it is lighter than the previous one and is where the electronics are located, while the lower level is where the battery is located.

## Basic electronics

The electronics consists of a Raspberry Pi 3b+ and the integrated PCA9685 (motor driver) that with a few connections allows us to connect up to 16 servos in our Raspberry.

<div style="text-align: center;"><img src="arachne3.png" alt="Image" width="500"></div>

## Demonstration

Arachne gets up and keeps standing !

<div style="text-align: center;"><iframe width="646" height="461" src="https://www.youtube.com/embed/ejJqCW5x-p0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>