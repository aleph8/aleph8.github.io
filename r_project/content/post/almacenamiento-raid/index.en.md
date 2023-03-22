--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Servers 
date: "2022-05-20" 
description: 
image: 
series: 
tags: 
title: RAID Storage 
--- 

Redundant Array of Independent Disk (RAID) is a type of virtual data storage.

With several physical disks we can create a virtual disk for the following purposes: to improve performance or data redundancy. The data is distributed in one way or another depending on the RAID level with which the disk is configured.

**RAID LEVELS (0-1-5)**

At the moment I am only working with the three elementary levels; the rest are either in disuse or are a combination of these three levels.

* **RAID 0 (striping)** : the capacity of the volume at this level is the sum of the capacity of the physical disks that form it. The data is "segmented" and distributed among the disks. Performance is improved, but if one of the disks fails, all data is lost.


* **RAID 1 (mirroring)**: at this level, the data written to the disks are equal; therefore if one of the disks fails, the data can be easily recovered. Performance may be affected since the same data must be written to all disks.


* **RAID 5 (block-level striping)**: requires at least three disks. In this case one of the disks will not be used, since in case of failure or data loss, it can be calculated by a simple parity calculation.

