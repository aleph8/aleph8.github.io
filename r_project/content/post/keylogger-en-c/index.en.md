---
aliases:
author: Alejandro García Peláez
categories:
- Cybersecurity
date: "2021-11-29"
description:
image: 
series:
tags:
- hacking-tools
title: Keylogger in C
---

Spyware is a type of computer virus that, after infecting the victim's computer, seeks to obtain all kinds of information from the victim (from screenshots to recording audio or accessing the camera).

A keylogger is a type of spyware that records the victim's keystrokes to obtain personal data: passwords, bank details, access to accounts...

Using C I have programmed a keylogger; its operation is simple:

* First of all, the program is executed on the infected computer:

<div style="text-align: center;">
  <img src="key1.png" alt="Image" width="500">
</div>

* Then the victim user enters all kinds of information:

<div style="text-align: center;">
  <img src="key2.png" alt="Image" width="400">
</div>

* Finally, this information is saved in some way. In my case I have programmed it to be saved in "file.txt" in the same program execution directory:

<div style="text-align: center;">
  <img src="key3.png" alt="Image" width="400">
</div>

