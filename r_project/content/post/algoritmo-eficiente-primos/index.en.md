--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Software 
date: "2021-12-22"
lastmod: "2021-12-23"
description: 
image: 
series: 
tags: 
title: Efficient Algorithm for the Calculation of Prime Numbers 
--- 

The task of calculating very large prime numbers is very expensive. That is why I am making a specification of an algorithm that drastically reduces the time spent in calculating the prime numbers from 2 to the selected number. 

I have managed to optimize the algorithm using brute force, in which all possible divisors are tested for each number:

<div style="text-align: center;"><img src="primes1.png" alt="Image" width="800"></div> 

Improvement of the previous algorithm:

<div style="text-align: center;"><img src="primes2.png" alt="Image" width="800"></div>
