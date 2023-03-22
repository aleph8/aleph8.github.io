--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Servers 
date: "2022-05-10" 
description: 
image: 
series: 
tags: 
title: How to Customize a Linux Distro 
--- 

Since I work with different operating systems, I have decided to "create" my own GNU/Linux distribution to have all the utilities I usually use at hand, and to have an image (*iso) to install on the server and create different OS versions according to my needs.

It is a very simple process for which I have used the "systemback" tool.

First of all you must create a virtual machine where you install the base operating system and leave it as you want. In my case I have used the latest stable image of Lubuntu.

<div style="text-align: center;"><img src="personalizar1.png" alt="Image" width="500">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="personalizar2.png" alt="Image" width="500"></div> 

Using "systemback" we create a first copy of the system in ".sblive" format and then convert it to ".iso".

Thanks to this, you can quickly install base systems, clean and without unnecessary packages, allowing you to reserve different virtual machines according to the purpose you want to give them.