--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- 3D Printing 
date: "2022-01-13" 
description: 
image: 
series: 
tags: 
title: Ender 3 Pro Direct Extrusion
--- 

As I have been saying from the beginning, the "Bowden" type extrusion on this printer was giving me problems.

This extrusion system has a main advantage and it is that it has a lower mass in the extruder carriage, since the motor is directly coupled to the chassis. However, it has several problems, which is what has probably been happening to me. For example, it may be that the motor that pushes the filament does not have enough force. Here is the sound that my printer emitted when it did not have enough power.



One of the things I could do was to update the printer's firmware, since it was in a rather primitive version. It turns out that the printer came with a board a little complicated to update (V1), especially because you had to make use of an Arduino to "burn" the bootloader. On the other hand I was quite eager to have direct extrusion and I decided to add it, with direct extrusion I added more weight to the extruder carriage, but I gained in extrusion speed and less risks caused by the motor. It also allowed me to print certain materials with higher temperature requirements, such as TPU.



Subsequently, I did the following:

<div style="text-align: center;"><img src="ender3directdrive.jpg" alt="Image" width="500"></div> 

1. I printed a design I found on Thingiverse and found it to be ideal.

2. Once everything was printed, I proceeded to disassemble the motor that came standard on the chassis (as an extra, I changed the plastic piece that acted as a clamp for an aluminum one, as it was starting to wear out).

3. I completely disassembled the extruder carriage and attached the printed part to it (while I was at it, I adjusted the eccentric wheels).

4. I reassembled the carriage and reconnected all the disconnected wires . 


Since I made this improvement, the printer has not given me any more problems; it prints without problems and does not skip steps. In addition to this, as you can see, I also changed the coating fan; the one that came as standard was not very effective, although I will talk about this some other time.

