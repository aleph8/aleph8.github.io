--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Servers 
date: "2022-05-30" 
description: 
image: 
series: 
tags: 
title: VMware ESXi 
--- 

ESXi is a bare-metal hypervisor. This means that the operating system is not an intermediary between the software virtualization and the hardware, since being bare-metal, ESXi is installed directly on the server.

To obtain the image with which to boot and install it, we must access the official VMware website. Once registered, we can download the latest version of ESXi to create a bootable device.


<div style="text-align: center;"><img src="esxi1.png" alt="Image" width="700"></div> 

Once we have done this, we boot from the device. In my case I have done this by changing the boot order within the Integrated Dell Remote Access Controller (iDRAC) options in "System BIOS"; this can also be done by pressing the corresponding key on server boot.

Subsequently, you only have to follow the steps indicated.

<div style="text-align: center;"><img src="esxi2.png" alt="Image" width="700">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="esxi3.png" alt="Image" width="700"></div> 

