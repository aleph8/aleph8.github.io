--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Cybersecurity 
date: "2022-12-17" 
description: 
image: 
series: 
tags: 
- cryptography 
title: Creating Strong Passwords 
--- 

It is increasingly common for us to handle several passwords at the same time. If we want them to be secure and protected against possible brute force attacks, based on a personal dictionary, we must ensure the robustness of these and change them periodically; some good practices are:

1. Combine letters (uppercase and lowercase) with numbers.

2. Use words that are not related to you (avoid using names, surnames, dates... ).

3. Transpose or replace the letters once you have the password.

4. Password of considerable length (the more characters the more possible passwords).


These techniques guarantee you a strong password but can be difficult to memorize, here are some options to overcome this:

* [Diceware technique](https://diceware.dmuth.org/): allows us to obtain a string from a series of words that are randomly ordered. By memorizing the string, since it is a series of words in sequence, we would have enough.

* Hardware solution: implementation of a device that stores and generates passwords. You can see an example with my [Digital Key](/en/p/2022/digital-key) .

* Software Solution: password managers such as KeePass.

<div style="text-align: center;"><img src="creation1.png" alt="Image" width="500"></div> 

Keepass is an "Open Source" password manager that allows you to store all your passwords securely, using a single password to access the "Database" where the rest of the passwords are stored.

Everything is stored in a file that acts as a database, with extension "kdbx"; in this file, not only the passwords are encrypted, but all the information associated with them (username, URL ... ) is encrypted in AES-256, with support for different encryption algorithms through plugins. 

In addition, KeePass can also generate strong passwords as we choose from a set of possibilities, where we can select from the characters to choose to the encryption algorithm.

KeePass is a good option to consider when working with password managers.

For installation on Ubuntu and derivatives, just run:

```bash
  sudo apt install keepass2
```
