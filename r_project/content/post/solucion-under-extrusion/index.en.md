--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- 3D Printing
date: "2021-06-09" 
description: 
image: 
series: 
tags: 
title: Solution to Under Extrusion 
--- 
As soon as I started printing, it seemed that everything was going well with the printer, but the pieces sometimes came out without filament in certain parts or the figures did not come out well (circles for example).

I mainly thought it was a problem with the bed calibration. Once calibrated, the same thing kept happening. Later I thought about the tension of the belts that move the axes (specifically the X and Y), but after tightening them nothing changed.

The problem had me a little bit worried, so I did a little research on the subject. It turns out that the Ender 3 (and Pro) has an extrusion system like the one shown in the following image:

This extrusion system has a problem known as "Under-Extrusion" due to the following:

* It may be that the spring is not exerting enough force, which is why the screw shown in the picture can be tightened or loosened. I thought I saw that older models do not have this screw, but there are printable parts to solve this problem. If the problem persists, it may be that the opposite is true, i.e. it is too tight. In that case it would be enough to loosen it.

* There is a sprocket that pushes the filament into the extruder. The problem is that the filament is in contact with the Z axis and this greases the filament so sometimes you can hear a kind of "crack-crack" of the sprocket as it is not able (because of the grease) to push the filament as it slips.

* Finally the support that comes with the printer for the filament may not be sufficient for the spool to slide smoothly. This leads to the aforementioned noise being heard again, as the system lacks the necessary force to pull the filament.


Once I knew this, the first thing I did was to adjust the screw. It seemed that the printer printed better; there were fewer gaps and imperfections.

The problem was that it kept making the same noise, more and more frequently, and even stopped pushing the filament halfway through the print, destroying the whole job. To solve this problem what I did was to print a replacement handle to the one that came from the factory (the design is in thingiverse) to which several bearings were inserted in order to facilitate the movement of the spool.

Finally, I placed a piece of Teflon to prevent the filament from rubbing against the Z axis, thus solving the problems mentioned above.